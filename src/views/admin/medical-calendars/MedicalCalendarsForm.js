import { Breadcrumbs, Button, Icon, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Alert from 'inc/Alert';
import Api from 'inc/Apiv2';
import ArrowBackButton from 'widgets/sanna/ArrowBackButton';
import Calendar from 'widgets/sanna/Calendar';
import CardContainer from 'widgets/sanna/CardContainer';
import ContainerModuleTwoColumns from 'widgets/sanna/ContainerModuleTwoColumns';
import history from '@history';
import moment from 'moment';
import PageWrapper from 'app/fuse-layouts/layout1/components/PageWrapper';
import PerfilCard from 'widgets/sanna/PerfilCard';
import React, { useEffect, useState } from 'react';
import ScheduledDays from 'widgets/sanna/ScheduledDays';
import Toast from 'inc/Toast';
import WError from 'widgets/WError';
import { Skeleton } from '@material-ui/lab';
import SButton from 'widgets/sanna/Button';
import AddProgrammingM from './AddProgrammingM';
import { v4 as uuid, validate as uuidValidate } from 'uuid';

const useStyles = makeStyles(theme => ({
  scheduledDays: {
    height: '150px',
    overflowY: 'auto',
  },
}));

export default function MedicalCalendarsForm(props) {
  const classes = useStyles();
  const [days, setDays] = useState([]);
  const [busyDays, setBusyDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [campus, setCampus] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [medicalCalendar, setMedicalCalendar] = useState({
    id: 0,
    user_id: props.match?.params?.userId || 0,
    campus_id: props.match?.params?.campusId || 0,
    month: moment().month() + 1,
    year: moment().year(),
    see_email: 0,
    see_phone: 0,
    days: [],
  });

  useEffect(() => {
    getForm();
  }, [medicalCalendar.month, medicalCalendar.year]);

  // useEffect(() => {
  //   calcHoursPerDay();
  // }, [medicalCalendar.entry_time, medicalCalendar.leaving_time]);

  // useEffect(() => {
  //   calcTotalHours();
  // }, [medicalCalendar.hours_per_day, days.length]);

  const getLoadingLabel = () => {
    const loadingDateTitle = moment(`${medicalCalendar.year}-${medicalCalendar.month}`, 'YYYY-MM').format(
      'MMMM [del] YYYY',
    );

    return `Cargando datos de ${loadingDateTitle}...`;
  }

  async function getForm() {
    setLoading(true);

    const response = await Api.get(
      '/medical-calendars/form',
      {
        user_id: medicalCalendar.user_id,
        campus_id: medicalCalendar.campus_id,
        month: medicalCalendar.month,
        year: medicalCalendar.year,
      },
      getLoadingLabel(),
    );

    if (!response.ok) {
      setLoading(false);
      return setError(response.message);
    }

    if (!response.data.user) {
      setLoading(false);
      return setError('Usuario no identificado');
    }

    if (!response.data.campus) {
      setLoading(false);
      return setError('Sede no identificada');
    }

    setUser(response.data.user);
    setCampus(response.data.campus);
    setBusyDays(response.data.busy_days.map(day => moment(day, 'YYYY-MM-DD').toDate()));

    if (response.data.medical_calendar) {
      response.data.medical_calendar.days = response.data.medical_calendar.days.map(day => ({
        ...day,
        entry_time: moment(day.entry_time, 'HH:mm:ss').format('HH:mm'),
        leaving_time: moment(day.leaving_time, 'HH:mm:ss').format('HH:mm'),
      }));

      delete response.data.medical_calendar.total_hours;
      delete response.data.medical_calendar.date_created;
      delete response.data.medical_calendar.date_updated;

      setMedicalCalendar(response.data.medical_calendar);
    } else {
      setMedicalCalendar(prevState => ({
        ...prevState,
        id: 0,
        see_email: 0,
        see_phone: 0,
        days: [],
      }));
    }

    setLoading(false);
  }

  async function handleClickSave() {
    if (medicalCalendar.id > 0) {
      handleUpdate();
    } else {
      handleCreate();
    }
  }

  async function handleUpdate() {
    const { see_email, see_phone } = medicalCalendar;
    const days = medicalCalendar.days.map(day => ({ 
      day: day.day, 
      entry_time: day.entry_time, 
      leaving_time: day.leaving_time
    }));

    const data = { see_email, see_phone, days };

    const response = await Api.patch(`/medical-calendars/${medicalCalendar.id}`, data);
    if (!response.ok) return Alert.error(response.message);

    Toast.success(response.message);
  }

  async function handleCreate() {
    let data = {...medicalCalendar};
    delete data.id;

    data.days = data.days.map(day => ({ 
      day: day.day, 
      entry_time: day.entry_time, 
      leaving_time: day.leaving_time
    }));

    const response = await Api.post('/medical-calendars', data);
    if (!response.ok) return Alert.error(response.message);

    setMedicalCalendar(prevState => ({ ...prevState, id: response.data }));

    Toast.success(response.message);
  }

  function getScheduledDays() {
    const sortedDays = medicalCalendar.days.sort((a, b) => {
      const dateTimeA = `${a.day} ${a.entry_time}`;
      const dateTimeB = `${b.day} ${b.entry_time}`;
      return dateTimeA.localeCompare(dateTimeB);
    });;

    const data = sortedDays.map(sortedDay => {
      const day = moment(sortedDay.day, 'YYYY-MM-DD').format('DD/MM/YYYY');
      const entryTime = moment(sortedDay.entry_time, 'HH:mm').format('hh:mm A');
      const leavingTime = moment(sortedDay.leaving_time, 'HH:mm').format('hh:mm A');

      const dateStart = moment(`1970-01-01T${sortedDay.entry_time}:00`);
      const dateEnd = moment(`1970-01-01T${sortedDay.leaving_time}:00`);
      const diffMs = dateEnd.diff(dateStart);
      const diffHours = diffMs / (1000 * 60 * 60);

      return {
        id: sortedDay.id,
        totalTime: Math.ceil(diffHours),
        leavingTime,
        entryTime,
        day
      };
    });

    return data;
  }

  function calcHoursPerDay() {
    if (medicalCalendar.entry_time && medicalCalendar.leaving_time) {
      const entry_time = moment(medicalCalendar.entry_time, 'HH:mm');
      const leaving_time = moment(medicalCalendar.leaving_time, 'HH:mm');
      const diffMinutes = leaving_time.diff(entry_time, 'minutes');
      const diffHours = Math.round(diffMinutes / 60);

      setMedicalCalendar(prevState => ({ ...prevState, hours_per_day: diffHours }));
    } else {
      setMedicalCalendar(prevState => ({ ...prevState, hours_per_day: 0 }));
    }
  }

  function calcTotalHours() {
    if (medicalCalendar.hours_per_day && days) {
      const total_hours = medicalCalendar.hours_per_day * days.length;
      setMedicalCalendar(prevState => ({ ...prevState, total_hours }));
    } else {
      setMedicalCalendar(prevState => ({ ...prevState, total_hours: 0 }));
    }
  }

  function getCalendarDays() {
    const uniqueDates = [...new Set(medicalCalendar.days.map(day => day.day))];
    const formattedDates = uniqueDates.map(date => moment(date, 'YYYY-MM-DD').toDate());
    return formattedDates;
  }

  if (loading) {
    return (
      <PageWrapper>
        <Skeleton
          variant="rect"
          height={20}
          width={300}
          className="mb-12"
        />
        <div className='flex justify-between'>
          <Skeleton
            variant="rect"
            height={40}
            width={300}
            className="mb-20"
          />
          <Skeleton
            variant="rect"
            height={40}
            width={150}
            className="mb-20 rounded-8"
          />
        </div>
        <Skeleton
          variant="rect"
          height={600}
          className="mb-24 rounded-8"
        />
      </PageWrapper>
    );
  }

  if (error)
    return (
      <WError
        error={error}
        onRetry={() => window.location.reload()}
      />
    );

  const calendarMonth = new Date(medicalCalendar.year, medicalCalendar.month - 1);

  return (
    <PageWrapper>
      <div className="relative">
        <ArrowBackButton
          onClick={() => history.push('/medical-calendars')}
          style={{ position: 'absolute', left: '-70px', top: '8px' }}
        />
      </div>
      <div className="mb-8">
        <Breadcrumbs aria-label="breadcrumb">
          {campus?.client?.group && (
            <Link
              color="inherit"
              // href="/"
              // onClick={handleClick}
            >
              {campus?.client?.group?.name}
            </Link>
          )}

          <Link
            color="inherit"
            // href="/getting-started/installation/"
            // onClick={handleClick}
          >
            {campus?.client?.name}
          </Link>
          <Typography color="textPrimary">{campus?.name}</Typography>
        </Breadcrumbs>
      </div>

      <div className="flex items-center mb-24">
        <Typography
          variant="h6"
          className="mr-16"
        >
          {campus?.client?.name} - {campus?.name}
        </Typography>

        <div className="ml-auto">
          <Button
            color="secondary"
            style={{ borderRadius: '20px', paddingLeft: '32px', paddingRight: '32px', marginRight: '10px' }}
            variant="contained"
            className="normal-case"
            endIcon={<Icon>save</Icon>}
            onClick={() =>
              Alert.confirm('¿Estas seguro de guardar los cambios?', () => {
                handleClickSave();
              })
            }
          >
            Guardar
          </Button>

          <Button
            color="primary"
            style={{ borderRadius: '20px', paddingLeft: '32px', paddingRight: '32px' }}
            variant="contained"
            className="normal-case"
            endIcon={<Icon>file_download</Icon>}
            onClick={() => {
              Api.download('/medical-calendars/form/export', {
                user_id: medicalCalendar.user_id,
                campus_id: medicalCalendar.campus_id,
                month: medicalCalendar.month,
                year: medicalCalendar.year,
              });
            }}
          >
            Descargar datos
          </Button>
        </div>
      </div>

      <CardContainer>
        <ContainerModuleTwoColumns
          leftContent={
            <>
              <Calendar
                month={calendarMonth}
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
                selected={getCalendarDays()}
                disabled={busyDays}
                fromDate={moment().toDate()}
              />
            </>
          }
          rightContent={
            <>
              <div className="mb-16">
                <PerfilCard
                  phone={user?.phone}
                  name={user ? `${user.name} ${user.surname_first} ${user.surname_second}` : ''}
                  email={user?.email}
                  role={user?.proffesion?.name}
                  seePhoneCheckBox={{
                    value: medicalCalendar.see_phone,
                    onChange: e => {
                      setMedicalCalendar(prevState => ({ ...prevState, see_phone: e.target.checked ? 1 : 0 }));
                    },
                  }}
                  seeEmailCheckBox={{
                    value: medicalCalendar.see_email,
                    onChange: e => {
                      setMedicalCalendar(prevState => ({ ...prevState, see_email: e.target.checked ? 1 : 0 }));
                    },
                  }}
                />
              </div>

              <div className='mb-16'>
                  <SButton 
                    onClick={() => setModalOpen(true)}
                  >
                    Añadir programación
                  </SButton>
              </div>

              <ScheduledDays
                items={getScheduledDays()}
                onSelectDays={days => console.log(days)}
                onDelete={(selectedIds) => {
                  const restDays = medicalCalendar.days.filter(day => !selectedIds.includes(day.id));
                  setMedicalCalendar(prevState => ({ ...prevState, days: restDays }));
                }}
                itemsContainerClassName={classes.scheduledDays}
              />
            </>
          }
        />
      </CardContainer>
      <AddProgrammingM 
        month={calendarMonth}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSave={data => {
          const newIds = Array.from({ length: data.days.length }, () => uuid());

          const days = data.days.map((date, index) => ({
            id: newIds[index],
            day: date,
            entry_time: data.entry_time,
            leaving_time: data.leaving_time,
          }));

          setModalOpen(false);
          setMedicalCalendar(prevState => ({ ...prevState, days: [...prevState.days, ...days] }));
        }}
      />
    </PageWrapper>
  );
}
