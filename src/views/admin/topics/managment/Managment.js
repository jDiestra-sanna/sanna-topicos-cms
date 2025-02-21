import history from '@history';
import { Chip, Icon, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import PageWrapper from 'app/fuse-layouts/layout1/components/PageWrapper';
import clsx from 'clsx';
import Alert from 'inc/Alert';
import Api from 'inc/Apiv2';
import React from 'react';
import ChipCampusCondition, { campusConditions } from 'widgets/sanna/ChipCampusOperating';

const TopicManagment = props => {
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const response = await Api.get('/topic-managments');
    if (!response.ok) return Alert.error(response.message);

    let items = [];

    response.data.forEach(client => {
      let data = {
        expanded: false,
        clientName: '',
        campusCount: 0,
        campusActives: 0,
        assignedPersonnel: 0,
        campuses: [],
      };

      client.campuses.forEach(campus => {
        let dataCampus = {
          id: 0,
          name: '',
          condition: '',
          assignedPersonnel: 0,
          healthTeamUsers: [],
        };

        dataCampus.id = campus.id;
        dataCampus.name = campus.name;
        dataCampus.condition = campus.condition;
        dataCampus.assignedPersonnel = campus.programmed_users.length;
        dataCampus.healthTeamUsers = campus.programmed_users.map(user => ({
          id: user.id,
          fullname: `${user.name} ${user.surname_first} ${user.surname_second}`,
        }));

        data.campuses.push(dataCampus);
      });

      data.clientName = client.name;
      data.campusCount = data.campuses.length;
      data.campusActives = client.campuses.filter(campus => campus.condition.id === campusConditions.operative.id).length;
      data.campuses.forEach(campus => {
        data.assignedPersonnel += campus.assignedPersonnel;
      });

      items.push(data);
    });

    setItems(items);
  };

  return (
    <PageWrapper>
      <Paper
        elevation={0}
        className="p-16 mt-20 rounded-8 mb-12"
      >
        <Table size="small">
          <TableHead>
            <TableRow className="pb-20">
              <TableCell
                className="border-0 pb-16"
                style={{ width: 350 }}
              >
                <span className="text-14 text-grey-600 font-normal">Cliente</span>
              </TableCell>
              <TableCell className="border-0 pb-16">
                <span className="text-14 text-grey-600 font-normal">Sedes</span>
              </TableCell>
              <TableCell
                className="border-0 pb-16"
                style={{ width: 200 }}
              >
                <span className="text-14 text-grey-600 font-normal">Estado de sedes</span>
              </TableCell>
              <TableCell
                className="border-0 pb-16"
                style={{ width: 160 }}
              >
                <span className="text-14 text-grey-600 font-normal">Personal asignado</span>
              </TableCell>
              <TableCell
                className="border-0 pb-16"
                style={{ width: 500 }}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography variant='caption'>No tienes sedes asignadas</Typography>
                </TableCell>
              </TableRow>
            )}
            {items.map((item, index) => {
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
                        <span className="inline-block p-4 bg-muiprimary-light h-32 w-32 flex items-center justify-center rounded-8">
                          <Icon className="text-muiprimary material-icons-outlined"> home</Icon>
                        </span>
                        <span className="font-medium">{item.clientName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="border-b-0">
                      <div className="font-medium">{item.campusCount}</div>
                    </TableCell>
                    <TableCell className="border-b-0">
                      <div className={clsx('font-medium', item.campusActives !== item.campusCount && 'text-muired')}>
                        {item.campusActives} de {item.campusCount} operativos
                      </div>
                    </TableCell>
                    <TableCell className="border-b-0">
                      <div className="font-medium">{item.assignedPersonnel}</div>
                    </TableCell>
                    <TableCell
                      className="border-b-0"
                      align="right"
                    >
                      <IconButton
                        size="small"
                        color="secondary"
                        className={clsx(
                          'rounded-8',
                          item.expanded
                            ? 'bg-muisecondary hover:bg-muisecondary text-white'
                            : 'bg-muisecondary-light hover:bg-muisecondary-light',
                        )}
                        onClick={() => {
                          setItems(prevState =>
                            prevState.map((_item, _index) => {
                              if (_index === index) _item.expanded = !_item.expanded;
                              return _item;
                            }),
                          );
                        }}
                      >
                        {item.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {item.expanded &&
                    item.campuses.map((campus, campusIndex) => (
                      <TableRow
                        key={`row-secondary-${campusIndex}`}
                        className={campusIndex % 2 === 0 ? 'bg-grey-200' : 'bg-grey-50'}
                      >
                        <TableCell className="border-b-0">
                          <div className="flex gap-8 items-center">
                            <RoomOutlinedIcon style={{ color: '#00A0C3' }} />
                            <span>{campus.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="border-b-0" />
                        <TableCell className="border-b-0">
                          <ChipCampusCondition state={campus.condition} />
                        </TableCell>

                        <TableCell className="border-b-0">
                          <div className="font-medium">{campus.assignedPersonnel}</div>
                        </TableCell>

                        <TableCell
                          className="border-b-0"
                          align="right"
                        >
                          <div className="flex gap-8 flex-wrap w-full">
                            {campus.healthTeamUsers.map((user, userIndex) => (
                              <Chip
                                color='primary'
                                key={`chip-${userIndex}`}
                                className="border border-solid text-12 cursor-pointer"
                                size="small"
                                label={user.fullname}
                                onClick={() => {
                                  if (user.id > 0 && campus.id > 0) {
                                    history.push(
                                      `/topic-managments/health-team-profiles/${user.id}/${campus.id}`,
                                    );
                                  }
                                }}
                              />
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}

                  {index !== items.length - 1 && (
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
    </PageWrapper>
  );
};

TopicManagment.propTypes = {};

export default TopicManagment;
