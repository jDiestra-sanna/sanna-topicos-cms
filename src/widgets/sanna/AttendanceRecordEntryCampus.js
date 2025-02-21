import Alert from 'inc/Alert';
import Api from 'inc/Apiv2';
import { useEffect, useState } from 'react';
import Button from 'widgets/sanna/Button';
import Modal from './Modal';
import React from 'react';
import Select from 'widgets/fields/FSelect';
import { Typography } from '@material-ui/core';
import Toast from 'inc/Toast';
import moment from 'moment';
import { getUser } from 'inc/Utils';
import Roles from 'models/roles';
import useLocalStorage, { Keys } from 'hooks/useLocalStorage';

function AttendanceRecordEntryCampus(props) {
  const [_, setAttendance] = useLocalStorage(Keys.ATTENDANCE);
  const [isAttendanceRegistered, setIsAttendanceRegistered] = useState(false);
  const [campus, setCampus] = useState([]);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState({
    campus_id: 0,
  });
  
  const authUser = getUser();

  const isLogged = !!authUser.data;

  useEffect(() => {    
    if (isLogged) {
      verify();
      getCampus();
    };
  }, [isLogged]);

  const save = async () => {
    const day = moment().format('YYYY-MM-DD');
    const entry_time = moment().format('HH:mm:ss');

    const data = {
      day,
      entry_time,
      campus_id: item.campus_id,
    };

    const response = await Api.post('/attendance-records/entry-time', data);
    if (!response.ok) Alert.error(response.message);

    Toast.success('Sesión iniciada');
    setAttendance({
      day,
      entry_time,
      campus: campus.find(o => o.id === item.campus_id)
    })
    setOpen(false);
  };

  const verify = async () => {
    if (authUser.data?.role_id !== Roles.HEALTH_TEAM_ID) return;

    const response = await Api.get('/attendance-records/verify-entry');
    if (!response.ok) return Alert.error(response.message);

    setOpen(!response.data.is_attendance_registered);
    setIsAttendanceRegistered(response.data.is_attendance_registered);

    if (response.data.attendance_record) {
      setAttendance({
        day: response.data.attendance_record.day,
        entry_time: response.data.attendance_record.entry_time,
        campus: response.data.attendance_record.campus
      })
    }
  };

  const getCampus = async () => {
    if (authUser.data?.role_id !== Roles.HEALTH_TEAM_ID) return;

    const response = await Api.get('/dropdown-options/scheduled-campuses', { user_id: authUser.data?.id });
    if (!response.ok) return Alert.error(response.message);

    setCampus(response.data);
  };

  if (isAttendanceRegistered || !isLogged) return null;

  return (
    <Modal
      open={open}
      classNamePaper="w-400 flex flex-col items-center gap-16"
    >
      <div>
        <Typography
          variant="h6"
          align="center"
        >
          Sede de Inicio
        </Typography>
        <Typography
          variant="body1"
          align="center"
          className="text-12"
        >
          Elije una sede para iniciar sesión
        </Typography>
      </div>
      <Select
        required
        label="Sede"
        items={campus}
        value={item.campus_id}
        onChange={e => setItem({ ...item, campus_id: e.target.value })}
      />
      <Button
        disabled={item.campus_id === 0}
        className="w-160"
        onClick={save}
      >
        Enviar
      </Button>
    </Modal>
  );
}

export default AttendanceRecordEntryCampus;
