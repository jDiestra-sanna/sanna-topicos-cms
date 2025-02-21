import moment from 'moment';
import Pic from './Pic';

import GuestConfig from "../views/GuestConfig";
import AdminGuestConfig from '../views/admin/AdminGuestConfig';
import AdminUserConfig from '../views/admin/AdminUserConfig';
import platform from "platform";
import * as queryString from "qs";
import history from "@history";

const $loading = document.getElementById('loading');
const $loading_text = document.getElementById('loading-text');

let _user;
export let stg;

export function setUser(user) {
    _user = user;
    stg = user.settings;
}

export function removeUserData() {
    if (_user) _user.data = null;
}

export function getUser() {
    return _user;
}

function buildFormData(formData, data, parentKey) {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
        Object.keys(data).forEach(key => {
            buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
        });
    } else {
        const value = data == null ? '' : data;

        formData.append(parentKey, value);
    }
}

export function objectToFormData(data) {
    const formData = new FormData();

    buildFormData(formData, data);

    return formData;
}

/**
 * Armaremos las rutas para el sistema segun el sudbominio,
 * con la finalidad de usar un solo codigo fuente.
 * Si accedemos desde admin.domain.com tomaremos las rutas correspondientes de esa carpeta
 * @returns {[]}
 */
export function getRoutes() {
    let routes = [];
    routes.push(GuestConfig);
    routes.push(AdminGuestConfig);
    routes.push(AdminUserConfig);
    return routes;
}


export default class Util {

    static loading(show) {
        if (show) {

            if (typeof show === 'string') {
                $loading_text.innerHTML = show;
            } else {
                $loading_text.innerHTML = 'Cargando...';
            }
            //$loading.style.display = 'block';
            $loading.classList.add('visi');

        } else {
            //$loading.style.display = 'none';
            $loading.classList.remove('visi');
        }

    }

    static time() {
        return parseInt(new Date().getTime() / 1000, 10);
    }

    // Convertir cualquier cosa a numero
    static num(str, decimals = null, defult = 0) {
        let n = Number(str) || defult;
        return (decimals != null) ? n.toFixed(decimals) : n;
    }

    static pad(num, size) {
        let s = num + '';
        while (s.length < size) s = '0' + s;
        return s;
    }

    static date() {
        return moment().format('DD/MM/YYYY');
    }

    static decamelize(str, separator = '_') {
        separator = typeof separator === 'undefined' ? '_' : separator;

        return str
            .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
            .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
            .toLowerCase();
    }

    static coin(value) {
        return stg.coin + ' ' + coinFormat(value);
    }

    static decimal2(value) {
        let number = Number(value) || 0;
        return number.toFixed(2);
    }

    static destinationPoint = function (point, brng, dist) {
        dist = dist / 6371;
        brng = brng.toRad();

        let lat1 = point.lat().toRad(), lon1 = point.lng().toRad();

        let lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
            Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));

        let lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
            Math.cos(lat1),
            Math.cos(dist) - Math.sin(lat1) *
            Math.sin(lat2));

        if (isNaN(lat2) || isNaN(lon2)) return null;

        return {lat: lat2.toDeg(), lng: lon2.toDeg()};
    };

    static setupBasic(user) {
        let link = document.createElement('link'),
            oldLink = document.getElementById('favicon');
        link.id = 'favicon';
        link.rel = 'shortcut icon';
        link.href = user.settings.pic_favicon;
        if (oldLink) {
            document.head.removeChild(oldLink);
        }
        document.head.appendChild(link);

        document.title = user.settings.brand;
    }

    /**
     * Limpiar filtros, solo dejar los que tienen valores.
     * @param fil
     * @returns {{}}
     */
    static cleanFil(fil) {

        let finalFil = {};

        for (let key in fil) {
            let value = fil[key];
            if (value) {
                finalFil[key] = value;
            }
        }

        return finalFil;
    }

    static dataSession() {
        return {
            uuid      : uuid(),
            language  : navigator.language,
            os        : platform.os.family,
            os_version: platform.os.version,
            user_agent: navigator.userAgent,
            platform  : 'web',
            app_version: _user.settings.cms_version
        };
    }


    static params() {
        let location = history.location;
        return location ? queryString.parse(location.search, {ignoreQueryPrefix: true}) : {};
    }

    static humanFilesize(size, precision = 2) {
        let units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let step = 1024;
        let i = 0;
        while ((size / step) > 0.9) {
            size = size / step;
            i++;
        }
        return parseFloat(size).toFixed(precision) + units[i];
    }

    static isJSON(texto) {
        if (!texto) return;
        
        try {
            JSON.parse(texto);
            return true;
        } catch (error) {
            return false;
        }
    }

    static ago(dateOrTime, short = false) {
        const periods = short
            ? ['seg', 'min', 'hor', 'día', 'sem', 'mes', 'año', 'dec']
            : ['segundo', 'minuto', 'hora', 'día', 'semana', 'mes', 'año', 'década'];
        const lengths = [60, 60, 24, 7, 4.35, 12, 10];
        
        let time;
        if (typeof dateOrTime === 'number') {
            time = dateOrTime;
        } else {
            time = new Date(dateOrTime).getTime() / 1000;
        }
        
        const difference = time - Math.floor(Date.now() / 1000);
        const prefix = difference < 0 ? (short ? '-' : 'Hace') : (short ? '+' : 'En');
        let absDifference = Math.abs(difference);
        
        let j = 0;
        while (absDifference >= lengths[j] && j < lengths.length - 1) {
            absDifference /= lengths[j];
            j++;
        }
        
        const roundedDifference = Math.round(absDifference);
        
        if (roundedDifference !== 1 && !short) {
            periods[j] += 's';
        }
        
        return `${prefix} ${roundedDifference} ${periods[j]}`;
    }

    static getAgeFromDate(date) {
        const birthMoment = moment(date, 'YYYY-MM-DD');
        const currentMoment = moment();
        const age = currentMoment.diff(birthMoment, 'years');
        return age;
    }
}

