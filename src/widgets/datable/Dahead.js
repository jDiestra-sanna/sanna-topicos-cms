import React, {Component} from 'react';
import FuseAnimate from "@fuse/core/FuseAnimate";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import Ranger from "../Ranger";
import Button from "@material-ui/core/Button";
import {format, parse} from "date-fns";
import * as queryString from "qs";
import {connect} from "react-redux";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import AsyncSelect from "react-select/async/dist/react-select.esm";
import Select from 'react-select'
import Api from "../../inc/Api";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

export class Fil {

    constructor(type, name = '', label = '', value = '', width = 200) {
        this.setType(type);
        this.setName(name);
        this.setLabel(label);
        this.setValue(value);
        this.setWidth(width);
    }

    setType(val) {
        this.type = val;
        return this;
    }

    setName(val) {
        this.name = val;
        return this;
    }

    setValue(val) {
        this.value = val;
        return this;
    }

    setLabel(val) {
        this.label = val;
        return this;
    }

    setWidth(val) {
        this.width = val;
        return this;
    }

    setHidden(val) {
        this.hidden = val;
        return this;
    }

    if(val) {
        return this.setHidden(!val);
    }

    setEndpoint(val) {
        this.endpoint = val;
        return this;
    }

    setItems(val) {
        this.items = val;
        return this;
    }

    setIcon(val) {
        this.icon = val;
        return this;
    }

    setOnChange(callback) {
        this.onChange = callback;
        return this;
    }

    setDependent(val) {
        this.dependent = val;
        return this;
    }

    setChildren(val) {
        this.children = val;
        return this;
    }

    setInputType(val) {
        this.input_type = val;
        return this;
    }

    // HELPERS types
    static text(name, label, input_type = 'text') {
        let ins = new Fil('text', name, label);
        ins.setInputType(input_type);
        return ins;
    }

    static bool(name, label) {
        return new Fil('bool', name, label);
    }

    static select(name, label, items) {
        let ins = new Fil('select', name, label);
        ins.setItems(items);
        return ins;
    }

    static ajax(name, label, endpoint) {
        let ins = new Fil('select_ajax', name, label);
        ins.setEndpoint(endpoint);
        return ins;
    }

    static local(name, label, endpoint) {
        let ins = new Fil('select_local', name, label);
        ins.setEndpoint(endpoint);
        return ins;
    }
}

class Dahead extends Component {

    constructor(props, context, state) {
        super(props, context);

        let params = queryString.parse(props.location.search, {ignoreQueryPrefix: true});

        this.state = {
            date_from: params.date_from
                ? parse(params.date_from, 'yyyy-MM-dd', 0)
                : props.default_date_from
                    ? parse(props.default_date_from, 'yyyy-MM-dd', 0)
                    : null,
            date_to  : params.date_to
                ? parse(params.date_to, 'yyyy-MM-dd', 0)
                : props.default_date_to
                    ? parse(props.default_date_to, 'yyyy-MM-dd', 0)
                    : null,
            fil      : {
                query: params.query || '',
            },
        };

        this.fields = props.fields || [];

        // Agregar filtros por defecto
        if (!this.props.notQuery) {
            this.fields.unshift(Fil.text('query', 'Buscar').setIcon('search'));
        }

        for (let field of this.fields) {
            if (field.hidden) continue;

            // si es dependiente, le asignamos el children al padre
            if (field.dependent) {
                this.fields.find(o => o.name === field.dependent).setChildren(field.name);
            }

            let value = params[field.name] || field.value || '';
            this.state.fil[field.name] = value;
            if (field.type === 'select_ajax') {
                if (value) {
                    Api.get(field.endpoint, {value}, rsp => {
                        if (rsp.ok) {
                            let kv = [field.name] + '_val';
                            this.setState({
                                [kv]: {
                                    value: rsp.item.value || rsp.item.id,
                                    label: rsp.item.label || rsp.item.name || rsp.item.nombre,
                                },
                            });
                        }
                    }, false);
                }
            } else if (field.type === 'select_local') {
                let kv = [field.name] + '_val';
                this.state[kv + '_options'] = [];
                Api.get(field.endpoint, {limit: 500}, rsp => {
                    if (rsp.ok) {
                        let options = [];
                        let selectedOption = undefined;

                        rsp.items.map(o => {
                            let option = {
                                value: o.value || o.id,
                                label: o.label || o.name || o.nombre,
                            };
                            options.push(option);
                            if (option.value == value) {
                                selectedOption = option;
                            }
                        });

                        this.setState({
                            [kv]             : selectedOption,
                            [kv + '_options']: options,
                        });
                    }
                }, false);
            }
        }
    }

    setFilValue(name, value) {
        this.setState({[name]: value});
    }

