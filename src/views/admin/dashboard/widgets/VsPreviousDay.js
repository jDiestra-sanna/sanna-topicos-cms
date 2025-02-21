import { Paper, Typography } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const VsPreviousDay = props => {
  const colorPercentage = props.percentage >= 0 ? 'text-muiprimary' : 'text-muired';

  return (
    <Paper
      className={clsx('p-16 flex-1 rounded-8', props.className)}
      style={props.style}
      elevation={0}
    >
      <Typography
        variant="h6"
        className="font-medium text-16"
      >
        {props.title}
      </Typography>
      <div className="flex items-center">
        <span className="text-28 font-semibold font-stagsans mr-8">{props.value}</span>{' '}
        <span className={clsx('mr-4', colorPercentage)}>
          {props.percentage >= 0 ? '+' : ''}
          {props.percentage}%
        </span>{' '}
        {props.percentage >= 0 ? (
          <ArrowUpwardIcon
            style={{ fontSize: 16 }}
            className={clsx(colorPercentage)}
          />
        ) : (
          <ArrowDownwardIcon
            style={{ fontSize: 16 }}
            className={clsx(colorPercentage)}
          />
        )}
      </div>
      <div className="pt-8 font-stagsans">vs. el día anterior</div>
    </Paper>
  );
};

VsPreviousDay.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  percentage: PropTypes.number.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default VsPreviousDay;
