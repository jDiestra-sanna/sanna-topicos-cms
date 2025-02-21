import React from 'react';
import Api from '../inc/Apiv2';
import Toast from '../inc/Toast';
import Alert from '../inc/Alert';
import Util from '../inc/Utils';
import PropTypes from 'prop-types';
import {Button, Dialog, DialogActions, DialogContent} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Picer from './Picer';

const defaultConfig = {
    state          : {}, // estado inicial
    endpoint       : null, // ruta de api
    endpointForm   : '/form', // ruta de api
    endpointCreate : '/create', // ruta de api
    endpointRemove : '/remove', // ruta de api
    endpointEnable : '/enable', // ruta de api
    endpointDisable: '/disable', // ruta de api
    picHead        : false,
    title          : null,
    title_add      : '',
    size           : 'sm',
    use_errors     : false,
    auto_close     : true,
};

class ModalForm extends React.Component {

    constructor(props, config = {}) {
        super(props);
        this.config = {
            ...defaultConfig,
            ...config
        };

        if (this.config.endpoint == null)
            this.config.endpoint = '/' + Util.decamelize(this.constructor.name.slice(0, -1));

        this.initialState = {
            open        : false,
            loading     : false,
            data_changed: false,
            item        : {},
            files       : null, // si es un objeto es porque tiene archivos
            error       : null,
            errors      : null,
            ...this.config.state,
        };

        this.state = {...this.initialState};
    }

    loading = (show = true) => {
        this.setState({loading: show});
    };

    // sobre escribir esta funcion para validar
    validate = () => true;

    validateToSave = () => true;

    changed = (e, callback = null) => {
        const target = e.target;
        const name = target.name;
        if (target.type === 'file') {
            const file = target.files[0];
            this.setState({
                data_changed: true,
                files       : {
                    ...this.state.files,
                    [name]: file
                }
            }, callback);
        } else {
            const value = target.type === 'checkbox' ? target.checked ? 1 : 0 : target.value;

            this.setState({
                data_changed: true,
                item        : {
                    ...this.state.item,
                    [name]: value
                }
            }, callback);
        }
    };

