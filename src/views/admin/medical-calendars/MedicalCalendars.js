import { Box, Button, Icon, Input, Paper, ThemeProvider, Typography, makeStyles } from '@material-ui/core';
import { format } from 'date-fns';
import { getModuleByPath } from '../../../inc/Utils';
import { mii } from 'widgets/Menu';
import { useSelector } from 'react-redux';
import Alert from 'inc/Alert';
import Api from 'inc/Apiv2';
import clsx from 'clsx';
import Datable from '../../../widgets/datable/DatableV3';
import FuseAnimate from '@fuse/core/FuseAnimate';
import FusePageCarded from '@fuse/core/FusePageCarded';
import history from '@history';
import Ranger from 'widgets/Ranger';
import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { prepareOptions } from 'widgets/fields/FSelectAjax';

const useStyles = makeStyles(theme => ({
  search: {
    '&:disabled': {
      backgroundColor: '#E0E0E0',
      color: '#999',
    },
  },
}));

const DEFAULT_FIL = {
  group_id: 0,
  client_id: 0,
  campus_id: 0,
  query: '',
  date_from: null,
  date_to: null,
};

export default function (props) {
  const classes = useStyles();
  const mainTheme = useSelector(({ fuse }) => fuse.settings.mainTheme);
  const [module] = useState(() => getModuleByPath(props.route.path));
  const dahead = useRef(null);
  const datable = useRef(null);
  const [fil, setFil] = useState(DEFAULT_FIL);
  const [filData, setFilData] = useState({
    groups: [],
    clients: [],
    campus: [],
  });
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState(null);
  const [client, setClient] = useState(null);
  const [campus, setCampus] = useState(null);
  const [dates, setDates] = useState({
    date_from: null,
    date_to: null,
  });

  function getFilToDatable() {
    delete fil.group;
    delete fil.client;
    delete fil.campus;

    return {
      ...fil,
      date_from: fil.date_from && format(fil.date_from, 'yyyy-MM-dd'),
      date_to: fil.date_to && format(fil.date_to, 'yyyy-MM-dd'),
    };
  }

  useEffect(() => {
    async function load() {
      const response = await Api.get(`/dropdown-options/groups`, {}, false);
      if (!response.ok) return Alert.error(response.message);

      const groups = response.data.map(o => ({
        value: o.id,
        label: o.name,
        state: o.state,
      }));

      setFilData(prevState => ({
        ...prevState,
        groups,
      }));
    }

    load();
  }, []);

  useEffect(() => {
    async function load() {
      const response = await Api.get(`/dropdown-options/clients?group_id=${group?.value || 0}`, {}, false);
      if (!response.ok) return Alert.error(response.message);

      const clients = response.data.map(o => ({
        value: o.id,
        label: o.name,
        state: o.state,
      }));

      setFilData(prevState => ({
        ...prevState,
        clients,
      }));
    }

    load();
  }, [group?.value]);

  useEffect(() => {
    async function load() {
      if (!client?.value) return;

      const response = await Api.get(`/dropdown-options/campus?client_id=${client?.value || 0}`, {}, false);
      if (!response.ok) return Alert.error(response.message);

      const campus = response.data.map(o => ({
        value: o.id,
        label: o.name,
        state: o.state,
      }));

      setFilData(prevState => ({
        ...prevState,
        campus,
      }));
    }

    load();
  }, [client?.value]);

  return (
    <>
      <FusePageCarded
        header={
          <div className="flex flex-1 w-full items-center justify-between">
            <div className="flex flex-1 items-center">
              <FuseAnimate
                animation="transition.slideLeftIn"
                delay={300}
              >
                <div>
                  <Typography
                    className="hidden sm:flex"
                    variant="h6"
                  >
                    {module.title}
                  </Typography>
                </div>
              </FuseAnimate>
            </div>

            <div className="flex flex items-center justify-center ml-8">
              <ThemeProvider theme={mainTheme}>
                <Paper
                  className="flex items-center w-full px-8 pdg-tb-2 rounded-4"
                  elevation={1}
                  style={{ maxWidth: 200 }}
                >
                  <Icon
                    className="mr-8"
                    color="action"
                  >
                    search
                  </Icon>

                  <Input
                    color="primary"
                    placeholder={'Buscar'}
                    className="flex flex-1"
                    disableUnderline
                    fullWidth
                    value={query}
                    onChange={e => {
                      setQuery(e.target.value);
                    }}
                  />
                </Paper>
              </ThemeProvider>
            </div>

            <div className="flex flex items-center justify-center ml-8 text-gray">
              <ThemeProvider theme={mainTheme}>
                <Typography
                  component="div"
                  style={{ minWidth: 200 }}
                  color="textPrimary"
                >
                  <Select
                    isClearable
                    placeholder="Grupos"
                    options={prepareOptions(filData.groups)}
                    value={group}
                    onChange={o => {
                      if (o === null) {
                        setFil(prevState => ({
                          ...prevState,
                          group_id: 0,
                          client_id: 0,
                          campus_id: 0,
                        }));
                      }

                      setGroup(o);
                      setClient(null);
                      setCampus(null);
                    }}
                    styles={{
                      control: styles => ({
                        ...styles,
                        minHeight: 36,
                        border: 'none',
                      }),
                    }}
                  />
                </Typography>
              </ThemeProvider>
            </div>

            <div className="flex flex items-center justify-center ml-8 text-gray">
              <ThemeProvider theme={mainTheme}>
                <Typography
                  component="div"
                  style={{ minWidth: 200 }}
                  color="textPrimary"
                >
                  <Select
                    isClearable
                    placeholder="Clientes"
                    options={prepareOptions(filData.clients)}
                    value={client}
                    onChange={o => {
                      if (o === null) {
                        setFil(prevState => ({
                          ...prevState,
                          client_id: 0,
                          campus_id: 0,
                        }));
                      }

                      setClient(o);
                      setCampus(null);
                    }}
                    styles={{
                      control: styles => ({
                        ...styles,
                        minHeight: 36,
                        border: 'none',
                      }),
                    }}
                  />
                </Typography>
              </ThemeProvider>
            </div>

            <div className="flex flex items-center justify-center ml-8 text-gray">
              <ThemeProvider theme={mainTheme}>
                <Typography
                  component="div"
                  style={{ minWidth: 200 }}
                  color="textPrimary"
                >
                  <Select
                    isDisabled={!client?.value}
                    isClearable
                    placeholder="Sede"
                    options={prepareOptions(filData.campus)}
                    value={campus}
                    onChange={o => {
                      if (o === null) {
                        setFil(prevState => ({
                          ...prevState,
                          campus_id: 0,
                        }));
                      }

                      setCampus(o);
                    }}
                    styles={{
                      control: styles => ({
                        ...styles,
                        minHeight: 36,
                        border: 'none',
                      }),
                    }}
                  />
                </Typography>
              </ThemeProvider>
            </div>

            <Button
              disabled={!client || !campus}
              onClick={() => {
                setFil(DEFAULT_FIL);

                setTimeout(() => {
                  setFil({
                    group_id: group?.value || 0,
                    client_id: client?.value || 0,
                    campus_id: campus?.value || 0,
                    query: query || '',
                    date_from: dates.date_from || null,
                    date_to: dates.date_to || null,
                  });
                }, 200);
              }}
              variant="contained"
              color="default"
              className={clsx(classes.search, 'ml-8 mr-8')}
            >
              Buscar
            </Button>

            <Button
              className={classes.search}
              disabled={rows.length === 0}
              variant='contained'
              onClick={() => {
                Api.download(`/medical-calendars/export`, { campus_id: fil.campus_id });
              }}
            >
              Exportar
            </Button>
          </div>
        }
        content={
          <Datable
            {...props}
            emptyTable={!fil.campus_id}
            emptyMessage="Llenar los filtros para buscar"
            ref={datable}
            fil={getFilToDatable()}
            onData={data => setRows(data?.data || [])}
            module={module}
            onRowStyles={o => (o.protected ? { opacity: '0.3' } : {})}
            columns={{
              name: { value: 'Nombre', order_col: 'user.name' },
              surname_first: { value: 'Paterno', order_col: 'user.surname_first' },
              surname_second: { value: 'Materno', order_col: 'user.surname_second' },
              phone: { value: 'Teléfono', order_col: 'user.phone' },
              email: { value: 'Email', order_col: 'user.email' },
              programmed: { value: 'Programado', row: o => (o.programmed ? 'Si' : 'No'), order_col: 'programmed' },
              is_central: { value: 'Central', order_col: 'user.is_central', row: 'bool' },
              state: { value: '', order_col: 'user.state', row: 'state' },
              _menu: {
                value: '',
                row: 'h-menu',
                items: o => [
                  mii('edit_calendar', 'Programar calendario', () => {
                    history.push(`/medical-calendars/form/${o.id}/${fil.campus_id}`);
                  }),
                ],
              },

              document_type: {
                detail: true,
                value: 'Tipo Documento',
                row: o => (o.document_type ? o.document_type.name : ''),
              },
              document_number: { detail: true, value: 'N° Documento' },
              colegiatura: { detail: true, value: 'Colegiatura' },
            }}
          />
        }
      />
    </>
  );
}
