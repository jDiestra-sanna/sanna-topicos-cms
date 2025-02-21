import ClientLevel from 'models/client-level';
import FCheck from 'widgets/fields/FCheck';
import Form from 'widgets/fields/Form';
import FSelectLocal from 'widgets/fields/FSelectLocal';
import ModalForm from 'widgets/ModalFormv2';
import React from 'react';
import Toast from 'inc/Toast';

class M extends ModalForm {
  constructor(props) {
    super(props, {
      state: {
        item: {
          id: 0,
          client_level_id: 0,
          organizational_entity_id: 0,
          group_id: 0,
          client_id: 0,
          campus_id: 0,
          has_group: 0,
        },
      },
      title: 'a usuario',
      title_add: 'Asignar',
      size: 'xs',
      use_errors: true,
      props_save: {
        client_level_id: true,
        organizational_entity_id: true,
      },
    });
  }

  add = userId => {
    if (!userId) {
      return this.open();
    }

    this.config.endpoint = `/users/${userId}/assignments`;
    return this.open();
  };

  validateToSave = () => {
    if (!this.state.item.client_level_id) {
      return Toast.warning('Seleccione un NIVEL');
    }

    if (this.state.item.client_level_id == ClientLevel.GROUP_ID && !this.state.item.group_id) {
      return Toast.warning('Seleccione un GRUPO');
    }

    if (this.state.item.client_level_id == ClientLevel.CLIENT_ID && !this.state.item.client_id) {
      return Toast.warning('Seleccione un CLIENTE');
    }

    if (this.state.item.client_level_id == ClientLevel.CAMPUS_ID && !this.state.item.campus_id) {
      return Toast.warning('Seleccione una SEDE');
    }

    return true;
  };

  content() {
    const { item } = this.state;

    return super.content(
      <Form
        error={this.state.error}
        errors={this.state.errors}
        disabled={this.state.loading}
      >
        <FSelectLocal
          label="Nivel"
          name="client_level_id"
          value={item.client_level_id}
          endpoint={`/dropdown-options/client-levels`}
          onChange={e => {
            this.setState({
              item: {
                ...this.state.item,
                client_level_id: e.target.value,
                group_id: 0,
                client_id: 0,
                campus_id: 0,
                organizational_entity_id: 0,
                has_group: 0,
              },
            });
          }}
          required
        />

        {item.client_level_id != ClientLevel.GROUP_ID && (
          <FCheck
            label="¿Tiene Grupo?"
            name="has_group"
            value={item.has_group}
            onChange={e => {
              this.changed(e, () => {
                this.setState({
                  item: {
                    ...this.state.item,
                    group_id: 0,
                    client_id: 0,
                    campus_id: 0,
                    organizational_entity_id: 0,
                  },
                });
              });
            }}
            dense
          />
        )}

        {(item.client_level_id == ClientLevel.GROUP_ID || item.has_group) && (
          <FSelectLocal
            label="Grupo"
            name="group_id"
            value={item.group_id}
            endpoint={`/dropdown-options/groups`}
            onChange={e => {
              const id = e.target.value;
              this.setState({
                item: {
                  ...this.state.item,
                  group_id: id,
                  organizational_entity_id: id,
                  client_id: 0,
                  campus_id: 0,
                },
              });
            }}
            required
          />
        )}

        {item.client_level_id != ClientLevel.GROUP_ID && (
          <FSelectLocal
            notLoad={item.has_group && !item.group_id}
            label="Cliente"
            name="client_id"
            value={item.client_id}
            endpoint={`/dropdown-options/clients?group_id=${item.group_id}`}
            disabled={item.has_group && !item.group_id}
            onChange={e => {
              const id = e.target.value;
              this.setState({
                item: {
                  ...this.state.item,
                  client_id: id,
                  organizational_entity_id: id,
                  campus_id: 0,
                },
              });
            }}
            required
          />
        )}

        {item.client_level_id == ClientLevel.CAMPUS_ID && (
          <FSelectLocal
            notLoad={!item.client_id}
            label="Sede"
            name="campus_id"
            value={item.campus_id}
            endpoint={`/dropdown-options/campus?client_id=${item.client_id}`}
            disabled={!item.client_id}
            onChange={e => {
              const id = e.target.value;
              this.setState({
                item: {
                  ...this.state.item,
                  campus_id: id,
                  organizational_entity_id: id,
                },
              });
            }}
            required
          />
        )}
      </Form>,
    );
  }
}

export default M;
