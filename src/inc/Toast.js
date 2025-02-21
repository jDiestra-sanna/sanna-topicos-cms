import React from 'react';
import * as Actions from '../app/store/actions';
import { store } from 'app/store';

export default class Toast {

    static show(message) {
        store.dispatch(Actions.showMessage({
            message: message,
            variant: 'default',
        }));
    }

    static success(message = null) {
        store.dispatch(Actions.showMessage({
            message: message || 'Acción realizada correctamente',
            variant: 'success',
        }));
    }

    static warning(message) {
        store.dispatch(Actions.showMessage({
            message: message,
            variant: 'warning',
        }));
    }

    static error(message) {
        store.dispatch(Actions.showMessage({
            message: message,
            variant: 'error',
        }));
    }

    static info(message) {
        store.dispatch(Actions.showMessage({
            message: message,
            variant: 'info',
        }));
    }
}