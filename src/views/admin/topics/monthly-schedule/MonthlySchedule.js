import './MonthlySchedule.css';
import { Paper } from '@material-ui/core';
import Alert from 'inc/Alert';
import Api from 'inc/Apiv2';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import FullCalendar from '@fullcalendar/react';
import history from '@history';
import moment from 'moment';
import MonthlyScheduleEvent from './MonthlyScheduleEvent';
import PageWrapper from 'app/fuse-layouts/layout1/components/PageWrapper';
import PropTypes from 'prop-types';
import React from 'react';
import Select from 'widgets/sanna/Select';
import useAuthUser from 'hooks/auth-user';

const DefaultFil = {
  selected: {
    client: null,
    campus: null,
  },
  query: {
    client_id: 0,
    campus_id: 0,
    year: moment().year(),
    month: moment().month() + 1,
  },
};

const MonthlySchedule = props => {
  const authUser = useAuthUser();
  const firstLoadRef = React.useRef(true);
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [fil, setFil] = React.useState(DefaultFil);
  const [dropdowns, setDropdowns] = React.useState({
    clients: [],
    campus: [],
  });

  React.useEffect(() => {
    if (fil.query.campus_id) loadData();
  }, [JSON.stringify(fil.query)]);

  React.useEffect(() => {
    disableNavigation();
  }, [loading]);

  React.useEffect(() => {
    firstLoadRef.current = false;
    loadDropdownClient();
  }, [JSON.stringify(authUser.data)]);

  React.useEffect(() => {
    loadDropdownCampus();
  }, [fil.query.client_id]);

  const loadData = async () => {
    setEvents([]);
    setLoading(true);

    const response = await Api.get('/topic-calendars', fil.query);
    if (!response.ok) {
      setLoading(false);
      return Alert.error(response.message);
    }

    let items = [];

    response.data.forEach(medicalCalendar => {
      medicalCalendar.days.forEach(medicalCalendarDay => {
        const title = `${medicalCalendar.user.name} ${medicalCalendar.user.surname_first} ${medicalCalendar.user.surname_second}`;
        const start = moment(medicalCalendarDay.day, 'YYYY-MM-DD').toDate();

        items.push({
          start,
          title,
          _day: medicalCalendarDay,
          _medicalCalendar: medicalCalendar,
        });
      });
    });

    setEvents(items);
    setLoading(false);
  };

  const loadDropdownClient = async () => {
    const response = await Api.get(`/dropdown-options/assignments/clients`, { limit: 1000 });
    // const response = await Api.get(`/dropdown-options/users/${authUser.data?.id}/assignments/clients`, { limit: 1000 });
    if (!response.ok) return Alert.error(response.message);

    const clients = response.data;

    if (clients.length === 1) {
      setFil(prevFil => ({
        ...prevFil,
        query: {
          ...prevFil.query,
          client_id: clients[0].id,
        },
      }));
    }

    setDropdowns(prevState => ({
      ...prevState,
      clients,
    }));
  };

  const loadDropdownCampus = async () => {
    if (!fil.query.client_id) return;

    const response = await Api.get(`/dropdown-options/users/${authUser.data?.id}/assignments/campus`, {
      client_id: fil.query.client_id,
      limit: 1000,
    });
    if (!response.ok) return Alert.error(response.message);

    const campus = response.data;

    if (campus.length === 1) {
      setFil(prevFil => ({
        ...prevFil,
        query: {
          ...prevFil.query,
          campus_id: campus[0].id,
        },
      }));
    }

    setDropdowns(prevState => ({
      ...prevState,
      campus,
    }));
  };

  const handleDatesSet = dateInfo => {
    if (firstLoadRef.current) return;

    const dateSelected = moment(dateInfo.view.currentStart).format('M YYYY');
    const dates = dateSelected.split(' ');

    setFil(prevFil => ({
      ...prevFil,
      query: {
        ...prevFil.query,
        year: dates[1],
        month: dates[0],
      },
    }));
  };

  const disableNavigation = () => {
    const buttons = window.document.querySelectorAll('.fc .fc-button-group button');

    buttons.forEach(button => {
      if (loading) {
        button.style.pointerEvents = 'none';
      } else {
        button.style.pointerEvents = 'auto';
      }
    });
  };

  return (
    <PageWrapper>
      <Paper
        elevation={0}
        className="p-16 mt-20 rounded-8 mb-12"
      >
        <div className="relative z-10 mb-16 flex gap-16">
          {dropdowns.clients.length > 1 && (
            <Select
              isClearable
              placeholder="Seleccione un centro de estudio"
              options={dropdowns.clients}
              value={fil.selected.client}
              onChange={o => {
                setEvents([]);
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
              placeholder="Seleccione una sede"
              options={dropdowns.campus}
              width="250px"
              value={fil.selected.campus}
              onChange={o => {
                if (!o) setEvents([]);
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
        </div>

        <FullCalendar
          locale={esLocale}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventContent={e => (
            <MonthlyScheduleEvent
              title={e.event.title}
              entryTime={moment(e.event.extendedProps._day.entry_time, 'HH:mm:ss').format('hh:mm A')}
              leavingTime={moment(e.event.extendedProps._day.leaving_time, 'HH:mm:ss').format('hh:mm A')}
              onSeeDetail={() => {
                history.push(
                  `/topic-calendars/health-team-profiles/${e.event.extendedProps._medicalCalendar.user_id}/${e.event.extendedProps._medicalCalendar.campus_id}`,
                );
              }}
            />
          )}
          dayHeaderFormat={{
            weekday: 'long',
          }}
          datesSet={handleDatesSet}
        />
      </Paper>
    </PageWrapper>
  );
};

MonthlySchedule.propTypes = {};

export default MonthlySchedule;
