import { getModuleByPath } from 'inc/Utils';
import Dahead, { Fil } from 'widgets/datable/DaheadV2';
import Datable from 'widgets/datable/DatableV2';
import FusePageCarded from '@fuse/core/FusePageCarded';
import React, { useRef, useState } from 'react';
import UsersM from './UsersM';
import Api from 'inc/Apiv2';

export default function (props) {
  const [module] = useState(() => getModuleByPath(props.route.path));

  const dahead = useRef(null);
  const datable = useRef(null);
  const modal = useRef(null);

  return (
    <>
      <FusePageCarded
        header={
          <Dahead
            {...props}
            ref={dahead}
            modal={modal}
            datable={datable}
            module={module}
            fields={[Fil.local('role_id', 'Perfil', '/dropdown-options/roles')]}
            actions={[
              {
                  label: `Descargar Datos`,
                  onClick: () => {
                    Api.download(`/users/export`, dahead.current.fil());
                  },
              }
            ]}  
          />
        }
        content={
          <Datable
            {...props}
            ref={datable}
            fil={() => dahead.current.fil()}
            modal={modal}
            module={module}
            onRowStyles={o => (o.protected ? { opacity: '0.3' } : {})}
            columns={{
              id: { value: 'ID', order_col: 'user.id' },
              name: { value: 'Nombre', order_col: 'user.name' },
              surname_first: { value: 'Paterno', order_col: 'user.surname_first' },
              surname_second: { value: 'Materno', order_col: 'user.surname_second' },
              role: { value: 'Perfil', order_col: 'role.name', row: o => o.role.name },
              email: { value: 'Email', order_col: 'user.email' },
              state: { value: '', order_col: 'user.state', row: 'state' },
              date_created: { value: 'Fecha de registro', order_col: 'user.date_created', row: 'datetime' },
              _menu: {
                value: '',
                row: 'h-menu',
                items: o => {
                  if (o.protected) {
                    return [];
                  } else {
                    return [':edit', ':toggle', ':remove'];
                  }
                },
              },
              is_central: { detail: true, value: 'Central', row: 'bool' },
              phone: { detail: true, value: 'Celular' },
              document_type: {
                detail: true,
                value: 'Tipo Documento',
                row: o => (o.document_type ? o.document_type.name : ''),
              },
              document_number: { detail: true, value: 'N° Documento' },
            }}
          />
        }
      />
      <UsersM
        ref={modal}
        onSaved={() => datable.current.apply()}
      />
    </>
  );
}