    changedPic = (e) => {
        const target = e.target;
        let file = target.files[0];

        this.setState({
            data_changed: true,
            files       : {
                ...this.state.files,
                [target.name]: file
            }
        }, () => {
            if (file) {
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    file.preview = reader.result;
                    this.setState({
                        data_changed: true,
                        files       : {
                            ...this.state.files,
                            [target.name]: file
                        }
                    });
                };
            }
        });
    };

    add = () => this.open();

    edit = (id = 0, data = {}) => {
        this._edit(id, data);
    };

    setForm = (rsp) => {
        this.setData({
            ...rsp,
            item: rsp.data ? {...rsp.data} : {...this.initialState.item}
        });
    };

    _edit = async (id, data = {}) => {
        this.loading(true);
        const response = await Api.get(`${this.config.endpoint}/${id}`, data);

        if (response.ok) {
            this.setForm(response);
        } else {
            this.loading(false);
            Alert.error(response.message);
        }
    };

    remove = (id, onSuccess = null) => {
        Alert.confirm(async () => {
            const response = await Api.delete(`${this.config.endpoint}/${id}`, {}, 'Eliminando...');

            if (response.ok) {
                Toast.success('Eliminado correctamente');
                if (onSuccess) onSuccess();
            } else {
                Alert.error(response.message);
            }
        });
    };

    enable = async (id, onSuccess = null) => {
        const response = await Api.patch(`${this.config.endpoint}/${id}/state`, { state: 1 });

        if (response.ok) {
            Toast.success('Activado correctamente');
            if (onSuccess) onSuccess();
        } else {
            this.loading(false);
            Alert.error(response.message);
        }
    };

    disable = async (id, onSuccess = null) => {
        this.loading(true);

        const response = await Api.patch(`${this.config.endpoint}/${id}/state`, { state: 2 });

        if (response.ok) {
            Toast.success('Desactivado correctamente');
            if (onSuccess) onSuccess();
        } else {
            this.loading(false);
            Alert.error(response.message);
        }
    };

    // toggle modal en caso de estar en un componente de modal
    open = () => {
        this.setState({
            ...this.initialState,
            open: true
        });
    };

    close = () => {
        this.setState({
            open   : false,
            loading: false
        });
    };

    setData(val, callback) {
        this.setState({
            ...this.initialState,
            open   : true,
            loading: false,
            ...val
        }, callback);
    };

    setItem(item, callback) {
        this.setState({
            item: {
                ...this.state.item,
                ...item
            }
        }, callback);
    };

    getDataObj() {
        if (this.config.props_save) {
            let data = {};

            Object.entries(this.config.props_save).forEach(([key, value]) => {
                if (value === true) {
                    return data[key] = this.state.item[key];
                }

                if (typeof value !== 'object' || value === null) return;

                if (this.state.item.id > 0) {
                    if (value.hasOwnProperty('u') && value['u'] === true) {
                        return data[key] = this.state.item[key];
                    }
                } else {
                    if (value.hasOwnProperty('c') && value['c'] === true) {
                        return data[key] = this.state.item[key];
                    }
                }
            })

            return data;
        } else {
            return {...this.state.item};
        }
    }

    getData(forceFormData = false) {
        let data_obj = this.getDataObj();
        if (this.state.files == null && !forceFormData) {
            return data_obj;
        } else {
            const data = new FormData();
            for (let key in data_obj) {
                data.append(key, data_obj[key]);
            }
            for (let key in this.state.files) {
                data.append(key, this.state.files[key]);
            }
            return data;
        }
    }

    save = async () => {
        if (!this.validateToSave()) return;
        
        this.setState({
            loading: true,
            error  : null,
            errors : null,
        });

        let response = {};

        if (this.state.item.id > 0) {
            response = await Api.patch(`${this.config.endpoint}/${this.state.item.id}`, this.getData(), 'Guardando...');
        } else {
            response = await Api.post(this.config.endpoint, this.getData(), 'Guardando...');
        }

        if (response.ok) {
            this.onSaved(response);
        } else {
            if (this.config.use_errors) {
                this.setState({
                    loading: false,
                    error  : response.message,
                    errors : response.errors,
                });
            } else {
                Alert.error(response.message);
                this.setState({
                    loading: false,
                    error  : null,
                    errors : null,
                });
            }
        } 
    };

    onSaved = (rsp) => {
        this.close();
        Toast.success(rsp.message || 'Guardado correctamente');
        if (this.props.onSaved) {
            this.props.onSaved(rsp);
        }
    };

    head() {
        return this.config.picHead ? (
            <div className="flex flex-col items-center justify-center" style={{marginBottom: '-48px'}}>
                <Picer pic={this.state.item.pic} onChange={this.changedPic}/>
            </div>
        ) : '';
    }

    content(cont) {
        return (
            <DialogContent dividers style={this.config.picHead ? {paddingTop: 54} : {}}>
                {cont}
            </DialogContent>
        );
    }

    isEdit() {
        return this.state.item.id > 0;
    }

    preClose = () => {
        if (this.state.data_changed) {
            Alert.confirm('Los datos que ha introducido se perderán.', this.close);
        } else {
            this.close();
        }
    }

    footer() {
        return (
            <Button
                color="secondary"
                variant="contained"
                type="submit"
                onClick={this.save}
                disabled={this.state.loading || !this.validate()}>
                {this.config.title_add || 'Guardar'}
            </Button>
        );
    }

    title = () => (this.isEdit() ? 'Editar' : this.config.title_add || 'Añadir') + ' ' + this.config.title;

    render() {
        return (
            <Dialog open={this.state.open}
                    onClose={this.preClose}
                    scroll="body"
                    fullWidth

                    disableEnforceFocus
                    disableAutoFocus

                    disableBackdropClick={!this.config.auto_close}
                    disableEscapeKeyDown={!this.config.auto_close}

                    maxWidth={this.config.size}>

                <AppBar position="static" elevation={0}>
                    <Toolbar>
                        <Typography variant="h6" style={{flexGrow: 1}}>{this.title()}</Typography>
                        <IconButton
                            onClick={this.preClose}
                            color="inherit">
                            <Icon>close</Icon>
                        </IconButton>
                    </Toolbar>

                    {this.head()}

                </AppBar>

                {this.content()}

                <DialogActions className="py-16">
                    {this.footer()}
                </DialogActions>

            </Dialog>
        );
    }
}

ModalForm.propTypes = {
    onSaved: PropTypes.func
};

export default ModalForm;