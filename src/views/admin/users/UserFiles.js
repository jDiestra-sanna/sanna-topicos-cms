import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Grid, Icon, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import UserFilesM from './UserFilesM';
import Alert from 'inc/Alert';
import Api from 'inc/Apiv2';
import Toast from 'inc/Toast';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  avatar: {
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.4)',
    },
  },
});

export default function (props) {
  const classes = useStyles();
  const { userId } = props;
  const modalRef = useRef(null);
  const [items, setItems] = useState([]);

  function create() {
    modalRef.current.add(userId);
  }

  async function remove(index) {
    const item = items[index];
    const response = await Api.delete(`/users/${userId}/files/${item.id}`);

    if (!response.ok) return Alert.error(response.message);
    Toast.success('Eliminado correctamente');
    loadData();
  }

  async function loadData() {
    if (userId > 0) {
      const response = await Api.get(`/users/${userId}/files`);

      if (!response.ok) {
        return Alert.error(response.message);
      }

      setItems(response.data);
    }
  }

  function avatarClickHandle(url) {
    window.open(url, '_blank');
    // Crear un elemento <a>
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
        style={{ position: 'relative', zIndex: 3 }}
      >
        <Table className="border-1">
          <TableHead>
            <TableRow>
              <TableCell colSpan={2}>Archivos</TableCell>
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
                    <Icon>add_circle</Icon>
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ paddingTop: 0, paddingBottom: 0, width: '280px' }}>Tipo</TableCell>
              <TableCell style={{ paddingTop: 0, paddingBottom: 0, width: '150px' }}>Archivo</TableCell>
              <TableCell style={{ paddingTop: 0, paddingBottom: 0 }}>Descripción</TableCell>
              <TableCell
                className="w1"
                style={{ padding: 2 }}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((o, i) => (
              <TableRow key={i}>
                <TableCell>{o.file_type ? o.file_type.name : ''}</TableCell>
                <TableCell>
                  <Avatar
                    className={classes.avatar}
                    src={o.file.url}
                    onClick={() => avatarClickHandle(o.file.url)}
                  >
                    {/(.pdf)/.test(o.file?.path || '') ? 
                      <span style={{fontSize: '10px'}}>PDF</span> : 
                      /(.doc|.docx)/.test(o.file?.path || '') ? 
                      <span style={{fontSize: '10px'}}>DOC</span> : 
                      /(.xls|.xlsx)/.test(o.file?.path || '') ? 
                      <span style={{fontSize: '10px'}}>XLS</span> : 
                      /(.jpg|.jpeg|.png|.ico|.svg|.webp)/.test(o.file?.path || '') ? 
                      null :
                      <InsertDriveFileIcon className="h-20 w-20" />
                    }
                  </Avatar>
                </TableCell>
                <TableCell>{o.description ? o.description : ''}</TableCell>
                <TableCell style={{ padding: 4, maxWidth: '1%' }}>
                  <Tooltip title="Eliminar">
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
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <UserFilesM
          ref={modalRef}
          onSaved={() => loadData()}
        />
      </div>
    </Grid>
  );
}
