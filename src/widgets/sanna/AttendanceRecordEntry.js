import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import React, { useEffect, useState } from 'react';
import { getUser } from 'inc/Utils';
import { Box, TextField, Typography } from '@material-ui/core';
import ScheduleIcon from '@material-ui/icons/Schedule';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import clsx from 'clsx';
import Button from 'widgets/sanna/Button';
import Api from 'inc/Apiv2';
import Alert from 'inc/Alert';
import moment from 'moment';
import Toast from 'inc/Toast';
import Roles from 'models/roles';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from 'app/store/actions';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '16px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    width: '400px',
    overflow: 'auto',
    outline: 'none!important',
  },
  date: {
    borderRadius: '10px',
    backgroundColor: '#E9EEFF',
    color: theme.palette.secondary.main,
    height: '54px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '40px',
    marginBottom: '24px',
    fontFamily: theme.typography.fontFamily,
    fontWeight: 500,
    '&.is-late': {
      backgroundColor: '#FFE1DA',
      color: 'red',
    },
  },
}));

function AttendanceRecordEntry(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = getUser();
  const [open, setOpen] = useState(true);
  const [isLate, setIsLate] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [item, setItem] = useState({
    day: '',
    entry_time: '',
    entry_observation: '',
  });
  const [isAttendanceRegistered, setIsAttendanceRegistered] = useState(true);

  const save = async () => {
    const response = await Api.post('/attendance-records/entry-time', item);
    if (!response.ok) {
      Alert.error(response.message);
      return false;
    }

    dispatch(Actions.setPartialAttendanceRecord(item));
    // Toast.show('Asistencia registrada correctamente');
    return true;
  };

  const verify = async () => {
    if (user.data?.role_id !== Roles.HEALTH_TEAM_ID) return;

    const response = await Api.get('/attendance-records/verify-entry');
    if (!response.ok) return Alert.error(response.message);

    if (response.data.attendance_record) {
      dispatch(Actions.setAttendanceRecord(response.data.attendance_record));
    }

    setItem(prevState => ({
      ...prevState,
      day: response.data.current_date,
      entry_time: response.data.current_time,
    }));

    setIsLate(response.data.is_late);
    setIsAttendanceRegistered(response.data.is_attendance_registered);
  };

  useEffect(() => {
    verify();
  }, []);

  if (isAttendanceRegistered) return null;

  return (
    <Modal
      className={classes.modal}
      open={open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          {isSubmitted && (
            <Typography
              variant="h6"
              className="text-base font-medium mb-16 text-center"
            >
              Se envió el mensaje con éxito al equipo de SANNA
            </Typography>
          )}

          {!isSubmitted && (
            <>
              <Typography
                variant="h6"
                className="mb-16"
              >
                Registro de asistencia
              </Typography>

              <Typography
                variant="h6"
                className="text-base font-medium"
              >
                {user.data?.name} {user.data?.surname}
              </Typography>

              <Typography
                variant="body1"
                className="mb-24"
              >
                Estás registrando tu asistencia a las:
              </Typography>

              <Box className={clsx(classes.date, isLate && 'is-late')}>
                <div className="flex items-center">
                  <ScheduleIcon className="mr-8" />
                  <span>{moment(item.entry_time, 'HH:mm:ss').format('h:mm a')}</span>
                </div>
                <div className="flex items-center">
                  <CalendarTodayIcon className="mr-8" />
                  <span>{moment(item.day, 'YYYY-MM-DD').format('DD/MM/YYYY')}</span>
                </div>
              </Box>
            </>
          )}

          {isLate && !isSubmitted && (
            <>
              <Typography
                variant="body2"
                className="mb-4"
              >
                Justificación de horario de apertura de sesión
              </Typography>

              <TextField
                placeholder="Escriba el motivo del retraso"
                rows={4}
                multiline
                variant="outlined"
                className="mb-24 w-full"
                onChange={e => {
                  setItem({ ...item, entry_observation: e.target.value });
                }}
              />
            </>
          )}

          {!isLate && (
            <Button
              fullWidth
              onClick={async () => {
                if (await save()) {
                  setOpen(false);
                }
              }}
            >
              Continuar
            </Button>
          )}

          {isLate && !isSubmitted && (
            <Button
              fullWidth
              disabled={!item.entry_observation}
              onClick={async () => {
                if (await save()) {
                  setIsSubmitted(true);
                }
              }}
            >
              Enviar
            </Button>
          )}

          {isLate && isSubmitted && <Button onClick={() => setOpen(false)} fullWidth>Continuar</Button>}
        </div>
      </Fade>
    </Modal>
  );
}

export default AttendanceRecordEntry;
