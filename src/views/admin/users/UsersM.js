import { Button, FormControlLabel, Grid, Switch, Tooltip } from '@material-ui/core';
import { InputUtils } from 'inc/Utils';
import Alert from 'inc/Alert';
import Api from 'inc/Apiv2';
import DocumentType from 'models/document-type';
import FCheck from 'widgets/fields/FCheck';
import Form from 'widgets/fields/Form';
import FPassword from 'widgets/fields/FPassword';
import FSelectLocal from 'widgets/fields/FSelectLocal';
import FText from 'widgets/fields/FText';
import ModalForm from 'widgets/ModalFormv2';
import moment from 'moment';
import React from 'react';
import Roles from 'models/roles';
import UserAssignments from './UserAssignments';
import UserFiles from './UserFiles';

class M extends ModalForm {
  constructor(props) {
    super(props, {
      state: {
        item: {
          id: '',
          role_id: '',
          name: '',
          // surname                  : '',
          surname_first: '',
          surname_second: '',
          // document                 : '',
          document_type_id: '',
          document_number: '',
          password: '',
          email: '',
          phone: '',
          pic: '',
          pic_file_id: '',
          sex_id: null,
          proffesion_id: null,
          speciality: '',
          colegiatura: '',
          ubigeo_peru_department_id: null,
          ubigeo_peru_province_id: null,
          ubigeo_peru_district_id: null,
          address: '',
          cost_center_id: null,
          can_download: 0,
          is_central: 0,
          birthdate: null,
          secret_key_approved: 0,
          assignments: [],
          files: [],
        },
      },
      endpoint: '/users',
      title: 'usuario',
      size: 'lg',
      use_errors: true,
      props_save: {
        role_id: true,
        name: true,
        surname_first: true,
        surname_second: true,
        document_type_id: true,
        document_number: true,
        password: true,
        email: true,
        phone: true,
        is_central: true,
        sex_id: true,
        proffesion_id: true,
        speciality: true,
        colegiatura: true,
        ubigeo_peru_department_id: true,
        ubigeo_peru_province_id: true,
        ubigeo_peru_district_id: true,
        address: true,
        cost_center_id: true,
        can_download: true,
        birthdate: true,
        secret_key_approved: { u: true },
      },
    });
  }

  addAditionalData = async () => {
    if (
      this.isEdit() ||
      (!this.isEdit() && this.state.item.role_id !== Roles.HEALTH_TEAM_ID && this.state.item.is_central > 0)
    ) {
      return this.save();
    }

    this.setState({
      loading: true,
      error: null,
      errors: null,
    });

    let response = await Api.post(this.config.endpoint, this.getData(), 'Guardando...');

    if (response.ok) {
      this.setState({
        open: true,
        loading: false,
        item: {
          ...this.state.item,
          id: response.data,
        },
      });
    } else {
      if (this.config.use_errors) {
        this.setState({
          loading: false,
          error: response.message,
          errors: response.errors,
        });
      } else {
        Alert.error(response.message);
        this.setState({
          loading: false,
          error: null,
          errors: null,
        });
      }
    }
  };

  footer() {
    let btnColor = '';
    let btnText = '';

    if (this.isEdit()) {
      btnColor = 'secondary';
      btnText = 'Guardar';
    } else {
      if (this.state.item.role_id != Roles.HEALTH_TEAM_ID && this.state.item.is_central > 0) {
        btnColor = 'secondary';
        btnText = 'Guardar';
      } else {
        btnColor = 'default';
        btnText = 'Continuar';
      }
    }

    return (
      <Button
        color={btnColor}
        variant="contained"
        type="submit"
        onClick={this.addAditionalData}
        disabled={this.state.loading || !this.validate()}
      >
        {btnText}
      </Button>
    );
  }

