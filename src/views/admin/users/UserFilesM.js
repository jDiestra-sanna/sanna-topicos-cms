import React from 'react';
import ModalForm from 'widgets/ModalFormv2';
import Form from 'widgets/fields/Form';
import FText from 'widgets/fields/FText';
import FFileUploadAutoV2 from 'widgets/fields/FFileUploadAutoV2';
import FSelectLocal from 'widgets/fields/FSelectLocal';
import { Button } from '@material-ui/core';

class M extends ModalForm {
  constructor(props) {
    super(props, {
      state: {
        item: {
          id: 0,
          file_type_id: 0,
          description: '',
          file_id: 0,
          url: '',
        },
      },
      title: 'Archivo de Usuario',
      title_add: 'Agregar',
      size: 'xs',
      use_errors: true,
      props_save: {
        file_type_id: true,
        file_id: true,
        description: true,
      },
    });
  }

  add = userId => {
    if (!userId) {
      return this.open();
    }

    this.config.endpoint = `/users/${userId}/files`;
    return this.open();
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
          label="Tipo Archivo"
          name="file_type_id"
          value={item.file_type_id}
          endpoint={`/dropdown-options/file-types`}
          onChange={this.changed}
          required
        />

        <FFileUploadAutoV2
          accept="image/png, image/jpeg, application/pdf"
          endpoint="/files/pdf-jpeg-png"
          value={item.url}
          label="Archivo"
          onChange={data => {
            if (data) {
              this.setState({
                item: {
                  ...this.state.item,
                  file_id: data.id,
                  url: data.url,
                },
              });
            }
          }}
          required
        />

        <FText
          label="Descripción"
          name="description"
          value={item.description}
          onChange={this.changed}
          required
          multiline
          rows={3}
        />
      </Form>,
    );
  }
}

export default M;
