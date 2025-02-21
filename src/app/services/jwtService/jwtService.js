import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import Api from '../../../inc/Apiv2';
import Pref from '../../../inc/Pref';
import { removeUserData } from 'inc/Utils';

class jwtService extends FuseUtils.EventEmitter {

    init() {
        this.handleAuthentication();
    }

    handleAuthentication = () => {
        let access_token = this.getAccessToken();
        this.setSession(access_token);
        this.emit('onAutoLogin', this.getUser());
    };

    emitOnAutoLogin() {
        this.emit('onAutoLogin', this.getUser());
    }

    emitOnSetup() {
        this.emit('onSetup');
    }

    createUser = (data) => {
        return new Promise((resolve, reject) => {
            axios.post('/api/auth/register', data)
                .then(response => {
                    if (response.data.user) {
                        this.setSession(response.data.access_token);
                        resolve(response.data.user);
                    } else {
                        reject(response.data.error);
                    }
                });
        });
    };

    signInWithEmailAndPassword = (email, password) => {
        return new Promise((resolve, reject) => {
            Api.get('/login/login', {username: email, password}, rsp => {
                if (rsp.ok) {
                    this.setSession(rsp.token);
                    resolve(rsp.user);
                } else {
                    reject(rsp.msg);
                }
            });
        });
    };

    signInWithToken = () => {
        return new Promise((resolve, reject) => {
            Api.get('/auth/verify', {}, false)
                .then(response => {
                    // this.setSession(rsp.token);
                    this.setUser(response.data.user);
                    resolve(response.data.user);
                }).catch(response => {
                    reject(response.message);
                })
        });
    };

    updateUserData = (user, callback) => {
        Api.post('/me/update', {
            user: user
        }, callback);
    };

    setSession = access_token => {
        Pref.sessionToken = access_token;
        if (access_token) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    setUser = user => {
        Pref.sessionUser = user;
    };

    getUser = () => {
        return Pref.sessionUser;
    };

    logout = () => {
        this.setSession(null);
        this.setUser(null);
        removeUserData();
    };

    getAccessToken = () => {
        return Pref.sessionToken;
    };
}

const instance = new jwtService();

export default instance;