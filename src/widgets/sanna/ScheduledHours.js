import './ScheduledHours.css';
import { Typography } from '@material-ui/core';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import TimePicker from 'react-time-picker';

const useStyles = makeStyles(theme => ({
  textContainer: {
    backgroundColor: props => {
      if (props.color === 'primary') return theme.palette.primary.light;
      if (props.color === 'secondary') return theme.palette.secondary.light;
      if (props.color === 'red') return theme.palette.red.light;
      return '#DCDCDC';
    },
    color: props => {
      if (props.color === 'primary') return theme.palette.primary.main;
      if (props.color === 'secondary') return theme.palette.secondary.main;
      if (props.color === 'red') return theme.palette.red.main;
      return '#000';
    },
    letterSpacing: '1px',
    lineHeight: '32px',
    whiteSpace: 'nowrap',
    borderRadius: '6px',
    padding: '16px',
    fontWeight: 500,
  },
}));

function ScheduledHoursItem(props) {
  const theme = useTheme();
  const classes = useStyles(props);

  return (
    <div>
      <div className="mb-8">{props.title}</div>
      <div className={clsx(classes.textContainer)}>
        {props.input ? (
          <TimePicker
            clearIcon={<CloseIcon />}
            disableClock
            onChange={props.input.onChange}
            value={props.input.value}
            format="hh:mm a"
          />
        ) : (
          props.text
        )}
      </div>
    </div>
  );
}

function ScheduledHours(props) {
  return (
    <div>
      {!props.notTitle && (
        <Typography
          variant="h6"
          className="text-16 mb-16"
        >
          {props.title}
        </Typography>
      )}
      <div className="flex flex-wrap gap-24">
        {props.items.map((item, idx) => (
          <ScheduledHoursItem
            key={idx}
            {...item}
          />
        ))}
      </div>
    </div>
  );
}

ScheduledHours.propTypes = {
  items: PropTypes.array,
  title: PropTypes.string,
  notTitle: PropTypes.bool,
};

ScheduledHours.defaultProps = {
  title: 'Asistencia programada',
}

ScheduledHoursItem.propTypes = {
  color: PropTypes.oneOf(['primary', 'secondary', 'default', 'red']).isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  input: PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }),
};

ScheduledHoursItem.defaultProps = {
  color: 'default',
  text: '',
};

export { ScheduledHoursItem };

export default ScheduledHours;
