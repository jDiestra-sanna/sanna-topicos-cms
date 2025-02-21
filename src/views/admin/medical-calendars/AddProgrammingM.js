import Modal from 'widgets/sanna/Modal';
import React from 'react';
import Button from 'widgets/sanna/Button';
import ScheduledHours from 'widgets/sanna/ScheduledHours';
import Calendar from 'widgets/sanna/Calendar';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import moment from 'moment';
import Toast from 'inc/Toast';

const defaultState = Object.freeze({
  days: [],
  entry_time: '07:00',
  leaving_time: '23:00', 
});

function AddProgrammingM(props) {
  const [data, setData] = React.useState(defaultState);

  React.useEffect(() => {
    if (props.open) {
      setData(defaultState);
    }
  }, [props.open]);

  const getCalendarDays = () => {
    return data.days.map(date => moment(date).toDate());
  }

  const changeCalendarSelect = (values) => {
    const stringDates = values.map(date => moment(date).format('YYYY-MM-DD'));
    setData(prevState => ({ ...prevState, days: stringDates }));
  };

  const handleSave = () => {
    if (moment(data.leaving_time, 'HH:mm').isBefore(moment(data.entry_time, 'HH:mm'))) {
      return Toast.warning('La hora de salida debe ser mayor a la hora de entrada');
    }

    props.onSave(data);
  }

  const handleDisableSave = () => {
    return !data.days.length || !data.entry_time || !data.leaving_time;
  }

  return (
    <Modal
      open={props.open}
      classNamePaper="w-640 flex flex-col gap-24 items-center"
    >
      <Typography variant='h6'>Añadir programación</Typography>
      
      <div className='w-full p-20 border-2 border-gray-200 rounded-8'>
        <Calendar
          disableNavigation
          month={props.month}
          selected={getCalendarDays()}
          onSelect={changeCalendarSelect}
          fromDate={moment().toDate()}
        />
      </div>
      
      <ScheduledHours
        notTitle
        items={[
          {
            color: 'secondary',
            title: 'Hora de entrada',
            input: {
              value: data.entry_time,
              onChange: value => {
                setData(prevState => ({ ...prevState, entry_time: value }));
              },
            },
          },
          {
            color: 'primary',
            title: 'Hora de salida',
            input: {
              value: data.leaving_time,
              onChange: value => {
                setData(prevState => ({ ...prevState, leaving_time: value }));
              },
            },
          },
        ]}
      />
   
      <div className="w-full flex justify-around">
        <Button
          color="secondary"
          className="w-192"
          onClick={props.onCancel}
        >
          Cancelar
        </Button>
        <Button
          disabled={handleDisableSave()}
          className="w-192"
          onClick={handleSave}
        >
          Guardar
        </Button>
      </div>
    </Modal>
  );
}

AddProgrammingM.propTypes = {
  open: PropTypes.bool.isRequired,
  month: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

AddProgrammingM.defaultProps = {
  open: false,
  onCancel: () => {},
  onSave: () => {},
}

export default AddProgrammingM;