// MAPS
//TODO: Maps
Number.prototype.toRad = function () {
    return this * Math.PI / 180;
};

Number.prototype.toDeg = function () {
    return this * 180 / Math.PI;
};

// protos
String.prototype.date = function () {
    return this && this !== '0000-00-00' ? moment(this).format('DD/MM/YYYY') : '';
};

String.prototype.datetime = function () {
    return this ? moment(this).format('DD/MM/YYYY hh:mm A') : '';
};

String.prototype.time = function () {
    return this ? moment(this).format('hh:mm A') : '';
};

export function humanDatetime(str) {
    return str ? str.datetime() : '';
}

export function humanTime(str) {
    return str ? str.time() : '';
}

export function humanDate(str) {
    return str ? str.date() : '';
}

export function coin(value) {
    return Util.coin(value);
}

export function coinFormat(value, decimalCount = 2, decimal = ".", thousands = ",") {
    let amount = Number(value) || 0;
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        return '0';
    }
}

export function mins(val) {
    let min_num = parseInt(val);
    let hours = Math.floor(min_num / 60);
    let minutes = Math.floor((min_num - (hours * 60)));

    if (hours < 10)
        hours = '0' + hours;

    if (minutes < 10)
        minutes = '0' + minutes;

    return hours + ':' + minutes;
}

export function kms(val) {
    return parseInt(val).toFixed(1) + ' km';
}

export function number_format(value, decimals = null) {
    let number = Number(value) || 0;
    return (decimals == null ? number.toString() : number.toFixed(decimals))
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function pic(pic, thumb = true) {
    return Pic.url(pic, thumb);
}

export function getModuleTitleByPath(path) {
    let module = getModuleByPath(path);
    return module ? module.title : '';
}

export function getModuleByPath(path) {
    const navigation = _user.menu;

    function findMenuItem(items) {
        for (let item of items) {
            if (item.url === path) {
                return item;
            } else if (item.type === 'collapse') {
                let sel = findMenuItem(item.children);
                if (sel != null) {
                    return sel;
                }
            }
        }
        return null;
    }

    return findMenuItem(navigation);
}

export function uuid() {
    let navigator_info = window.navigator;
    let screen_info = window.screen;
    let uid = navigator_info.mimeTypes.length;
    uid += navigator_info.userAgent.replace(/\D+/g, '');
    uid += navigator_info.plugins.length;
    uid += screen_info.height || '';
    uid += screen_info.width || '';
    uid += screen_info.pixelDepth || '';
    return uid;
}

export class InputUtils {
    static onlyNumbers(event, callbackOnOk) {
        if (!/[0-9]/.test(event.key)) {
            event.preventDefault();
        } 
    }

    static onlyLetters(event, { spaces = false }) {
        const pattern = spaces ? /[a-zA-ZÀ-ÿ\u00f1\u00d1 ]/ : /[a-zA-ZÀ-ÿ\u00f1\u00d1]/;

        if (pattern.test(event.key)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
}