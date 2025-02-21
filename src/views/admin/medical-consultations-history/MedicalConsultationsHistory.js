import { Chip, Paper, Table, TableBody, TableCell, TableHead, TableRow, makeStyles } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import Alert from 'inc/Alert';
import Api from 'inc/Apiv2';
import Button from 'widgets/sanna/Button';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ConsultationType from 'models/consultation-type';
import FSelectAjax from 'widgets/fields/FSelectAjax';
import history from '@history';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import moment from 'moment';
import NotResults from 'widgets/sanna/NotResults';
import PageWrapper from 'app/fuse-layouts/layout1/components/PageWrapper';
import Paginator from 'widgets/sanna/Paginator';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import Ranger from 'widgets/sanna/fields/Ranger';
import React from 'react';
import Select from 'widgets/sanna/Select';
import useAuthUser from 'hooks/auth-user';
import WError from 'widgets/WError';

moment.locale('es');

const useStyles = makeStyles(theme => ({
  tablePaginationActions: {
    display: 'flex',
    gap: '8px',
    '& button': {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.secondary.main,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.palette.secondary.main,
      padding: 6,
    },
  },
  searcher: {
    '& .searcher__control': {
      borderColor: theme.palette.primary.main,
      borderRadius: '20px',
      '&:hover': {
        borderColor: theme.palette.primary.main,
      },
    },
    '& .searcher__indicators': {
      backgroundColor: theme.palette.primary.main,
      borderTopRightRadius: '20px',
      borderBottomRightRadius: '20px',
    },
    '& .searcher__indicator': {
      color: '#fff',
    },
    '& .searcher__indicator-separator': {
      backgroundColor: 'transparent',
    },
  },
}));

const DEFAULT_FIL = {
  selected: {
    medical_rest: null,
    consultation_type: null,
    client: null,
    campus: null,
    patient: null,
    date_from: new Date(),
    date_to: new Date(),
    query: '',
  },
  query: {
    limit: 10,
    page: 0,
    medical_rest: undefined,
    consultation_type_id: 0,
    client_id: 0,
    campus_id: 0,
    patient_id: 0,
    date_from: null,
    date_to: null,
  },
};