    fil = () => {
        return {
            ...this.state.fil,
            date_from: this.state.date_from ? format(this.state.date_from, 'yyyy-MM-dd') : '',
            date_to  : this.state.date_to ? format(this.state.date_to, 'yyyy-MM-dd') : '',
        };
    };

    handleQuery(name, query) {
        this.setState({
            fil: {
                ...this.state.fil,
                [name]: query,
            }
        }, () => {
            if (this.timeoutID)
                clearTimeout(this.timeoutID);
            this.timeoutID = setTimeout(this.onChange, 300);
        });
    }

    onChange = () => {
        if (this.props.onChange) {
            this.props.onChange();
        } else {
            this.props.datable.current.reload();
        }
    };

    render() {
        let {fil} = this.state;

        return (
            <div className="flex flex-1 w-full items-center justify-between">

                <div className="flex flex-1 items-center">
                    {this.props.pageLayout && (
                        <Hidden lgUp>
                            <IconButton
                                onClick={() => this.props.pageLayout.current.toggleLeftSidebar()}
                                aria-label="open left sidebar"
                            >
                                <Icon>menu</Icon>
                            </IconButton>
                        </Hidden>
                    )}

                    {this.props.onBack && (
                        <IconButton
                            onClick={() => this.props.onBack()}
                            aria-label="open left sidebar">
                            <Icon>arrow_back</Icon>
                        </IconButton>
                    )}

                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                        <div>
                            <Typography className="hidden sm:flex" variant="h6">
                                {this.props.module ? this.props.module.title : this.props.title}
                            </Typography>
                            {this.props.subtitle && (
                                <Typography className="hidden sm:flex" variant="caption" color="textSecondary">
                                    {this.props.subtitle}
                                </Typography>
                            )}
                        </div>
                    </FuseAnimate>
                </div>

                {this.fields.map(field => {
                    if (field.hidden) return null;

                    let kv = [field.name] + '_val';
                    let value = fil[field.name];

                    let disabled = false;

                    if (field.dependent) {
                        let dep_value = fil[field.dependent];
                        if (!dep_value) {
                            disabled = true;
                        }
                    }

                    switch (field.type) {
                        case 'text':
                            return (
                                <div key={field.name} className="flex flex items-center justify-center ml-8">

                                    <ThemeProvider theme={this.props.mainTheme}>
                                        <Paper className="flex items-center w-full px-8 pdg-tb-2 rounded-4"
                                               elevation={1} style={{maxWidth: field.width, width: field.width}}>

                                            {field.icon && (
                                                <Icon className="mr-8" color="action">{field.icon}</Icon>
                                            )}

                                            <Input
                                                placeholder={field.label}
                                                className="flex flex-1"
                                                disableUnderline
                                                fullWidth
                                                value={value}
                                                onChange={e => this.handleQuery(field.name, e.target.value)}
                                                type={field.input_type}
                                            />
                                        </Paper>
                                    </ThemeProvider>

                                </div>
                            );
                        case 'bool':
                            return (
                                <div key={field.name} className="flex flex items-center justify-center ml-8">
                                    <ThemeProvider theme={this.props.mainTheme}>
                                        <Paper className="flex items-center w-full max-w-200 pr-8 rounded-4"
                                               elevation={1}>

                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        name="section"
                                                        checked={value == '1'}
                                                        style={{padding: 6}}
                                                        onChange={e => {
                                                            this.setState({
                                                                fil: {
                                                                    ...fil,
                                                                    [field.name]: e.target.checked ? '1' : ''
                                                                }
                                                            }, this.onChange);
                                                        }}/>
                                                }
                                                style={{margin: 0}}
                                                label={field.label}
                                            />

                                        </Paper>
                                    </ThemeProvider>
                                </div>
                            );
                        case 'select':
                            return (
                                <div key={field.name} className="flex flex items-center justify-center ml-8">

                                    <ThemeProvider theme={this.props.mainTheme}>
                                        <Typography component="div" style={{minWidth: field.width}} color="textPrimary">
                                            <Select
                                                cacheOptions
                                                isClearable
                                                placeholder={field.label}
                                                options={field.items}
                                                value={value ? field.items.filter(o => o.value === value) : null}
                                                isDisabled={disabled}
                                                onChange={o => {
                                                    this.setState({
                                                        fil : {
                                                            ...fil,
                                                            [field.name]: o ? o.value : '',
                                                        },
                                                        [kv]: o,
                                                    }, this.onChange);
                                                }}
                                                styles={{
                                                    control: styles => ({
                                                        ...styles,
                                                        minHeight: 36,
                                                        border   : 'none'
                                                    }),
                                                }}/>
                                        </Typography>
                                    </ThemeProvider>

                                </div>
                            );
                        case 'select_ajax':
                            return (
                                <div key={field.name} className="flex flex items-center justify-center ml-8 z-10">

                                    <ThemeProvider theme={this.props.mainTheme}>
                                        <Typography component="div" style={{minWidth: field.width}} color="textPrimary">
                                            <AsyncSelect
                                                cacheOptions={false}
                                                isClearable
                                                placeholder={field.label}
                                                loadOptions={(query, callback) => {
                                                    let param = {};
                                                    param.query = query;
                                                    if (field.dependent) {
                                                        param[field.dependent] = fil[field.dependent];
                                                    }
                                                    Api.get(field.endpoint, param, rsp => {
                                                        callback(rsp.ok ? rsp.items.map(o => ({
                                                            value: o.value || o.id,
                                                            label: o.label || o.name || o.nombre,
                                                        })) : []);
                                                    }, false);
                                                }}
                                                isDisabled={disabled}
                                                value={this.state[kv]}
                                                onChange={o => {
                                                    let newValue = o ? o.value : '';
                                                    this.setState({
                                                        fil : {
                                                            ...fil,
                                                            [field.name]: newValue,
                                                        },
                                                        [kv]: o,
                                                    }, () => {
                                                        this.onChange();
                                                        if (field.onChange) {
                                                            field.onChange(newValue);
                                                        }
                                                    });
                                                }}
                                                styles={{
                                                    control: styles => ({
                                                        ...styles,
                                                        minHeight: 36,
                                                        border   : 'none'
                                                    }),
                                                }}
                                                noOptionsMessage={e => {
                                                    return e.inputValue
                                                        ? 'Sin resultados.'
                                                        : 'Escribe algo para buscar.';
                                                }}/>
                                        </Typography>
                                    </ThemeProvider>

                                </div>
                            );
                        case 'select_local':
                            return (
                                <div key={field.name} className="flex flex items-center justify-center ml-8">

                                    <ThemeProvider theme={this.props.mainTheme}>
                                        <Typography component="div" style={{minWidth: field.width}} color="textPrimary">
                                            <Select
                                                isClearable
                                                placeholder={field.label}
                                                options={this.state[kv + '_options']}
                                                value={this.state[kv]}
                                                isDisabled={disabled}
                                                onChange={o => {
                                                    let newValue = o ? o.value : '';
                                                    let newState = {
                                                        ...this.state,
                                                        fil : {
                                                            ...fil,
                                                            [field.name]: newValue,
                                                        },
                                                        [kv]: o,
                                                    };
                                                    // reiniciar el valor del hijo
                                                    if (field.children) {
                                                        newState.fil[field.children] = '';
                                                        newState[field.children + '_val'] = null;
                                                    }

                                                    this.setState(newState, () => {
                                                        this.onChange();
                                                        if (field.onChange) {
                                                            field.onChange(newValue);
                                                        }
                                                    });
                                                }}
                                                styles={{
                                                    control: styles => ({
                                                        ...styles,
                                                        minHeight: 36,
                                                        border   : 'none'
                                                    }),
                                                }}/>
                                        </Typography>
                                    </ThemeProvider>

                                </div>
                            );
                        default:
                            return '';
                    }
                })}

                {!this.props.notDates && (
                    <div className="flex flex items-center justify-center ml-8">

                        <ThemeProvider theme={this.props.mainTheme}>
                            <Ranger
                                dateFrom={this.state.date_from}
                                dateTo={this.state.date_to}
                                onChange={(date_from, date_to) => {
                                    this.setState({
                                        date_from,
                                        date_to,
                                    }, this.onChange);
                                }}/>
                        </ThemeProvider>

                    </div>
                )}

                {((this.props.modal || this.props.onAction) && (!this.props.module || this.props.module.edit)) && (
                    <Button
                        variant="contained"
                        color="secondary"
                        className="ml-8"
                        disabled={this.props.actionDisabled}
                        onClick={() => this.props.onAction
                            ? this.props.onAction()
                            : this.props.modal.current.add()}>
                        {this.props.actionLabel || 'Nuevo'}
                    </Button>
                )}

            </div>
        );
    }
}

Dahead.propTypes = {
    title         : PropTypes.string,
    subtitle      : PropTypes.string,
    datable       : PropTypes.object,
    module        : PropTypes.object,
    modal         : PropTypes.object,
    onChange      : PropTypes.func,
    onBack        : PropTypes.func,
    fields        : PropTypes.arrayOf(PropTypes.instanceOf(Fil).isRequired),
    actionLabel   : PropTypes.string,
    actionDisabled: PropTypes.bool,
    onAction      : PropTypes.func,

    notQuery: PropTypes.bool,
    notDates: PropTypes.bool,

    pageLayout: PropTypes.object,

    default_date_from: PropTypes.string,
    default_date_to  : PropTypes.string,
};

export default connect(({fuse}) => {
    return {
        mainTheme: fuse.settings.mainTheme
    }
}, null, null, {forwardRef: true})(Dahead);
