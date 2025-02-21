import {KEY} from './Config';

export default class Pref {

    static get(key) {
        return localStorage.getItem(KEY + '_' + key);
    }

    static set(key, val) {
        return localStorage.setItem(KEY + '_' + key, val);
    }

    static int(key, defVal = 0) {
        let val = this.get(key);
        return parseInt(val) || defVal;
    }

    static get sessionUser() {
        let val = this.get('session_user');
        return val ? JSON.parse(val) : null;
    }

    static set sessionUser(val) {
        this.set('session_user', JSON.stringify(val));
    }

    static get sessionToken() {
        return this.get('session_token') || '';
    }

    static set sessionToken(val) {
        this.set('session_token', val || '');
    }

    static get sessionUsers() {
        let val = this.get('session_users_v3');
        return val ? JSON.parse(val) : [];
    }

    static set sessionUsers(val) {
        this.set('session_users_v3', JSON.stringify(val));
    }

}