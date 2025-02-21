import { Grid, Icon, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import Alert from 'inc/Alert';
import Api from 'inc/Apiv2';
import IconButton from '@material-ui/core/IconButton';
import React, { useEffect, useRef, useState } from 'react';
import Toast from 'inc/Toast';
import Tooltip from '@material-ui/core/Tooltip';
import UserAssignmentsM from './UserAssignmentsM';

export default function (props) {
  const modalRef = useRef(null);
  const [items, setItems] = useState([]);

  function create() {
    modalRef.current.add(props.userId);
  }

  async function remove(index) {
    const item = items[index];
    const response = await Api.delete(`/users/${props.userId}/assignments/${item.id}`);

    if (!response.ok) return Alert.error(response.message);
    Toast.success('Eliminado correctamente');
    loadData();
  }

  async function loadData() {
    if (props.userId > 0) {
      const response = await Api.get(
        `/users/${props.userId}/assignments`,
        { limit: 10000 },
        'Cargando asignaciones...',
      );

      if (!response.ok) {
        return Alert.error(response.message);
      }

      setItems(response.data);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Grid
      item
      xs={12}
    >
      <div
        className="datable"
        style={{ position: 'relative', zIndex: 3, maxHeight: 300, overflowY: 'auto' }}
      >
        <Table className="border-1">
          <TableHead>
            <TableRow>
              <TableCell colSpan={2}>Asignaciones</TableCell>
              <TableCell
                colSpan={3}
                className="text-right"
                style={{ padding: 4 }}
              >
                <Tooltip title="Agregar">
                  <IconButton
                    size="small"
                    onClick={create}
                  >
                    <Icon>edit</Icon>
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ paddingTop: 0, paddingBottom: 0 }}>Grupo</TableCell>
              <TableCell style={{ paddingTop: 0, paddingBottom: 0 }}>Cliente</TableCell>
              <TableCell style={{ paddingTop: 0, paddingBottom: 0 }}>Sede</TableCell>
              <TableCell
                className="w1"
                style={{ padding: 2 }}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((o, i) => (
              <TableRow key={i}>
                <TableCell>{o.campus?.client?.group?.name || ''}</TableCell>
                <TableCell>{o.campus?.client?.name || ''}</TableCell>
                <TableCell>{o.campus?.name || ''}</TableCell>
                <TableCell style={{ padding: 4, maxWidth: '1%' }}>
                  {/* <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (o.id > 0) {
                          Alert.confirm(() => remove(i));
                        } else {
                          remove(i);
                        }
                      }}
                    >
                      <Icon>close</Icon>
                    </IconButton>
                  </Tooltip> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <UserAssignmentsM
          ref={modalRef}
          onSaved={() => loadData()}
        />
      </div>
    </Grid>
  );
}
