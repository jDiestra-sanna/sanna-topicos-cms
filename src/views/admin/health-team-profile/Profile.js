import { makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';
import { Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import * as Actions from 'app/store/actions/sanna/attendance-record.actions';
import Api from 'inc/Apiv2';
import ArrowBackButton from 'widgets/sanna/ArrowBackButton';
import Calendar from 'widgets/sanna/Calendar';
import CardContainer from 'widgets/sanna/CardContainer';
import ContainerModuleTwoColumns from 'widgets/sanna/ContainerModuleTwoColumns';
import DocumentTypes from 'widgets/sanna/DocumentTypes';
import FileDisplaySets from 'widgets/sanna/FileDisplaySets';
import history from '@history';
import moment from 'moment';
import PageWrapper from 'app/fuse-layouts/layout1/components/PageWrapper';
import PerfilCard from 'widgets/sanna/PerfilCard';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import ScheduledDays from 'widgets/sanna/ScheduledDays';
import ScheduledHours from 'widgets/sanna/ScheduledHours';
import WError from 'widgets/WError';
import ChipCampusCondition, { campusConditions } from 'widgets/sanna/ChipCampusOperating';
import useAuthUser from 'hooks/auth-user';
import { encodeId } from 'inc/Utils';

const useStyles = makeStyles({
  scheduledDays: {
    height: '150px',
    overflowY: 'auto',
  },
});

const documentTypes = [
  {
    id: 2,
    name: 'CV Resumen',
    iconClassName: 'text-blue',
  },
  {
    id: 3,
    name: 'Habilitaciones',
    iconClassName: 'text-red',
  },
  {
    id: 4,
    name: 'Capacitaciones',
    iconClassName: 'text-blue-400',
  },
  {
    id: 1,
    name: 'Otros Documentos',
    iconClassName: 'text-purple',
  },
];

function Profile(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const authUser = useAuthUser();
  const [selectedDay, setSelectedDay] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [user, setUser] = useState(null);
  const [userFiles, setUserFiles] = useState([]);
  const [campus, setCampus] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isAttending, setIsAttending] = useState(false);
  const [medicalCalendar, setMedicalCalendar] = useState({
    id: 0,
    user_id: props.userId,
    campus_id: props.campusId,
    month: props.month,
    year: props.year,
    see_email: 0,
    see_phone: 0,
    entry_time: null,
    leaving_time: null,
    hours_per_day: 0,
    total_hours: 0,
    days: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getForm();
  }, [medicalCalendar.month, medicalCalendar.year, medicalCalendar.campus_id, medicalCalendar.user_id]);

  useEffect(() => {
    setMedicalCalendar(prevState => ({
      ...prevState,
      user_id: props.userId,
      campus_id: props.campusId,
      month: props.month,
      year: props.year,
    }));
  }, [props.userId, props.campusId, props.month, props.year]);

  async function getForm() {
    setError(null);
    setLoading(true);

    dispatch(Actions.resetState());

    const loadingDateTitle = moment(`${medicalCalendar.year}-${medicalCalendar.month}`, 'YYYY-MM').format(
      'MMMM [del] YYYY',
    );

    const response = await Api.get(
      `${props.rootEndpoint}/form`,
      {
        month: medicalCalendar.month,
        year: medicalCalendar.year,
        user_id: encodeId(medicalCalendar.user_id),
        campus_id: medicalCalendar.campus_id,
      },
      `Cargando datos de ${loadingDateTitle}...`,
    );

    if (!response.ok) {
      setError(response.message);
      return setLoading(false);
    }

    setUser(response.data.user);
    setUserFiles(getDataToFileDisplaySets(response.data.user.files));
    setCampus(response.data.campus);
    setAttendanceRecords(response.data.attendance_record);
    setIsAttending(response.data.is_attending);

    if (response.data.medical_calendar) {
      setMedicalCalendar(response.data.medical_calendar);
    } else {
      setMedicalCalendar(prevState => ({
        ...prevState,
        id: 0,
        see_email: 0,
        see_phone: 0,
        entry_time: null,
        leaving_time: null,
        hours_per_day: 0,
        total_hours: 0,
        days: [],
      }));
    }

    setLoading(false);
  }

  function getDataToFileDisplaySets(userFiles) {
    let data = {};

    userFiles.forEach(userFile => {
      if (data[userFile.file_type_id]) {
        data[userFile.file_type_id].items = [
          ...data[userFile.file_type_id].items,
          {
            name: userFile.file.name,
            onDownload: () => {
              Api.download(`${props.rootEndpoint}/files/${userFile.id}/download`);
            },
            onSee: () => {
              history.push(
                `${props.rootPathEndpointFileViewer}/${userFile.file_id}?description=${userFile.file_type.name}:${userFile.description}`,
              );
            },
          },
        ];
      } else {
        data[userFile.file_type_id] = {
          title: userFile.file_type.name,
          onDownload: () => {
            Api.download(`${props.rootEndpoint}/file-types/${userFile.file_type_id}/files/download`);
          },
          items: [
            {
              name: userFile.file.name,
              onDownload: () => {
                Api.download(`${props.rootEndpoint}/files/${userFile.id}/download`);
              },
              onSee: () => {
                history.push(
                  `${props.rootPathEndpointFileViewer}/${userFile.file_id}?description=${userFile.file_type.name}:${userFile.description}`,
                );
              },
            },
          ],
        };
      }
    });

    return Object.entries(data).map(([key, val]) => val);
  }

  function getScheduledDays() {
    const days = attendanceRecords
      .filter(attendance => attendance.day === selectedDay)
      .map(attendance => {
        const day = moment(attendance.day, 'YYYY-MM-DD').format('DD/MM/YYYY');
        let entryTime = 'pendiente';
        let leavingTime = 'pendiente';
        let totalTime = '#';

        if (attendance.first_entry) {
          entryTime = moment(attendance.first_entry, 'HH:mm').format('hh:mm A');
        }

        if (attendance.last_exit) {
          leavingTime = moment(attendance.last_exit, 'HH:mm').format('hh:mm A');
        }

        if (attendance.first_entry && attendance.last_exit) {
          const dateStart = moment(`1970-01-01T${attendance.first_entry}`);
          const dateEnd = moment(`1970-01-01T${attendance.last_exit}`);
          const diffMs = dateEnd.diff(dateStart);
          const diffHours = diffMs / (1000 * 60 * 60);

          totalTime = Math.ceil(diffHours);
        }

        return {
          totalTime,
          leavingTime,
          entryTime,
          day,
        };
      });

    return days;
  }

  function getScheduledHours() {
    let entryTime = {};
    let leavingTime = {};

    entryTime.title = 'Hora de Entrada';
    leavingTime.title = 'Hora de Salida';

    entryTime.color = 'primary';
    leavingTime.color = 'red';

    let day_id = moment().isoWeekday();

    if (selectedDay) {
      day_id = moment(selectedDay, 'YYYY-MM-DD').isoWeekday();
    }

    entryTime.text = campus.campus_schedule.find(schedule => schedule.day_id === day_id)?.opening_time;
    leavingTime.text = campus.campus_schedule.find(schedule => schedule.day_id === day_id)?.closing_time;

    entryTime.text = entryTime.text ? moment(entryTime.text, 'HH:mm:ss').format('hh:mm A') : '- : -';
    leavingTime.text = leavingTime.text ? moment(leavingTime.text, 'HH:mm:ss').format('hh:mm A') : '- : -';

    return [entryTime, leavingTime];
  }

  function getCalendarDays() {
    const days = authUser.isHealthTeam() ? medicalCalendar.days : attendanceRecords;
    const uniqueDates = [...new Set(days.map(day => day.day))];
    const formattedDates = uniqueDates.map(date => moment(date, 'YYYY-MM-DD').toDate());
    return formattedDates;
  }

  if (loading) {
    return (
      <PageWrapper>
        <Skeleton
          variant="rect"
          height={40}
          width={400}
          className="mb-20"
        />
        <Skeleton
          variant="rect"
          height={440}
          className="mb-24 rounded-8"
        />
        <div className="flex gap-24">
          <Skeleton
            variant="rect"
            height={180}
            width={280}
            className="rounded-8"
          />
          <Skeleton
            variant="rect"
            height={180}
            className="flex-1 rounded-8"
          />
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <WError
        error={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <PageWrapper>
      {props.goBack && (
        <div className="relative">
          <ArrowBackButton
            onClick={props.goBack}
            style={{ position: 'absolute', left: '-70px', top: '8px' }}
          />
        </div>
      )}
      <div className="flex items-center mb-24">
        <Typography
          variant="h6"
          className="mr-16"
        >
          {campus.client.name} - {campus.name}
        </Typography>
        {authUser.isHealthTeam() ? (
          <ChipCampusCondition
            state={
              isAttending
                ? {
                    id: 2,
                    name: 'Sede Operativa',
                  }
                : {
                    id: 1,
                    name: 'Sede Programada',
                  }
            }
          />
        ) : (
          <ChipCampusCondition state={campus.campus_condition} />
        )}
      </div>

      <div className="mb-24">
        <CardContainer>
          <ContainerModuleTwoColumns
            leftContent={
              <>
                <div className="mb-16">
                  <PerfilCard
                    status={isAttending ? 'attending' : 'scheduled'}
                    phone={user?.phone}
                    name={user ? `${user.name} ${user.surname_first} ${user.surname_second}` : ''}
                    email={user?.email}
                    role={user?.proffesion?.name}
                  />
                </div>

                <ScheduledDays
                  title="Accesos"
                  readyOnly
                  items={getScheduledDays()}
                  itemsContainerClassName={classes.scheduledDays}
                />
              </>
            }
            rightContent={
              <Calendar
                title="Fechas Trabajadas"
                onDayClick={value => {
                  setSelectedDay(moment(value).format('YYYY-MM-DD'));
                }}
                selected={getCalendarDays()}
                month={new Date(medicalCalendar.year, medicalCalendar.month - 1)}
                onMonthChange={value => {
                  const date = new Date(value);
                  const year = date.getFullYear();
                  const month = date.getMonth() + 1;
                  setMedicalCalendar(prevState => ({
                    ...prevState,
                    month,
                    year,
                  }));
                }}
              />
            }
          />
        </CardContainer>
      </div>

      <div className="flex gap-32">
        <CardContainer>
          <ScheduledHours
            title="Horario de atención del tópico"
            items={getScheduledHours()}
          />
        </CardContainer>

        <div className="flex-1">
          <CardContainer>
            <DocumentTypes
              items={documentTypes}
              onClick={() => setIsOpenModal(true)}
            />
          </CardContainer>
        </div>

        <FileDisplaySets
          open={isOpenModal}
          onCancel={() => setIsOpenModal(false)}
          onDownload={() => {
            Api.download(`${props.rootEndpoint}/files/download`);
          }}
          fileList={userFiles}
        />
      </div>
    </PageWrapper>
  );
}

Profile.propTypes = {
  userId: PropTypes.number.isRequired,
  campusId: PropTypes.number.isRequired,
  month: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
  year: PropTypes.number,
  rootEndpoint: PropTypes.string,
  goBack: PropTypes.func,
  rootPathEndpointFileViewer: PropTypes.string,
};

Profile.defaultProps = {
  rootEndpoint: '/health-team-profiles',
  month: moment().month() + 1,
  year: moment().year(),
  rootPathEndpointFileViewer: '/file-viewer',
};

export default Profile;