const MedicalConsultationsHistory = () => {
  const authUser = useAuthUser();
  const classes = useStyles();
  const [data, setData] = React.useState(null);
  const [fil, setFil] = React.useState(DEFAULT_FIL);
  const [loading, setLoading] = React.useState(false);
  const [dropdowns, setDropdowns] = React.useState({
    consultationTypes: [],
    clients: [],
    campus: [],
  });

  React.useEffect(() => {
    loadData();
  }, [JSON.stringify(fil)]);

  React.useEffect(() => {
    loadDropdownsInit();
  }, []);

  React.useEffect(() => {
    loadDropdownCampus(fil.query.client_id);
  }, [fil.query.client_id]);

  const loadData = async () => {
    setLoading(true);
    const reponse = await Api.get('/consultation-histories', fil.query);
    if (!reponse.ok) return Alert.error(reponse.message);

    setData(reponse);
    setLoading(false);
  };

  const loadDropdownsInit = async () => {
    let clients = [];
    let campus = [];
    let consultationTypes = [];

    const [consultationTypesRsp, clientsRsp] = await Promise.all([
      Api.get('/dropdown-options/consultation-types'),
      Api.get(`/dropdown-options/users/${authUser.data.id}/assignments/clients`, { limit: 1000 }),
    ]);

    if (!consultationTypesRsp.ok) return Alert.error(consultationTypesRsp.message);
    consultationTypes = consultationTypesRsp.data;

    if (!clientsRsp.ok) return Alert.error(clientsRsp.message);
    clients = clientsRsp.data;

    if (clients.length === 1) {
      const campusRsp = await Api.get(`/dropdown-options/users/${authUser.data.id}/assignments/campus`, {
        client_id: clients[0].id,
        limit: 1000,
      });
      if (!campusRsp.ok) return Alert.error(campusRsp.message);

      campus = campusRsp.data;
    }

    setDropdowns({
      consultationTypes,
      campus,
      clients,
    });
  };

  const loadDropdownCampus = async () => {
    if (!fil.query.client_id) return;

    const campusRsp = await Api.get(`/dropdown-options/users/${authUser.data.id}/assignments/campus`, {
      client_id: fil.query.client_id,
      limit: 1000,
    });
    if (!campusRsp.ok) return Alert.error(campusRsp.message);

    setDropdowns(prevState => ({
      ...prevState,
      campus: campusRsp.data,
    }));
  };

  if (!authUser.data)
    return (
      <WError
        error="No se pudo reconocer al usuario autenticado, vuelva a iniciar sesión"
        onRetry={() => window.location.reload()}
      />
    );

  if (!data) {
    return (
      <PageWrapper>
        <div className="">
          <Skeleton
            component="div"
            animation="wave"
            variant="rect"
            className="rounded-20 mb-20"
            height={34}
          />
          <Skeleton
            component="div"
            animation="wave"
            className="rounded-8 mb-20"
            variant="rect"
            height={300}
          />
          <div className="flex justify-end">
            <Skeleton
              component="div"
              animation="wave"
              variant="rect"
              width={300}
              height={30}
            />
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="">
        <FSelectAjax
          className={classes.searcher}
          classNamePrefix="searcher"
          value={fil.selected.patient}
          placeholder={'Buscar el nombre del paciente'}
          endpoint="/dropdown-options/patients"
          onLoadItems={items =>
            items.map(item => ({
              id: item.id,
              name: `${item.name} ${item.surname_first} ${item.surname_second}`,
            }))
          }
          onChange={o => {
            setFil(prevFil => ({
              selected: {
                ...prevFil.selected,
                patient: o || null,
                query: o ? o.name : '',
              },
              query: {
                ...prevFil.query,
                patient_id: o ? o.id : 0,
              },
            }));
          }}
        />

        {!data.data.length && fil.selected.patient && !loading ? (
          <NotResults
            queryText={fil.selected.query}
            onClean={() => setFil(DEFAULT_FIL)}
          />
        ) : (
          <>
            <Paper
              elevation={0}
              className="p-16 mt-20 rounded-8 mb-12"
            >
              <div className="flex flex-wrap gap-16 mb-20">
                {dropdowns.clients.length > 1 && (
                  <Select
                    isClearable
                    placeholder="Todos los centros de estudio"
                    options={dropdowns.clients}
                    value={fil.selected.client}
                    onChange={o => {
                      setDropdowns(prevState => ({
                        ...prevState,
                        campus: [],
                      }));
                      setFil(prevFil => ({
                        selected: {
                          ...prevFil.selected,
                          client: o,
                          campus: null,
                        },
                        query: {
                          ...prevFil.query,
                          client_id: o ? o.id : 0,
                          campus_id: 0,
                        },
                      }));
                    }}
                  />
                )}

                {!(dropdowns.clients.length <= 1 && dropdowns.campus.length <= 1) && (
                  <Select
                    isClearable
                    placeholder="Todas las sedes"
                    options={dropdowns.campus}
                    width="250px"
                    value={fil.selected.campus}
                    onChange={o => {
                      setFil(prevFil => ({
                        selected: {
                          ...prevFil.selected,
                          campus: o,
                        },
                        query: {
                          ...prevFil.query,
                          campus_id: o ? o.id : 0,
                        },
                      }));
                    }}
                  />
                )}

                <Select
                  isClearable
                  placeholder="Todas las consultas"
                  options={dropdowns.consultationTypes}
                  width="250px"
                  value={fil.selected.consultation_type}
                  onChange={o => {
                    setFil(prevFil => ({
                      selected: {
                        ...prevFil.selected,
                        consultation_type: o || null,
                      },
                      query: {
                        ...prevFil.query,
                        consultation_type_id: o ? o.id : 0,
                      },
                    }));
                  }}
                />
                <Select
                  isClearable
                  placeholder="Descanso Médico"
                  options={[
                    { id: true, name: 'SI' },
                    { id: false, name: 'NO' },
                  ]}
                  width="200px"
                  value={fil.selected.medical_rest}
                  onChange={o => {
                    setFil(prevFil => ({
                      selected: {
                        ...prevFil.selected,
                        medical_rest: o || null,
                      },
                      query: {
                        ...prevFil.query,
                        medical_rest: o ? o.id : undefined,
                      },
                    }));
                  }}
                />
                <div>
                  <Ranger
                    dateFrom={fil.selected.date_from}
                    dateTo={fil.selected.date_to}
                    onChange={(date_from, date_to) => {
                      if (!date_from || !date_to) {
                        date_from = null;
                        date_to = null;
                      }

                      setFil(prevFil => ({
                        selected: {
                          ...prevFil.selected,
                          date_from: date_from,
                          date_to: date_to,
                        },
                        query: {
                          ...prevFil.query,
                          date_from: date_from ? moment(date_from).format('YYYY-MM-DD') : null,
                          date_to: date_to ? moment(date_to).format('YYYY-MM-DD') : null,
                        },
                      }));
                    }}
                  />
                </div>
              </div>

              <Table
                size="small"
                style={{
                  borderCollapse: 'separate',
                  borderSpacing: '10px',
                }}
              >
                <TableHead>
                  <TableRow className="pb-20">
                    <TableCell className="border-b-0">
                      <span className="text-14 text-grey-600 font-normal">Paciente</span>
                    </TableCell>
                    <TableCell className="border-b-0">
                      <span className="text-14 text-grey-600 font-normal">Personal a cargo </span>
                    </TableCell>
                    <TableCell className="border-b-0">
                      <span className="text-14 text-grey-600 font-normal">Información de consulta </span>
                    </TableCell>
                    <TableCell className="border-b-0">
                      <span className="text-14 text-grey-600 font-normal">Descanso médico </span>
                    </TableCell>
                    <TableCell className="border-b-0">
                      <span className="text-14 text-grey-600 font-normal">Tipo de atención </span>
                    </TableCell>
                    {authUser.isHealthTeam() && <TableCell className="border-b-0" />}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.data.map((consultation, index) => {
                    let medicalRestCount;

                    if (consultation.medical_diagnosis?.issued_medical_rest) {
                      const medicalRestStart = moment(consultation.medical_diagnosis.medical_rest_start);
                      const medicalRestEnd = moment(consultation.medical_diagnosis.medical_rest_end);
                      medicalRestCount = medicalRestEnd.diff(medicalRestStart, 'days');
                    }

                    return (
                      <TableRow
                        key={index}
                        style={{
                          boxShadow: '0 0 4px rgba(0,0,0,0.15)',
                          borderRadius: 8,
                        }}
                      >
                        <TableCell className="border-b-0">
                          <div>
                            <div className="font-medium">
                              {consultation.patient.name} {consultation.patient.surname_first}{' '}
                              {consultation.patient.surname_second}
                            </div>
                            <div>{consultation.patient.patient_profile.name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="border-b-0">
                          <div>
                            <div>{consultation.user.name}</div>
                            <div>
                              {consultation.user.surname_first} {consultation.user.surname_second}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="border-b-0">
                          <div>
                            <div className="flex items-center gap-4">
                              <QueryBuilderIcon
                                className="text-muisecondary"
                                style={{ fontSize: 20 }}
                              />{' '}
                              <span>{moment(consultation.attendance_time, 'HH:mm:ss').format('hh:mm A')}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <CalendarTodayIcon
                                className="text-muisecondary"
                                style={{ fontSize: 18, marginLeft: 1 }}
                              />{' '}
                              <span>
                                {moment(consultation.attendance_date, 'YYYY-MM-DD').format('dddd, D [de] MMMM YYYY')}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="border-b-0">
                          <div>
                            {consultation.medical_diagnosis?.issued_medical_rest ? (
                              <>
                                <div className="font-medium">{medicalRestCount} dias</div>
                                <div>
                                  {moment(consultation.medical_diagnosis.medical_rest_start, 'YYYY-MM-DD').format(
                                    'dddd, D [de] MMMM YYYY',
                                  )}
                                  <span> - </span>
                                  {moment(consultation.medical_diagnosis.medical_rest_end, 'YYYY-MM-DD').format(
                                    'dddd, D [de] MMMM YYYY',
                                  )}
                                </div>
                              </>
                            ) : (
                              <div className="font-medium">No</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="border-b-0">
                          {consultation.attendance_detail?.consultation_type_id === ConsultationType.EMERGENCY_ID ? (
                            <Chip
                              label="Emergencia"
                              className="bg-muired-light text-muired font-medium"
                            />
                          ) : (
                            <Chip
                              label="Estándar"
                              className="bg-muisecondary-light text-muisecondary font-medium"
                            />
                          )}
                        </TableCell>
                        {(authUser.isHealthTeam() || authUser.isAdmin()) && (
                          <TableCell className="border-b-0">
                            <Button
                              size="small"
                              endIcon={<KeyboardArrowRightIcon />}
                              onClick={() => {
                                history.push(`/medical-consultations/${consultation.id}`);
                              }}
                            >
                              Ver detalle
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>

            <div className="flex justify-end">
              <Paginator
                count={Math.ceil(data.total / data.limit)}
                onChange={(e, v) => {
                  setFil(prevFil => ({
                    ...prevFil,
                    query: {
                      ...prevFil.query,
                      page: v - 1,
                    },
                  }));
                }}
              />
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export default MedicalConsultationsHistory;
