import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import WError from '../WError';
import WEmpty from '../WEmpty';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import {
  Avatar,
  Grid,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from '@material-ui/core';
import Api from 'inc/Apiv2';
import * as queryString from 'qs';
import { LinearProgress } from '@material-ui/core';
import StateObj from '../StateObj';
import WBool from '../WBool';
import Util, { coin, coinFormat, humanDate, humanDatetime, pic } from '../../inc/Utils';
import Menu, { menuDivider, mi, mii } from '../Menu';
import HMenu from '../HMenu';
import Alert from 'inc/Alert';
import Toast from 'inc/Toast';
import { red } from '@material-ui/core/colors';
import TablePagination from '@material-ui/core/TablePagination';
import Pref from 'inc/Pref';

function Datable(props) {
  const [fil, setFil] = useState({
    limit: 10,
    page: 0,
    order_dir: '',
    order_col: '',
  });

  const [data, setData] = useState({
    loading: false,
    error: null,
    items: [],
    total: 0,
  });

  const _fil = { ...fil, ...props.fil };
  const _endpoint = props.endpoint || props.match?.url || '';
  const _hasDetail = Object.entries(props.columns).some(([key, val]) => (val.detail ? true : false));

  function handleRequestSort(col, val) {
    const order_col = val['order_col'];
    if (!order_col) return;

    setFil(prevState => ({
      ...prevState,
      order_dir: fil.order_col === order_col && fil.order_dir === 'DESC' ? 'ASC' : 'DESC',
      order_col: order_col,
    }));
  }

  function mkHeadLabelCell(key, val) {
    return typeof val.sort == 'undefined' || val.sort ? (
      <TableSortLabel
        active={fil.order_col === key}
        direction={fil.order_dir.toLowerCase() || 'desc'}
        onClick={() => handleRequestSort(key, val)}
      >
        {val.value}
      </TableSortLabel>
    ) : (
      <span>{val.value}</span>
    );
  }

  function mkCellState(o, key) {
    return o[key] === null ? (
      <TableCell
        key={key}
        padding="none"
        className="w1 nwp text-center"
      />
    ) : typeof o[key] === 'object' ? (
      <TableCell
        key={key}
        padding="none"
        className="w1 nwp text-center"
      >
        <StateObj state={o[key]} />
      </TableCell>
    ) : (
      <TableCell
        key={key}
        padding="none"
        className="w1 nwp"
      >
        {o[key] == '1' ? (
          <div />
        ) : (
          <Tooltip title="Inactivo">
            <Icon
              fontSize="small"
              style={{ color: red[500] }}
            >
              block
            </Icon>
          </Tooltip>
        )}
      </TableCell>
    );
  }

  function goRemove(id) {
    Alert.confirm('¿Seguro que quieres eliminarlo?', 'Eliminar', async () => {
      const response = await Api.delete(`${_endpoint}/${id}`, {}, 'Eliminando...');

      if (response.ok) {
        Toast.success('Eliminado correctamente');
        loadData();
      } else {
        Alert.error(response.message);
      }
    });
  }

  function goEnable(id) {
    Alert.confirm('¿Seguro que quieres activarlo?', 'Activar', async () => {
      const response = await Api.patch(`${_endpoint}/${id}/state`, { state: props.enabledState }, 'Activando...');

      if (response.ok) {
        Toast.success();
        loadData();
      } else {
        Alert.error(response.message);
      }
    });
  }

  function goDisable(id) {
    Alert.confirm('¿Seguro que quieres desactivarlo?', 'Desactivar', async () => {
      const response = await Api.patch(`${_endpoint}/${id}/state`, { state: props.disabledState }, 'Desactivando...');

      if (response.ok) {
        Toast.success();
        loadData();
      } else {
        Alert.error(response.message);
      }
    });
  }

  function goEdit(id) {
    if (props.modal) {
      props.modal.current.edit(id);
    }
  }

  function menuItemEdit(o) {
    mii('edit', 'Editar', () => goEdit(o.id));
  }

  function menuItemRemove(o) {
    mii('delete', 'Eliminar', () => goRemove(o.id));
  }
  function menuItemToggle(o) {
    (typeof o.state != 'undefined' && o.state == '1') || o.estado == '1'
      ? mii('block', 'Desactivar', () => goDisable(o.id))
      : mii('check_circle', 'Activar', () => goEnable(o.id));
  }

  function menuBase(o) {
    let can_edit = !props.module || props.module.edit;
    let items = [];

    if (can_edit) {
      items.push(menuItemEdit(o));
      items.push(menuItemToggle(o));
      items.push(menuItemRemove(o));
    }

    return items;
  }

  async function loadData() {
    const filCleaned = Util.cleanFil(_fil);

    if (props.emptyTable) {
      return setData(prevState => ({
        ...prevState,
        items: [],
      }));
    }

    setData(prevState => ({
      ...prevState,
      loading: true,
      error: null,
    }));

    const response = await Api.get(_endpoint, filCleaned, props.notLoading ? false : 'Obteniendo datos');

    if (!props.notFilter && props.history) {
      props.history.replace({ search: '?' + queryString.stringify(filCleaned) });
    }

    if (props.onData) props.onData(response);

    if (response.ok) {
      setData(prevState => ({
        ...prevState,
        loading: false,
        error: null,
        items: response.data,
        total: response.total,
      }));
    } else {
      setData(prevState => ({
        ...prevState,
        loading: false,
        error: response.message || 'Se produjo un error',
      }));
    }
  }

  useEffect(() => {
    loadData();
  }, [JSON.stringify(fil), JSON.stringify(props.fil)]);


  if (data.error) {
    return (
      <WError
        error={data.error}
        onRetry={loadData}
      />
    );
  }

  if (!data.items.length && !data.loading) {
    return (
      <WEmpty
        title={props.emptyTitle}
        message={props.emptyMessage}
      />
    );
  }

  return (
    <div className={'w-full ' + (props.notPagination ? '' : 'h-full') + ' flex flex-col datable'}>
      <FuseScrollbars className="flex-grow overflow-x-auto">
        <Table>
          {!props.notHeader && (
            <TableHead>
              <TableRow>
                {_hasDetail && <TableCell className="w1" />}

                {Object.entries(props.columns).map(([key, val]) => {
                  if (val.detail) {
                    return undefined;
                  }

                  if (key === '_menu') {
                    return (
                      <TableCell
                        key="menu"
                        className="w1"
                      >
                        {/* <Menu 
                              items={[
                                mi('Exportar a XLSX', () => goExport('xlsx')),
                                mi('Exportar a PDF', () => goExport('pdf')),
                                mi('Exportar a CSV', () => goExport('csv')),
                                mi('Exportar a HTML', () => goExport('html')),
                              ]}
                        /> */}
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell
                      key={key}
                      sortDirection={fil.order_col === key ? fil.order_dir : false}
                      style={val.style || {}}
                    >
                      {val.tooltip ? (
                        <Tooltip title={val.tooltip}>{mkHeadLabelCell(key, val)}</Tooltip>
                      ) : (
                        mkHeadLabelCell(key, val)
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
          )}

          <TableBody>
            {data.loading && props.notLoading && (
              <TableRow>
                <TableCell
                  colSpan="100%"
                  style={{
                    border: 'none',
                    padding: 0,
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: -5,
                      width: '100%',
                    }}
                  >
                    <LinearProgress />
                  </div>
                </TableCell>
              </TableRow>
            )}

            {data.items.map(
              props.row
                ? props.row
                : (o, i) => {
                    let selected = typeof props.isRowSelected === 'function' ? props.isRowSelected(o, i) : false;

                    let detailExpanded = _hasDetail && o._detailExpanded === true;

                    return (
                      <Fragment key={i}>
                        <TableRow
                          hover
                          selected={detailExpanded || !!selected}
                          className={props.onClickRow ? 'cursor-pointer' : undefined}
                          style={props.onRowStyles ? props.onRowStyles(o, i) : undefined}
                          onClick={
                            props.onClickRow
                              ? e => {
                                  e.stopPropagation();
                                  props.onClickRow(o);
                                }
                              : undefined
                          }
                        >
                          {_hasDetail && (
                            <TableCell
                              className="w1"
                              style={{ padding: 0 }}
                              onClick={ev => {
                                ev.stopPropagation();
                                o._detailExpanded = !detailExpanded;

                                setData(prevState => ({
                                  ...prevState,
                                  items: data.items,
                                }));
                              }}
                            >
                              <Tooltip title={detailExpanded ? 'Ocultar información' : 'Mostrar mas información'}>
                                <IconButton
                                  size="small"
                                  color={detailExpanded ? 'secondary' : 'default'}
                                  style={{ opacity: detailExpanded ? 1.0 : 0.4 }}
                                >
                                  <Icon fontSize="small">{detailExpanded ? 'remove_circle' : 'add_circle'}</Icon>
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          )}

                          {Object.entries(props.columns).map(([key, val]) => {
                            if (val.detail) return undefined;

                            if (typeof val.row === 'undefined') {
                              return (
                                <TableCell
                                  className={val.class}
                                  key={`${i}_${key}`}
                                >
                                  {o[key]}
                                </TableCell>
                              );
                            }

                            if (val.row === 'pic') {
                              let pic = o[key];

                              return (
                                <TableCell
                                  key={`${i}_${key}`}
                                  className="w1"
                                  style={{ padding: 2 }}
                                >
                                  {pic ? (
                                    <a
                                      href={pic}
                                      target="_blank"
                                    >
                                      <Avatar
                                        src={pic}
                                        style={{
                                          width: 28,
                                          height: 28,
                                        }}
                                      >
                                        <Icon fontSize="small">{val.icon || 'image'}</Icon>
                                      </Avatar>
                                    </a>
                                  ) : (
                                    <Avatar
                                      src=""
                                      style={{
                                        width: 28,
                                        height: 28,
                                      }}
                                    >
                                      <Icon fontSize="small">{val.icon || 'image'}</Icon>
                                    </Avatar>
                                  )}
                                </TableCell>
                              );
                            }

                            if (val.row === 'state') {
                              return mkCellState(o, key);
                            }

                            if (val.row === 'fullname') {
                              return (
                                <TableCell
                                  key={`${i}_${key}`}
                                  className="nwp"
                                >
                                  {o.name} {o.surname}
                                </TableCell>
                              );
                            }

                            if (val.row === 'bool') {
                              return (
                                <TableCell
                                  key={`${i}_${key}`}
                                  className="w1 nwp"
                                >
                                  <WBool
                                    value={o[key]}
                                    icon={val.icon}
                                    title={val.title}
                                  />
                                </TableCell>
                              );
                            }

                            if (val.row === 'datetime') {
                              return (
                                <TableCell
                                  key={`${i}_${key}`}
                                  className="w1 nwp"
                                >
                                  {humanDatetime(o[key])}
                                </TableCell>
                              );
                            }

                            if (val.row === 'date') {
                              return (
                                <TableCell
                                  key={`${i}_${key}`}
                                  className="w1 nwp"
                                >
                                  {humanDate(o[key])}
                                </TableCell>
                              );
                            }

                            if (val.row === 'coin') {
                              return (
                                <TableCell
                                  key={`${i}_${key}`}
                                  className="w1 nwp"
                                >
                                  {Util.coin(o[key])}
                                </TableCell>
                              );
                            }

                            if (val.row === 'coin_format') {
                              return (
                                <TableCell
                                  key={`${i}_${key}`}
                                  className="w1 nwp text-right"
                                >
                                  {coinFormat(o[key])}
                                </TableCell>
                              );
                            }

                            if (val.row === 'percent') {
                              return (
                                <TableCell
                                  key={`${i}_${key}`}
                                  className="w1 nwp"
                                >
                                  {o[key]}%
                                </TableCell>
                              );
                            }

                            if (val.row === 'arrow') {
                              return (
                                <TableCell
                                  key={`${i}_${key}`}
                                  className="w1 nwp"
                                >
                                  <Icon>chevron_right</Icon>
                                </TableCell>
                              );
                            }

                            if (val.row === 'menu') {
                              return (
                                <TableCell
                                  key={`${i}_menu`}
                                  padding="none"
                                  className="w1"
                                  onClick={ev => {
                                    ev.stopPropagation();
                                  }}
                                >
                                  <Menu
                                    items={() =>
                                      typeof val.items === 'function'
                                        ? val.items(o, i).map(mi => {
                                            if (mi === ':divider') return menuDivider(o);
                                            if (mi === ':edit') return menuItemEdit(o);
                                            if (mi === ':toggle') return menuItemToggle(o);
                                            if (mi === ':remove') return menuItemRemove(o);
                                            return mi;
                                          })
                                        : menuBase(o)
                                    }
                                  />
                                </TableCell>
                              );
                            }

                            if (val.row === 'h-menu') {
                              return (
                                <TableCell
                                  key={`${i}_menu`}
                                  padding="none"
                                  className="w1"
                                  onClick={ev => {
                                    ev.stopPropagation();
                                  }}
                                >
                                  <HMenu
                                    items={() => {
                                      if (val.items) {
                                        let items = [];

                                        let val_items = typeof val.items === 'function' ? val.items(o, i) : val.items;

                                        let can_edit = !props.module || props.module.edit;

                                        for (let mi of val_items) {
                                          switch (mi) {
                                            case ':divider':
                                              items.push(menuDivider(o));
                                              break;
                                            case ':edit':
                                              if (can_edit) items.push(menuItemEdit(o));
                                              break;
                                            case ':toggle':
                                              if (can_edit) items.push(menuItemToggle(o));
                                              break;
                                            case ':remove':
                                              if (can_edit) items.push(menuItemRemove(o));
                                              break;
                                            default:
                                              items.push(mi);
                                              break;
                                          }
                                        }
                                        return items;
                                      } else {
                                        return menuBase(o);
                                      }
                                    }}
                                  />
                                </TableCell>
                              );
                            }

                            if (val.row === 'menu_basic') {
                              return (
                                <TableCell
                                  key={`${i}_menu`}
                                  padding="none"
                                  className="w1"
                                  onClick={ev => {
                                    ev.stopPropagation();
                                  }}
                                >
                                  <Menu items={[menuItemEdit(o), menuItemRemove(o)]} />
                                </TableCell>
                              );
                            }

                            let result_row = val.row(o, i, selected);
                            return result_row.type === TableCell ? (
                              result_row
                            ) : (
                              <TableCell
                                className={val.class}
                                key={`${i}_${key}`}
                              >
                                {result_row}
                              </TableCell>
                            );
                          })}
                        </TableRow>

                        {detailExpanded && (
                          <TableRow>
                            <TableCell colSpan={100}>
                              <div className="m-8">
                                <Grid
                                  container
                                  spacing={1}
                                >
                                  {Object.entries(props.columns).map(([key, val]) => {
                                    if (!val.detail) return null;

                                    let noL = val.value === '_not_';

                                    let colL = noL ? 0 : 4;
                                    let colR = noL ? 12 : 8;

                                    return (
                                      <Fragment key={key}>
                                        {colL > 0 && (
                                          <Grid
                                            item
                                            xs={colL}
                                          >
                                            <Typography
                                              align="right"
                                              color="textSecondary"
                                            >
                                              {val.value}
                                            </Typography>
                                          </Grid>
                                        )}
                                        <Grid
                                          item
                                          xs={colR}
                                        >
                                          <Typography component="div">
                                            {(() => {
                                              if (typeof val.row === 'undefined') {
                                                return o[key];
                                              }

                                              if (val.row === 'pic') {
                                                return (
                                                  <Avatar
                                                    src={pic(o[key])}
                                                    style={{
                                                      width: 30,
                                                      height: 30,
                                                    }}
                                                  >
                                                    <Icon>{val.icon || 'image'}</Icon>
                                                  </Avatar>
                                                );
                                              }

                                              if (val.row === 'fullname') {
                                                return o.name + ' ' + o.surname;
                                              }

                                              if (val.row === 'bool') {
                                                return o[key] == '1' ? 'Si' : 'No';
                                              }

                                              if (val.row === 'datetime') {
                                                return humanDatetime(o[key]);
                                              }

                                              if (val.row === 'date') {
                                                return humanDate(o[key]);
                                              }

                                              if (val.row === 'coin') {
                                                return coin(o[key]);
                                              }

                                              if (val.row === 'percent') {
                                                return o[key] + '%';
                                              }

                                              return val.row(o, i);
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
                      </Fragment>
                    );
                  },
            )}
          </TableBody>
        </Table>
      </FuseScrollbars>

      {!props.notPagination && (
        <TablePagination
          component="div"
          count={data.total}
          page={fil.page}
          rowsPerPage={fil.limit}
          rowsPerPageOptions={[5, 10, 15, 20, 25, 50, 100]}
          labelRowsPerPage="Mostrar"
          labelDisplayedRows={o => `${o.from}-${o.to} de ${o.count}`}
          onChangePage={(event, page) => {
            setFil(prevState => ({
              ...prevState,
              page,
            }));
          }}
          onChangeRowsPerPage={event => {
            let limit = event.target.value;

            setFil(prevState => ({
              ...prevState,
              page: 0,
              limit,
            }));

            // Pref.set('datable_limit', limit);
          }}
        />
      )}
    </div>
  );
}

Datable.propTypes = {
  endpoint: PropTypes.string,
  fil: PropTypes.object,
  columns: PropTypes.object.isRequired,
  module: PropTypes.object,
  row: PropTypes.func,
  modal: PropTypes.object,
  notLoading: PropTypes.bool,
  notPagination: PropTypes.bool,
  notFilter: PropTypes.bool,
  notHeader: PropTypes.bool,
  detailed: PropTypes.bool,
  onClickRow: PropTypes.func,
  onRowStyles: PropTypes.func,
  isRowSelected: PropTypes.func,
  onData: PropTypes.func,
  defaultPageLimit: PropTypes.number,
  defaultFil: PropTypes.object,
  emptyTitle: PropTypes.string,
  emptyMessage: PropTypes.string,
  emptyTable: PropTypes.bool,
  enabledState: PropTypes.number,
  disabledState: PropTypes.number,
};

Datable.defaultProps = {
  defaultFil: {},
  defaultPageLimit: 10,
  defaultPage: 0,
  enabledState: 1,
  disabledState: 2,
};

export default Datable;
