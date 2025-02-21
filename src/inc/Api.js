import axios from 'axios';
import Util, {getUser} from './Utils';
import Pref from './Pref';
import Alert from "./Alert";
import jwtService from "../app/services/jwtService/jwtService";
import history from "@history/@history";

export default class Api {

    static DOMAIN = ['localhost', '127.0.0.1'].includes(window.location.hostname)
        ? 'sanna.gofocus.info'
        : window.location.hostname;

    static PROTOCOL = ['localhost', '127.0.0.1'].includes(window.location.hostname)
        ? 'https:'
        : window.location.protocol;

    static URL_BASE = Api.PROTOCOL + '//' + Api.DOMAIN + '/api/admin';

    static URL_LOG_FILE = Api.PROTOCOL + '//' + Api.DOMAIN + "/api/log_file/read/";

    static processData(data, callback) {
        if (data && data.msg === 'session_expired') {
            Alert.error('La sesión ha expirado', () => {

                // eliminar el usuario actual de la lista
                Pref.sessionUsers = Pref.sessionUsers.filter(o => o.id !== getUser().data?.id);
                jwtService.logout();
                history.push('/login');

            });
        } else {
            if (callback) {
                callback(data);
            }
        }
    }

    static get(url, data, callback, loading) {

        if (typeof data === 'function') {
            loading = callback;
            callback = data;
            data = {};
        }

        if (typeof loading === 'undefined') {
            loading = true;
            Util.loading(true);
        } else if (loading) {
            Util.loading(loading);
        }

        Api.axios().get(url, {params: data})
            .then(response => {
                let data = response.data;
                if (loading) Util.loading(false);
                this.processData(data, callback);
            })
            .catch(function (error) {
                if (loading) Util.loading(false);
                if (callback) callback({
                    ok: false, msg: error.toString(), errors: []
                });
            });
    }

    static post(url, data, callback, loading) {

        if (typeof data === 'function') {
            loading = callback;
            callback = data;
            data = {};
        }

        if (typeof loading === 'undefined') {
            loading = true;
            Util.loading(true);
        } else if (loading) {
            Util.loading(loading);
        }

        Api.axios().post(url, data)
            .then(response => {
                let data = response.data;
                if (loading) Util.loading(false);
                this.processData(data, callback);
            })
            .catch(function (error) {
                if (loading) Util.loading(false);
                if (callback) callback({
                    ok: false, msg: error.toString(), errors: []
                });
            });
    }

    static export(endpoint, fil, format) {
        let data = {
            ...fil, export: format, token: Pref.sessionToken
        };

        let url = Api.URL_BASE + endpoint;

        let form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', url);
        form.setAttribute('target', '_blank');

        for (let [key, value] of Object.entries(data)) {
            let hiddenField = document.createElement('input');
            hiddenField.setAttribute('type', 'hidden');
            hiddenField.setAttribute('name', key);
            hiddenField.setAttribute('value', value);
            form.appendChild(hiddenField);
        }

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }

    static axios() {
        return axios.create({
            baseURL: Api.URL_BASE
            //headers: {'Authorization': 'Bearer ' + token},
        });
    }

}
