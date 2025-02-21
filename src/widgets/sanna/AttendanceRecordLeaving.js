import { Box, Typography } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ScheduleIcon from '@material-ui/icons/Schedule';
import clsx from 'clsx';
import Alert from 'inc/Alert';
import Api from 'inc/Apiv2';
import { getUser } from 'inc/Utils';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Button from 'widgets/sanna/Button';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: '#fff',
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

function AttendanceRecordLeaving(props) {
  const classes = useStyles();
  const user = getUser();
  const [leaving, setLeaving] = useState({
    day: '',
    leaving_time: '',
  });

  const saveLeaving = async () => {
    const response = await Api.patch('/attendance-records/leaving-time', leaving);
    if (!response.ok) return Alert.error(response.message);

    props.onSaveSuccess();
  };

  useEffect(() => {
    if (props.open) {
      setLeaving({
        day: moment().format('YYYY-MM-DD'),
        leaving_time: moment().format('HH:mm:ss'),
      });
    }
  }, [props.open]);

  if (!leaving.day || !leaving.leaving_time) return null;

  return (
    <Modal
      className={classes.modal}
      open={props.open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.open}>
        <div className={classes.paper}>
          <Typography
            variant="h6"
            className="mb-16"
          >
            ¿Estás seguro que deseas cerrar sesión?
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
            Estás cerrando tu asistencia a las:
          </Typography>

          <Box className={clsx(classes.date)}>
            <div className="flex items-center">
              <ScheduleIcon className="mr-8" />
              <span>{moment(leaving.leaving_time, 'HH:mm:ss').format('h:mm a')}</span>
            </div>
            <div className="flex items-center">
              <CalendarTodayIcon className="mr-8" />
              <span>{moment(leaving.day, 'YYYY-MM-DD').format('DD/MM/YYYY')}</span>
            </div>
          </Box>

          <div className="flex gap-16">
            <Button
              variant="outlined"
              onClick={props.onCancel}
              className='text-black'
              fullWidth
            >
              Volver atrás
            </Button>

            <Button
              onClick={saveLeaving}
              className='bg-muired hover:bg-muired'
              fullWidth
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}

AttendanceRecordLeaving.propTypes = {
  open: PropTypes.bool,
  onSaveSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};

AttendanceRecordLeaving.defaultProps = {
  open: false,
  onSaveSuccess: () => {},
  onCancel: () => {},
};

export default AttendanceRecordLeaving;
