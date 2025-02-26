import { ATTENDANCE_STATUS } from 'models/medical-calendar';
import { Avatar, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useTheme } from '@material-ui/core/styles';
import Alert from 'inc/Alert';
import Api from 'inc/Apiv2';
import Button from 'widgets/sanna/Button';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import history from '@history';
import moment from 'moment';
import PageWrapper from 'app/fuse-layouts/layout1/components/PageWrapper';
import Paginator from 'widgets/sanna/Paginator';
import React from 'react';
import Select from 'widgets/sanna/Select';
import useAuthUser from 'hooks/auth-user';

const DefaultFil = {
  selected: {
    status: null,
    client: null,
    campus: null,
  },
  query: {
    limit: 10,
    page: 0,
    client_id: 0,
    campus_id: 0,
    status_id: 0,
  },
};

const AssignedTeam = props => {
  const authUser = useAuthUser();
  const theme = useTheme();
  const [data, setData] = React.useState(null);
  const [fil, setFil] = React.useState(DefaultFil);
  const [dropdowns, setDropdowns] = React.useState({
    clients: [],
    campus: [],
  });

  React.useEffect(() => {
    loadData();
  }, [JSON.stringify(fil)]);

  React.useEffect(() => {
    loadDropdownClient();
  }, [JSON.stringify(authUser.data)]);

  React.useEffect(() => {
    loadDropdownCampus();
  }, [fil.query.client_id, dropdowns.clients.length]);

  const loadDropdownClient = async () => {
    const response = await Api.get(`/dropdown-options/assignments/clients`, { limit: 1000 });
    // const response = await Api.get(`/dropdown-options/users/${authUser.data?.id}/assignments/clients`, { limit: 1000 });
    if (!response.ok) return Alert.error(response.message);

    const clients = response.data;

    setDropdowns(prevState => ({
      ...prevState,
      clients,
    }));
  };

  const loadDropdownCampus = async () => {
    const client_id = dropdowns.clients.length === 1 ? dropdowns.clients[0].id : fil.query.client_id;

    if (!client_id) return;

    const response = await Api.get(`/dropdown-options/users/${authUser.data?.id}/assignments/campus`, {
      limit: 1000,
      client_id,
    });
    if (!response.ok) return Alert.error(response.message);

    const campus = response.data;

    setDropdowns(prevState => ({
      ...prevState,
      campus,
    }));
  };

  const loadData = async () => {
    const response = await Api.get('/topic-sanna-teams', fil.query);
    if (!response.ok) return Alert.error(response.message);

    let items = [];

    response.data.forEach(userProgrammed => {
      let data = {
        proffesional: {
          name: '',
          paternalSurname: '',
          maternalSurname: '',
        },
        clientName: '',
        campusId: 0,
        campusName: '',
        scheduledStartDate: '',
        scheduledEndDate: '',
        entryTime: '',
        leavingTime: '',
        colorAttendanceStatus: '',
        healthTeamUserId: 0,
      };

      data.proffesional.name = userProgrammed.users_name;
      data.proffesional.paternalSurname = userProgrammed.users_surname_first;
      data.proffesional.maternalSurname = userProgrammed.users_surname_second;
      data.healthTeamUserId = userProgrammed.users_id;
      data.clientName = userProgrammed.client_name;
      data.campusId = userProgrammed.campus_id;
      data.campusName = userProgrammed.campus_name;
      data.scheduledStartDate = moment(userProgrammed.minDay, 'YYYY-MM-DD').format('DD/MM/YYYY');
      data.scheduledEndDate = moment(userProgrammed.maxDay, 'YYYY-MM-DD').format('DD/MM/YYYY');

      if (userProgrammed.sanna_team_status == ATTENDANCE_STATUS.ATTENDING.id) {
        data.colorAttendanceStatus = theme.palette.primary.main;
        data.entryTime = userProgrammed.attendance_records_entry_time;
        data.leavingTime = userProgrammed.attendance_records_leaving_time;
      } else if (userProgrammed.sanna_team_status == ATTENDANCE_STATUS.PROGRAMMED.id) {
        data.colorAttendanceStatus = theme.palette.secondary.main;
        data.entryTime = userProgrammed.medical_calendars_entry_time;
        data.leavingTime = userProgrammed.medical_calendars_leaving_time;
      } else {
        data.colorAttendanceStatus = theme.palette.red.main;
        data.entryTime = 'No ingresó';
        data.leavingTime = 'No ingresó';
      }

      items.push(data);
    });

    setData({
      ...response,
      data: items,
    });
  };

  if (!data) {
    return (
      <PageWrapper>
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
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
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
            placeholder="Status"
            options={Object.values(ATTENDANCE_STATUS)}
            width="200px"
            value={fil.selected.status}
            onChange={o => {
              setFil(prevFil => ({
                selected: {
                  ...prevFil.selected,
                  status: o || null,
                },
                query: {
                  ...prevFil.query,
                  status_id: o ? o.id : undefined,
                },
              }));
            }}
          />
        </div>

        <Table size="small">
          <TableHead>
            <TableRow className="pb-20">
              <TableCell className="border-0 pb-16">
                <span className="text-14 text-grey-600 font-normal">Profesional</span>
              </TableCell>
              <TableCell
                className="border-0 pb-16"
                align="center"
              >
                <span className="text-14 text-grey-600 font-normal">Tópico Asignado</span>
              </TableCell>
              <TableCell className="border-0 pb-16">
                <span className="text-14 text-grey-600 font-normal">Fechas Programadas</span>
              </TableCell>
              <TableCell className="border-0 pb-16">
                <span className="text-14 text-grey-600 font-normal">Hora de Entrada</span>
              </TableCell>
              <TableCell className="border-0 pb-16">
                <span className="text-14 text-grey-600 font-normal">Hora de Salida</span>
              </TableCell>
              <TableCell className="border-0 pb-16" />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((item, index) => {
              return (
                <React.Fragment key={`row-${index}`}>
                  <TableRow
                    style={{
                      boxShadow: '0 0 4px rgba(0,0,0,0.15)',
                      borderRadius: 8,
                    }}
                  >
                    <TableCell className="border-b-0">
                      <div className="flex gap-8 items-center">
                        <Avatar
                          aria-label="recipe"
                          className="h-40 w-40 mr-8"
                        >
                          {item.proffesional.name.charAt(0).toUpperCase()}
                        </Avatar>

                        <div>
                          <div>
                            <span className="font-medium">{item.proffesional.name}</span>
                          </div>
                          <div>
                            <span className="font-medium">{item.proffesional.paternalSurname}</span>{' '}
                            <span className="font-medium">{item.proffesional.maternalSurname}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="border-b-0">
                      <div className="text-center">
                        <div className="font-medium">{item.clientName}</div>
                        <div>{item.campusName}</div>
                      </div>
                    </TableCell>
                    <TableCell className="border-b-0">
                      <div>
                        {item.scheduledStartDate} - {item.scheduledEndDate}
                      </div>
                    </TableCell>
                    <TableCell className="border-b-0">
                      <div
                        className="font-medium"
                        style={{ color: item.colorAttendanceStatus }}
                      >
                        {item.entryTime}
                      </div>
                    </TableCell>
                    <TableCell className="border-b-0">
                      <div
                        className="font-medium"
                        style={{ color: item.colorAttendanceStatus }}
                      >
                        {item.leavingTime}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        className="nwp"
                        size="small"
                        endIcon={<ChevronRightIcon />}
                        onClick={() => {
                          if (item.healthTeamUserId > 0 && item.campusId > 0) {
                            history.push(
                              `/topic-sanna-teams/health-team-profiles/${item.healthTeamUserId}/${item.campusId}`,
                            );
                          }
                        }}
                      >
                        Ver perfil
                      </Button>
                    </TableCell>
                  </TableRow>

                  {index !== data.data.length - 1 && (
                    <TableRow key={`row-empty-${index}`}>
                      <TableCell
                        colSpan={5}
                        className="border-0"
                      />
                    </TableRow>
                  )}
                </React.Fragment>
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
    </PageWrapper>
  );
};

AssignedTeam.propTypes = {};

export default AssignedTeam;
