import React, {Component, Fragment} from 'react';
import {LinearProgress} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import TableBody from '@material-ui/core/TableBody';
import Tooltip from '@material-ui/core/Tooltip';
import {red} from '@material-ui/core/colors';
import Util, {coin, coinFormat, humanDate, humanDatetime, pic} from '../../inc/Utils';
import TablePagination from '@material-ui/core/TablePagination';
import Api from '../../inc/Api';
import Alert from '../../inc/Alert';
import Toast from '../../inc/Toast';
import * as queryString from 'qs';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Pic from '../../inc/Pic';
import Grid from '@material-ui/core/Grid';
import WEmpty from '../WEmpty';
import WError from '../WError';
import Menu, {menuDivider, mi, mii} from '../Menu';
import WBool from '../WBool';
import Pref from '../../inc/Pref';
import HMenu from "../HMenu";
import StateObj from "../StateObj";

class Datable extends Component {

    constructor(props, context) {
        super(props, context);

        // parametros de pagina
        let params = props.location ? queryString.parse(props.location.search, {ignoreQueryPrefix: true}) : {};

        this.state = {
            loading: false,
            error  : null, // el mensaje de error
            items  : [],
            total  : 0,
            sql    : null,
            fil    : {
                limit    : params.limit ? parseInt(params.limit) : 0,
                page     : params.page ? parseInt(params.page) : null,
                order_dir: params.order_dir || null,
                order_col: params.order_col || null
            }
        };

        this.defaultFil = this.props.defaultFil;

        if (this.state.fil.limit === 0) {
            this.defaultFil.limit = Pref.int('datable_limit', this.props.defaultPageLimit);
        }

        this.endpoint = this.props.endpoint || props.match.url;

        this.arrColumns = Object.entries(this.props.columns);
        this.isDetailed = false;
        for (let [key, val] of this.arrColumns) {
            if (val.detail) {
                this.isDetailed = true;
                break;
            }
        }
    }

    componentDidMount() {
        this.loadData();
    }

    fil() {
        let parentFil = this.props.fil ? this.props.fil() : {};
        return Util.cleanFil({
            ...this.state.fil,
            ...parentFil
        });
    }

    reload() {
        this.setState({
            fil: {
                ...this.state.fil,
                page: 0
            }
        }, this.loadData);
    }

    apply() {
        this.loadData();
    }

    reset() {
        this.setState({
            items: []
        });
        this.loadData();
    }

    loadData = () => {
        let data = this.fil();
        this.setState({
            loading: true,
            error  : null
        });
        Api.get(this.endpoint, {
            ...this.defaultFil,
            ...data
        }, rsp => {
            if (!this.props.notFilter && this.props.history)
                this.props.history.replace({
                    search: '?' + queryString.stringify(data)
                });

            if (this.props.onData) {
                this.props.onData(rsp);
            }

            if (rsp.ok) {
                this.setState({
                    loading: false,
                    error  : null,
                    items  : rsp.items,
                    total  : rsp.total,
                    sql    : rsp.sql
                });
            } else {
                this.setState({
                    loading: false,
                    error  : rsp.msg || 'Se produjo un error'
                });
            }

        }, this.props.notLoading ? false : 'Obteniendo datos');
    };

    handleRequestSort(col) {
        this.setState({
            fil: {
                ...this.state.fil,
                order_dir: this.state.fil.order_col === col && this.state.fil.order_dir === 'desc' ? 'asc' : 'desc',
                order_col: col
            }
        }, this.loadData);
    }

    onChangePage = (event, page) => {
        this.setState({
            fil: {
                ...this.state.fil,
                page
            }
        }, this.loadData);
    };

    onChangeRowsPerPage = (event) => {
        let limit = event.target.value;
        this.setState({
            fil: {...this.state.fil, limit}
        }, this.loadData);
        Pref.set('datable_limit', limit);
    };

    goExport(format) {
        Api.export(this.endpoint, {
            ...this.fil(),
            ...this.defaultFil
        }, format);
    }