  content() {
    const { item } = this.state;

    return super.content(
      <Form
        error={this.state.error}
        errors={this.state.errors}
        disabled={this.state.loading}
      >
        <FSelectLocal
          sm={3}
          label="Perfil"
          name="role_id"
          value={item.role_id}
          endpoint="/dropdown-options/roles"
          onChange={e => {
            this.changed(e, () => {
              this.setState({
                item: {
                  ...this.state.item,
                  is_central: this.state.item.role_id == Roles.CLIENT_ID ? 0 : 1,
                },
              });
            });
          }}
          required
        />

        <FText
          sm={3}
          label="Nombre"
          name="name"
          value={item.name}
          onChange={this.changed}
          onKeyPress={e => InputUtils.onlyLetters(e, { spaces: true })}
          inputProps={{ maxLength: 50 }}
          required
        />

        {/* <FText
              sm={6}
              label="Apellido"
              name="surname"
              value={item.surname}
              onChange={this.changed}
              required/> */}

        <FText
          sm={3}
          label="Apellido Paterno"
          name="surname_first"
          value={item.surname_first}
          onChange={this.changed}
          onKeyPress={e => InputUtils.onlyLetters(e, { spaces: true })}
          inputProps={{ maxLength: 50 }}
          required
        />

        <FText
          sm={3}
          label="Apellido Materno"
          name="surname_second"
          value={item.surname_second}
          onChange={this.changed}
          onKeyPress={e => InputUtils.onlyLetters(e, { spaces: true })}
          inputProps={{ maxLength: 50 }}
          required
        />

        <FSelectLocal
          sm={3}
          label="Tipo Documento"
          name="document_type_id"
          value={item.document_type_id}
          endpoint="/dropdown-options/document-types"
          onChange={e => {
            this.setState({
              item: {
                ...this.state.item,
                document_type_id: e.target.value,
                document_number: '',
              },
            });
          }}
          required
        />

        <FText
          sm={3}
          label="N° de Documento"
          name="document_number"
          value={item.document_number}
          onChange={this.changed}
          onKeyPress={e => InputUtils.onlyNumbers(e)}
          inputProps={{ maxLength: item.document_type_id == DocumentType.DNI_ID ? 8 : 12 }}
          onBlur={e => {
            let value = e.target.value;
            if (!value || !item.document_type_id) return;
            const length = item.document_type_id == DocumentType.DNI_ID ? 8 : 12;
            value = value.padStart(length, '0');

            this.setState({
              item: {
                ...this.state.item,
                document_number: value,
              },
            });
          }}
          required
        />

        <FText
          sm={3}
          label="Correo electrónico"
          name="email"
          value={item.email}
          onChange={this.changed}
          type="email"
          required
        />

        <FPassword
          sm={3}
          label="Contraseña"
          name="password"
          value={item.password}
          onChange={this.changed}
        />

        <FText
          sm={3}
          label="Celular"
          name="phone"
          value={item.phone}
          onChange={this.changed}
          inputProps={{ maxLength: 9 }}
          onKeyPress={e => InputUtils.onlyNumbers(e)}
          required
        />

        {item.id > 0 && (
          <FormControlLabel
            sm={3}
            control={
              <Switch
                checked={!item.secret_key_approved}
                onChange={() => {
                  this.setState({
                    item: {
                      ...this.state.item,
                      secret_key_approved: !item.secret_key_approved ? 1 : 0,
                    },
                  });
                }}
                name="secret_key_approved"
                color="primary"
              />
            }
            label={
              <Tooltip
                title="Activa este botón para permitir al usuario volver a escanear el QR con la aplicación de Google Authenticator"
                arrow
              >
                <div className="flex items-center">
                  <span>Reiniciar MFA </span>
                  <span className="material-icons-outlined text-16 inline-block ml-8">info</span>
                </div>
              </Tooltip>
            }
          />
        )}

        {/* <FCheck
          sm={3}
          label="Es Central"
          name="is_central"
          value={item.is_central}
          onChange={this.changed}
          disabled={item.role_id == Roles.ADMIN_ID || item.role_id == Roles.HEALTH_TEAM_ID}
        /> */}

        {/* Inicio Personal Asistencial */}

        {item.role_id == Roles.HEALTH_TEAM_ID && (
          <Grid
            item
            sm={12}
          >
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                sm={3}
              >
                <FSelectLocal
                  label="Sexo"
                  name="sex_id"
                  value={item.sex_id}
                  endpoint="/dropdown-options/sexes"
                  onChange={this.changed}
                  required
                />
              </Grid>

              <Grid
                item
                sm={3}
              >
                <FSelectLocal
                  sm={3}
                  label="Profesión"
                  name="proffesion_id"
                  value={item.proffesion_id}
                  endpoint="/dropdown-options/proffesions"
                  onChange={this.changed}
                  required
                />
              </Grid>

              <Grid
                item
                sm={3}
              >
                <FText
                  sm={3}
                  label="Especialidad"
                  name="speciality"
                  value={item.speciality}
                  onChange={this.changed}
                />
              </Grid>

              <Grid
                item
                sm={3}
              >
                <FText
                  sm={3}
                  label="Colegiatura"
                  name="colegiatura"
                  value={item.colegiatura}
                  onChange={this.changed}
                  required
                />
              </Grid>

              <Grid
                item
                sm={3}
              >
                <FSelectLocal
                  sm={3}
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
                sm={3}
              >
                <FSelectLocal
                  notLoad={!item.ubigeo_peru_department_id}
                  sm={3}
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
                sm={3}
              >
                <FSelectLocal
                  notLoad={!item.ubigeo_peru_province_id}
                  sm={3}
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
                sm={3}
              >
                <FText
                  sm={3}
                  label="Dirección"
                  name="address"
                  value={item.address}
                  onChange={this.changed}
                  required
                />
              </Grid>

              <Grid
                item
                sm={3}
              >
                <FSelectLocal
                  sm={3}
                  label="Centro de Costo"
                  name="cost_center_id"
                  value={item.cost_center_id}
                  endpoint="/dropdown-options/cost-centers"
                  onChange={this.changed}
                  required
                />
              </Grid>

              <Grid
                item
                sm={3}
              >
                <FText
                  sm={3}
                  label="Fecha Nacimiento"
                  name="birthdate"
                  value={item.birthdate}
                  onChange={this.changed}
                  type="date"
                  inputProps={{
                    max: moment().subtract(1, 'days').format('YYYY-MM-DD'),
                  }}
                  // onKeyDown={e =>  e.preventDefault()}
                  required
                />
              </Grid>

              <Grid
                item
                sm={3}
              >
                <FCheck
                  sm={3}
                  label="Puede Descargar"
                  name="can_download"
                  value={item.can_download}
                  onChange={this.changed}
                />
              </Grid>

              {item.id > 0 && <UserFiles userId={item.id} />}
            </Grid>
          </Grid>
        )}

        {/* Fin Personal Asistencial */}

        {!item.is_central && item.id > 0 && <UserAssignments userId={item.id} />}
      </Form>,
    );
  }
}

export default M;
