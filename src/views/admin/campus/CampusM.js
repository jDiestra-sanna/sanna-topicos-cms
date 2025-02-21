import { Grid, makeStyles, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { InputUtils } from 'inc/Utils';
import FCheck from '../../../widgets/fields/FCheck';
import FFileUploadAuto from '../../../widgets/fields/FFileUploadAuto';
import Form from '../../../widgets/fields/Form';
import FSelectLocal from '../../../widgets/fields/FSelectLocal';
import FText from '../../../widgets/fields/FText';
import ModalForm from '../../../widgets/ModalFormv2';
import React from 'react';
import TimePicker from 'react-time-picker';
import moment from 'moment';

const days = [
  {
    id: 1,
    name: 'Lunes',
  },
  {
    id: 2,
    name: 'Martes',
  },
  {
    id: 3,
    name: 'Miércoles',
  },
  {
    id: 4,
    name: 'Jueves',
  },
  {
    id: 5,
    name: 'Viernes',
  },
  {
    id: 6,
    name: 'Sábado',
  },
  {
    id: 7,
    name: 'Domingo',
  },
];

class M extends ModalForm {
  constructor(props) {
    super(props, {
      state: {
        item: {
          id: '',
          client_id: '',
          opening_date: '',
          ubigeo_peru_department_id: '',
          ubigeo_peru_province_id: '',
          ubigeo_peru_district_id: '',
          address: '',
          name: '',
          contact: '',
          phone: '',
          email: '',
          pic: '',
          warehouse_code: '',
          has_group: '0',
          client: {
            group_id: '',
          },
          schedules: [],
        },
      },
      size: 'md',
      endpoint: '/campus',
      title: 'Sede',
      use_errors: true,
      props_save: {
        client_id: true,
        opening_date: true,
        ubigeo_peru_department_id: true,
        ubigeo_peru_province_id: true,
        ubigeo_peru_district_id: true,
        address: true,
        name: true,
        contact: true,
        phone: true,
        email: true,
        pic: true,
        warehouse_code: true,
        schedules: true,
      },
    });
  }

  handleChangeTimePerDay = (day_id, time, inoutKey = '') => {
    const indexFound = this.state.item.schedules?.findIndex(o => o.day_id === day_id);
    let schedules = this.state.item.schedules || [];

    if (indexFound > -1) {
      schedules[indexFound][inoutKey] = time || '';
    } else {
      schedules.push({
        day_id: day_id,
        [inoutKey]: time || '',
      });
    }

    schedules = schedules.filter(s => s.opening_time || s.closing_time);

    this.setState({
      item: {
        ...this.state.item,
        schedules,
      },
    });
  };

  setForm = (rsp) => {
    if (rsp.data.campus_schedule) {
      rsp.data.schedules = rsp.data.campus_schedule.map(s => ({
        day_id: s.day_id,
        opening_time: moment(s.opening_time, 'HH:mm:ss').format('HH:mm'),
        closing_time: moment(s.closing_time, 'HH:mm:ss').format('HH:mm'),
      }));
    } else {
      rsp.data.schedules = [];
    }
    
    delete rsp.data.campus_schedule;

    this.setData({
        ...rsp,
        item: rsp.data ? {...rsp.data} : {...this.initialState.item}
    });
  };

  content() {
    const { item } = this.state;

    return super.content(
      <Form
        error={this.state.error}
        errors={this.state.errors}
        disabled={this.state.loading}
      >
        <Grid
          item
          xs={7}
        >
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              sm={6}
              className="p-8"
            >
              <FCheck
                disabled={item.id > 0}
                label="¿Tiene grupo?"
                name="has_group"
                value={item.has_group || item.client?.group_id > 0}
                onChange={e => {
                  this.changed(e, () => {
                    this.setState({
                      item: {
                        ...this.state.item,
                        client_id: '',
                        client: {
                          group_id: '',
                        },
                      },
                    });
                  });
                }}
              />
            </Grid>

            {item.has_group == '1' || item.client?.group_id > 0 ? (
              <Grid
                item
                sm={6}
              >
                <FSelectLocal
                  disabled={item.id > 0}
                  label="Grupo"
                  name="group_id"
                  value={item.client?.group_id}
                  endpoint="/dropdown-options/groups"
                  onChange={e => {
                    this.setState({
                      item: {
                        ...this.state.item,
                        client_id: '',
                        client: {
                          group_id: e.target.value,
                        },
                      },
                    });
                  }}
                  required
                />
              </Grid>
            ) : (
              <Grid
                item
                sm={6}
                className="p-8"
              />
            )}

            <Grid
              item
              sm={6}
            >
              <FSelectLocal
                disabled={item.id > 0 || (!item.client.group_id && item.has_group == '1')}
                label="Cliente"
                name="client_id"
                value={item.client_id}
                endpoint={`/dropdown-options/clients?group_id=${item.client.group_id || 0}`}
                onChange={this.changed}
                required
              />
            </Grid>

            <Grid
              item
              sm={6}
            >
              <FText
                label="Nombre"
                name="name"
                value={item.name}
                onChange={this.changed}
                required
              />
            </Grid>

            <Grid
              item
              sm={6}
            >
              <FText
                label="Fecha Apertura"
                name="opening_date"
                value={item.opening_date}
                onChange={this.changed}
                type="date"
                required
              />
            </Grid>

            <Grid
              item
              sm={6}
            >
              <FSelectLocal
                label="Departamento"
                name="ubigeo_peru_department_id"
                value={item.ubigeo_peru_department_id}
                endpoint="/dropdown-options/ubigeo-peru-departments"
                onChange={e => {
                  this.changed(e, () => {
                    this.setState({
                      item: {
                        ...this.state.item,
                        ubigeo_peru_province_id: '',
                        ubigeo_peru_district_id: '',
                      },
                    });
                  });
                }}
                required
              />
            </Grid>

            <Grid
              item
              sm={6}
            >
              <FSelectLocal
                notLoad={!item.ubigeo_peru_department_id}
                label="Provincia"
                name="ubigeo_peru_province_id"
                value={item.ubigeo_peru_province_id}
                endpoint={`/dropdown-options/ubigeo-peru-provinces?department_id=${item.ubigeo_peru_department_id}`}
                disabled={!item.ubigeo_peru_department_id}
                onChange={e => {
                  this.changed(e, () => {
                    this.setState({
                      item: {
                        ...this.state.item,
                        ubigeo_peru_district_id: '',
                      },
                    });
                  });
                }}
                required
              />
            </Grid>

            <Grid
              item
              sm={6}
            >
              <FSelectLocal
                notLoad={!item.ubigeo_peru_province_id}
                label="Distrito"
                name="ubigeo_peru_district_id"
                value={item.ubigeo_peru_district_id}
                endpoint={`/dropdown-options/ubigeo-peru-districts?province_id=${item.ubigeo_peru_province_id}`}
                disabled={!item.ubigeo_peru_province_id}
                onChange={this.changed}
                required
              />
            </Grid>

            <Grid
              item
              sm={12}
            >
              <FText
                label="Dirección"
                name="address"
                value={item.address}
                onChange={this.changed}
                required
              />
            </Grid>

            <Grid
              item
              sm={6}
            >
              <FText
                inputProps={{ maxLength: 4 }}
                onKeyPress={e => InputUtils.onlyNumbers(e)}
                label="Código Almacén"
                name="warehouse_code"
                value={item.warehouse_code}
                onChange={this.changed}
              />
            </Grid>

            <Grid
              item
              sm={6}
            >
              <FText
                label="Contacto"
                name="contact"
                value={item.contact}
                onChange={this.changed}
              />
            </Grid>

            <Grid
              item
              sm={6}
            >
              <FText
                inputProps={{ maxLength: 9 }}
                onKeyPress={e => InputUtils.onlyNumbers(e)}
                label="Celular"
                name="phone"
                value={item.phone}
                onChange={this.changed}
              />
            </Grid>

            <Grid
              item
              sm={6}
            >
              <FText
                sm={6}
                label="Correo electrónico"
                name="email"
                value={item.email}
                onChange={this.changed}
                type="email"
              />
            </Grid>

            <Grid
              item
              sm={6}
            >
              <FFileUploadAuto
                label="Logo"
                name="pic"
                value={item.pic}
                onChange={filename => {
                  this.setState({
                    item: {
                      ...this.state.item,
                      pic: filename,
                    },
                  });
                }}
                image
                original
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          sm={5}
        >
          <Table
            size="small"
            className="text-10"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="center"
                >
                  Horario de Atención
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Día</TableCell>
                <TableCell>Entrada</TableCell>
                <TableCell>Salida</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {days.map((day, index) => {
                const opening_time = item.schedules.find(s => s.day_id === day.id)?.opening_time || '';
                const closing_time = item.schedules.find(s => s.day_id === day.id)?.closing_time || '';

                return (
                  <TableRow key={index}>
                  <TableCell style={{ padding: 0 }}>{day.name}</TableCell>
                  <TableCell style={{ padding: '0 0 0 6px', width: 150 }}>
                    <TimePicker
                      disableClock
                      onChange={val => {
                        this.handleChangeTimePerDay(day.id, val, 'opening_time');
                      }}
                      value={opening_time}
                      format="hh:mm a"
                    />
                  </TableCell>
                  <TableCell style={{ padding: '0 0 0 6px', width: 150 }}>
                    <TimePicker
                      disableClock
                      onChange={val => {
                        this.handleChangeTimePerDay(day.id, val, 'closing_time');
                      }}
                      value={closing_time}
                      format="hh:mm a"
                    />
                  </TableCell>
                </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Grid>
      </Form>,
    );
  }
}

export default M;