    goRemove(id) {
        Alert.confirm(() => {
            Api.get(this.endpoint + '/remove', {id}, rsp => {
                if (rsp.ok) {
                    Toast.success('Eliminado correctamente');
                    this.loadData();
                } else {
                    Alert.error(rsp.msg);
                }
            }, 'Eliminando...');
        });
    }

    goEnable(id) {
        Alert.confirm('¿Seguro que quieres activarlo?', 'Activar', () => {
            Api.get(this.endpoint + '/enable', {id}, rsp => {
                if (rsp.ok) {
                    Toast.success();
                    this.loadData();
                } else {
                    Alert.error(rsp.msg);
                }
            }, 'Activando...');
        });
    }

    goDisable(id) {
        Alert.confirm('¿Seguro que quieres desactivarlo?', 'Desactivar', () => {
            Api.get(this.endpoint + '/disable', {id}, rsp => {
                if (rsp.ok) {
                    Toast.success();
                    this.loadData();
                } else {
                    Alert.error(rsp.msg);
                }
            }, 'Desactivando...');
        });
    }

    goEdit(id) {
        if (this.props.modal) {
            this.props.modal.current.edit(id);
        }
    }

    menuItemEdit = o => mii('edit', 'Editar', () => this.goEdit(o.id));
    menuItemRemove = o => mii('delete', 'Eliminar', () => this.goRemove(o.id));
    menuItemToggle = o => ((typeof o.state != 'undefined' && o.state == '1') || o.estado == '1')
        ? mii('block', 'Desactivar', () => this.goDisable(o.id))
        : mii('check_circle', 'Activar', () => this.goEnable(o.id));

    menu = (o, items = []) => items.length
        ? [...items, menuDivider(), ...this.menuBase(o)]
        : this.menuBase(o);

    menuBase = o => {
        let can_edit = !this.props.module || this.props.module.edit;
        let items = [];

        if (can_edit) {
            items.push(this.menuItemEdit(o));
            items.push(this.menuItemToggle(o));
            items.push(this.menuItemRemove(o));
        }

        return items;
    };

    menuER = (o, items = []) => [
        ...items,
        this.menuItemEdit(o),
        this.menuItemRemove(o)
    ];

    mkCellState(o, key) {
        return o[key] === null ? (
            <TableCell key={key} padding="none" className="w1 nwp text-center"/>
        ) : typeof o[key] === 'object' ? (
            <TableCell key={key} padding="none" className="w1 nwp text-center">
                <StateObj state={o[key]}/>
            </TableCell>
        ) : (
            <TableCell key={key} padding="none" className="w1 nwp">
                {o[key] == '1' ? <div/> : (
                    <Tooltip title="Inactivo">
                        <Icon fontSize="small" style={{color: red[500]}}>block</Icon>
                    </Tooltip>
                )}
            </TableCell>
        );
    }

    mkHeadLabelCell(key, val) {
        return (typeof val.sort == 'undefined' || val.sort) ? (
            <TableSortLabel
                active={this.state.fil.order_col === key}
                direction={this.state.fil.order_dir || 'desc'}
                onClick={() => this.handleRequestSort(key)}>
                {val.value}
            </TableSortLabel>
        ) : <span>{val.value}</span>;
    }

