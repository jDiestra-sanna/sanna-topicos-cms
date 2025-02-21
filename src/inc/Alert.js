import React from 'react';
import * as Actions from '../app/store/actions';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { store } from 'app/store';

export default class Alert {

    static error(message, callback) {
        store.dispatch(Actions.openDialog({
            children: (
                <React.Fragment>
                    <DialogContent dividers>
                        <DialogContentText>
                            {message || 'Por favor intente nuevamente o contacte a soporte.'}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary"
                                onClick={() => {
                                    store.dispatch(Actions.closeDialog());
                                    if (typeof callback === 'function') {
                                        callback();
                                    }
                                }}>
                            Aceptar
                        </Button>
                    </DialogActions>
                </React.Fragment>
            ),
            onExit  : () => {
                if (typeof callback === 'function') {
                    callback();
                }
            },
        }))
    }

    static prompt(title, callback, defaultText = '', confirmButton = 'Aceptar', multiline = false) {
        let text = defaultText;
        store.dispatch(Actions.openDialog({
            children: (
                <React.Fragment>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent dividers>

                        <div style={{minWidth: 460}}>

                            <TextField
                                label=""
                                defaultValue={text}
                                onChange={e => {
                                    text = e.target.value;
                                }}
                                fullWidth
                                margin="dense"
                                className="m-0"
                                variant="outlined"
                                multiline={multiline}
                                rowsMax={multiline ? 10 : undefined}
                                autoFocus/>

                        </div>

                    </DialogContent>
                    <DialogActions>
                        <Button
                            color="default"
                            onClick={() => {
                                store.dispatch(Actions.closeDialog());
                            }}>
                            Cancelar
                        </Button>
                        <Button color="secondary"
                                onClick={() => {
                                    store.dispatch(Actions.closeDialog());
                                    callback(text);
                                }}>
                            {confirmButton}
                        </Button>
                    </DialogActions>
                </React.Fragment>
            )
        }))
    }

    static show(title, message, callback) {
        if (!message) {
            message = title;
            title = null;
        }
        store.dispatch(Actions.openDialog({
            children: (
                <React.Fragment>
                    {title && <DialogTitle>{title}</DialogTitle>}
                    <DialogContent dividers>
                        <DialogContentText>{message}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color="primary"
                            onClick={() => {
                                store.dispatch(Actions.closeDialog());
                                if (typeof callback === 'function') {
                                    callback();
                                }
                            }}>
                            Aceptar
                        </Button>
                    </DialogActions>
                </React.Fragment>
            )
        }))
    }

    /**
     * Dialogo de confirmacion, los parametros pueden ser flexibles, de derecha a izquierda, excepto el callback
     * El callback solo será llamado el botón positivo (confirmar) es accionado
     *
     * EJEMPLOS DE USO:
     * Alert.confirm('Mensaje', 'Si, eliminar', () => {});
     * Alert.confirm('Mensaje', () => {});
     * Alert.confirm(() => {});
     */
    static confirm(message, confirmButton, callback, onCancel) {

        let opts = {
            title        : '',
            message      : '',
            confirmButton: 'Confirmar',
            cancelButton : 'Cancelar',
            callback     : () => {
            },
            onCancel     : onCancel,
        };

        if (typeof message === 'object') {
            opts = {...opts, ...message};

        } else if (typeof message === 'function') {
            opts.callback = message;

        } else if (typeof confirmButton === 'function') {
            opts.message = message;
            opts.callback = confirmButton;

        } else {
            opts.message = message;
            opts.confirmButton = confirmButton;
            opts.callback = callback;
        }

        if (!opts.title && !opts.message) {
            opts.title = '¿Estás seguro?';
            opts.message = 'Esta acción no tiene marcha atrás.';
        }

        store.dispatch(Actions.openDialog({
            disableBackdropClick: true,
            children: (
                <React.Fragment>
                    {opts.title && (
                        <DialogTitle>{opts.title}</DialogTitle>
                    )}
                    <DialogContent dividers>
                        <DialogContentText>{opts.message}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="default"
                                onClick={() => {
                                    store.dispatch(Actions.closeDialog());
                                    if (opts.onCancel)
                                        opts.onCancel();
                                }}>
                            {opts.cancelButton}
                        </Button>
                        <Button color="secondary"
                                autoFocus
                                onClick={() => {
                                    store.dispatch(Actions.closeDialog());
                                    opts.callback();
                                }}>
                            {opts.confirmButton}
                        </Button>
                    </DialogActions>
                </React.Fragment>
            )
        }))

    }

}