    render() {

        const {fil} = this.state;

        return this.state.error ? (
            <WError error={this.state.error} onRetry={() => this.apply()}/>
        ) : this.state.items.length === 0 && !this.state.loading ? (
            <WEmpty title={this.props.emptyTitle} message={this.props.emptyMessage}/>
        ) : (
            <div className={'w-full ' + (this.props.notPagination ? '' : 'h-full') + ' flex flex-col datable'}>

                <FuseScrollbars className="flex-grow overflow-x-auto">
                    <Table>

                        {!this.props.notHeader && (
                            <TableHead>
                                <TableRow>

                                    {this.isDetailed && (
                                        <TableCell className="w1"/>
                                    )}

                                    {this.arrColumns.map(([key, val]) => {
                                        if (key === '_menu') {
                                            return (
                                                <TableCell key="menu" className="w1">
                                                    <Menu items={[
                                                        mi('Exportar a XLSX', () => this.goExport('xlsx')),
                                                        mi('Exportar a PDF', () => this.goExport('pdf')),
                                                        mi('Exportar a CSV', () => this.goExport('csv')),
                                                        mi('Exportar a HTML', () => this.goExport('html')),
                                                    ]}/>
                                                </TableCell>
                                            );
                                        } else if (val.detail) {
                                            return undefined;
                                        } else {
                                            return (
                                                <TableCell
                                                    key={key}
                                                    sortDirection={fil.order_col === key ? fil.order_dir : false}
                                                    style={{width: val.width || ''}}>
                                                    {val.tooltip ? (
                                                        <Tooltip title={val.tooltip}>
                                                            {this.mkHeadLabelCell(key, val)}
                                                        </Tooltip>
                                                    ) : this.mkHeadLabelCell(key, val)}
                                                </TableCell>
                                            );
                                        }
                                    })}
                                </TableRow>
                            </TableHead>
                        )}

                        <TableBody>
                            {this.state.loading && this.props.notLoading && (
                                <TableRow>
                                    <TableCell colSpan="100%" style={{
                                        border  : 'none',
                                        padding : 0,
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top     : -5,
                                            width   : '100%'
                                        }}>
                                            <LinearProgress/>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                            {this.state.items.map(this.props.row
                                ? this.props.row
                                : (o, i) => {
                                    let selected = typeof this.props.isRowSelected === 'function'
                                        ? this.props.isRowSelected(o, i)
                                        : false;

                                    let detailExpanded = (this.isDetailed && o._detailExpanded === true);
                                    return <Fragment key={i}>
                                        <TableRow
                                            hover
                                            selected={detailExpanded || !!selected}
                                            className={this.props.onClickRow ? 'cursor-pointer' : undefined}
                                            style={this.props.onRowStyles ? this.props.onRowStyles(o, i) : undefined}
                                            onClick={this.props.onClickRow ? e => {
                                                e.stopPropagation();
                                                this.props.onClickRow(o);
                                            } : undefined}>

                                            {this.isDetailed && (
                                                <TableCell className="w1" style={{padding: 0}} onClick={ev => {
                                                    ev.stopPropagation();
                                                    o._detailExpanded = !detailExpanded;
                                                    this.setState({
                                                        items: this.state.items
                                                    });
                                                }}>
                                                    <Tooltip title={detailExpanded
                                                        ? 'Ocultar información'
                                                        : 'Mostrar mas información'}>
                                                        <IconButton size="small"
                                                                    color={detailExpanded ? 'secondary' : 'default'}
                                                                    style={{opacity: detailExpanded ? 1.0 : 0.4}}>
                                                            <Icon fontSize="small">
                                                                {detailExpanded ? 'remove_circle' : 'add_circle'}
                                                            </Icon>
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            )}

                                            {this.arrColumns.map(([key, val]) => {
                                                if (val.detail) {
                                                    return undefined;
                                                } else if (typeof val.row === 'undefined') {
                                                    return <TableCell className={val.class}
                                                                      key={key}>{o[key]}</TableCell>;

                                                } else if (val.row === 'pic') {
                                                    let pic = o[key];
                                                    return (
                                                        <TableCell
                                                            key={key}
                                                            className="w1"
                                                            style={{padding: 2}}>
                                                            {pic ? (
                                                                <a href={Pic.url(pic, false)} target="_blank">
                                                                    <Avatar src={Pic.url(pic, true)} style={{
                                                                        width : 28,
                                                                        height: 28,
                                                                    }}>
                                                                        <Icon fontSize="small">
                                                                            {val.icon || 'image'}
                                                                        </Icon>
                                                                    </Avatar>
                                                                </a>
                                                            ) : (
                                                                <Avatar src="" style={{
                                                                    width : 28,
                                                                    height: 28,
                                                                }}>
                                                                    <Icon fontSize="small">{val.icon || 'image'}</Icon>
                                                                </Avatar>
                                                            )}
                                                        </TableCell>
                                                    );

                                                } else if (val.row === 'state') {
                                                    return this.mkCellState(o, key);

                                                } else if (val.row === 'fullname') {
                                                    return (
                                                        <TableCell key={key} className="nwp">
                                                            {o.name} {o.surname}
                                                        </TableCell>
                                                    );

                                                } else if (val.row === 'bool') {
                                                    return (
                                                        <TableCell key={key} className="w1 nwp">
                                                            <WBool
                                                                value={o[key]}
                                                                icon={val.icon}
                                                                title={val.title}/>
                                                        </TableCell>
                                                    );

                                                } else if (val.row === 'datetime') {
                                                    return (
                                                        <TableCell key={key} className="w1 nwp">
                                                            {humanDatetime(o[key])}
                                                        </TableCell>
                                                    );

                                                } else if (val.row === 'date') {
                                                    return (
                                                        <TableCell key={key} className="w1 nwp">
                                                            {humanDate(o[key])}
                                                        </TableCell>
                                                    );

                                                } else if (val.row === 'coin') {
                                                    return (
                                                        <TableCell key={key} className="w1 nwp">
                                                            {Util.coin(o[key])}
                                                        </TableCell>
                                                    );

                                                } else if (val.row === 'coin_format') {
                                                    return (
                                                        <TableCell key={key} className="w1 nwp text-right">
                                                            {coinFormat(o[key])}
                                                        </TableCell>
                                                    );

                                                } else if (val.row === 'percent') {
                                                    return (
                                                        <TableCell key={key} className="w1 nwp">
                                                            {o[key]}%
                                                        </TableCell>
                                                    );

                                                } else if (val.row === 'arrow') {
                                                    return (
                                                        <TableCell key={key} className="w1 nwp">
                                                            <Icon>chevron_right</Icon>
                                                        </TableCell>
                                                    );

                                                } else if (val.row === 'menu') {
                                                    return (
                                                        <TableCell key="menu" padding="none" className="w1"
                                                                   onClick={ev => {
                                                                       ev.stopPropagation();
                                                                   }}>
                                                            <Menu items={() => typeof val.items === 'function'
                                                                ? val.items(o, i).map(mi => {
                                                                    if (mi === ':divider')
                                                                        return menuDivider(o);
                                                                    if (mi === ':edit')
                                                                        return this.menuItemEdit(o);
                                                                    if (mi === ':toggle')
                                                                        return this.menuItemToggle(o);
                                                                    if (mi === ':remove')
                                                                        return this.menuItemRemove(o);
                                                                    return mi;
                                                                }) : this.menuBase(o)}/>
                                                        </TableCell>
                                                    );
                                                } else if (val.row === 'h-menu') {
                                                    return (
                                                        <TableCell key="menu" padding="none" className="w1"
                                                                   onClick={ev => {
                                                                       ev.stopPropagation();
                                                                   }}>
                                                            <HMenu items={() => {
                                                                if (val.items) {
                                                                    let items = [];

                                                                    let val_items = (typeof val.items === 'function')
                                                                        ? val.items(o, i)
                                                                        : val.items;

                                                                    let can_edit = !this.props.module
                                                                        || this.props.module.edit;

                                                                    for (let mi of val_items) {
                                                                        switch (mi) {
                                                                            case ':divider':
                                                                                items.push(menuDivider(o));
                                                                                break;
                                                                            case ':edit':
                                                                                if (can_edit)
                                                                                    items.push(this.menuItemEdit(o));
                                                                                break;
                                                                            case ':toggle':
                                                                                if (can_edit)
                                                                                    items.push(this.menuItemToggle(o));
                                                                                break;
                                                                            case ':remove':
                                                                                if (can_edit)
                                                                                    items.push(this.menuItemRemove(o));
                                                                                break;
                                                                            default:
                                                                                items.push(mi);
                                                                                break;
                                                                        }
                                                                    }
                                                                    return items;
                                                                } else {
                                                                    return this.menuBase(o)
                                                                }
                                                            }}/>
                                                        </TableCell>
                                                    );
                                                } else if (val.row === 'menu_basic') {
                                                    return (
                                                        <TableCell key="menu" padding="none" className="w1"
                                                                   onClick={ev => {
                                                                       ev.stopPropagation();
                                                                   }}>
                                                            <Menu items={[
                                                                this.menuItemEdit(o),
                                                                this.menuItemRemove(o),
                                                            ]}/>
                                                        </TableCell>
                                                    );
                                                } else {
                                                    let result_row = val.row(o, i, selected);
                                                    return result_row.type === TableCell
                                                        ? result_row
                                                        : <TableCell className={val.class}
                                                                     key={key}>{result_row}</TableCell>;
                                                }
                                            })}
                                        </TableRow>
                                        {detailExpanded && (
                                            <TableRow>
                                                <TableCell colSpan={100}>
                                                    <div className="m-8">
                                                        <Grid container spacing={1}>

                                                            {this.arrColumns.map(([key, val]) => {
                                                                if (!val.detail) return null;

                                                                let noL = (val.value === '_not_');

                                                                let colL = noL ? 0 : 4;
                                                                let colR = noL ? 12 : 8;

                                                                return (
                                                                    <Fragment key={key}>
                                                                        {colL > 0 && (
                                                                            <Grid item xs={colL}>
                                                                                <Typography
                                                                                    align="right"
                                                                                    color="textSecondary">
                                                                                    {val.value}
                                                                                </Typography>
                                                                            </Grid>
                                                                        )}
                                                                        <Grid item xs={colR}>
                                                                            <Typography component="div">
                                                                                {(() => {
                                                                                    if (typeof val.row === 'undefined') {
                                                                                        return o[key];
                                                                                    } else if (val.row === 'pic') {
                                                                                        return (
                                                                                            <Avatar
                                                                                                src={pic(o[key])}
                                                                                                style={{
                                                                                                    width : 30,
                                                                                                    height: 30
                                                                                                }}>
                                                                                                <Icon>{val.icon || 'image'}</Icon>
                                                                                            </Avatar>
                                                                                        );
                                                                                    } else if (val.row === 'fullname') {
                                                                                        return o.name + ' ' + o.surname;
                                                                                    } else if (val.row === 'bool') {
                                                                                        return o[key] == '1' ? 'Si' : 'No';
                                                                                    } else if (val.row === 'datetime') {
                                                                                        return humanDatetime(o[key]);
                                                                                    } else if (val.row === 'date') {
                                                                                        return humanDate(o[key]);
                                                                                    } else if (val.row === 'coin') {
                                                                                        return coin(o[key]);
                                                                                    } else if (val.row === 'percent') {
                                                                                        return o[key] + '%';
                                                                                    } else {
                                                                                        return val.row(o, i);
                                                                                    }
                                                                                })()}
                                                                            </Typography>
                                                                        </Grid>
                                                                    </Fragment>
                                                                );
                                                            })}

                                                        </Grid>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </Fragment>;
                                }
                            )}
                        </TableBody>

                    </Table>
                </FuseScrollbars>

                {!this.props.notPagination && (
                    <TablePagination
                        component="div"
                        count={this.state.total}
                        page={this.state.total ? fil.page || 0 : 0}
                        rowsPerPage={fil.limit || this.defaultFil.limit}
                        rowsPerPageOptions={[5, 10, 15, 20, 25, 50, 100]}
                        labelRowsPerPage="Mostrar"
                        labelDisplayedRows={o => `${o.from}-${o.to} de ${o.count}`}
                        onChangePage={this.onChangePage}
                        onChangeRowsPerPage={this.onChangeRowsPerPage}/>
                )}

            </div>
        );
    }
}

Datable.propTypes = {
    endpoint        : PropTypes.string,
    fil             : PropTypes.func,
    columns         : PropTypes.object.isRequired,
    module          : PropTypes.object,
    row             : PropTypes.func,
    modal           : PropTypes.object,
    notLoading      : PropTypes.bool,
    notPagination   : PropTypes.bool,
    notFilter       : PropTypes.bool,
    notHeader       : PropTypes.bool,
    detailed        : PropTypes.bool,
    onClickRow      : PropTypes.func,
    onRowStyles     : PropTypes.func,
    isRowSelected   : PropTypes.func,
    onData          : PropTypes.func,
    defaultPageLimit: PropTypes.number,
    defaultFil      : PropTypes.object,
    emptyTitle      : PropTypes.string,
    emptyMessage    : PropTypes.string,
};

Datable.defaultProps = {
    defaultFil      : {},
    defaultPageLimit: 10
};

export default Datable;
