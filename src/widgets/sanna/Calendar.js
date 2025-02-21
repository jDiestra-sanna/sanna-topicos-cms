import React, { useState } from 'react';
import { es } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import PropTypes from 'prop-types';
import './Calendar.css';
import { format } from 'date-fns';
import { Typography } from '@material-ui/core';

const formatCaption = (month, options, title) => {
  return (
    <>
      <Typography
        variant="h6"
        className="mr-16 flex text-16 justify-between flex-1"
      >
        <div>{title}</div>
        <div>
          {format(month, 'LLLL', { locale: options?.locale })} {format(month, 'yyyy', { locale: options?.locale })}
        </div>
      </Typography>
    </>
  );
};

function Calendar(props) {
  return (
    <DayPicker
      mode="multiple"
      formatters={{ formatCaption: (month, options) => formatCaption(month, options, props.title) }}
      locale={es}
      {...props}
    />
  );
}

Calendar.propTypes = {
  title: PropTypes.string,
};

Calendar.defaultProps = {
  title: 'Fechas Asignadas',
};

export default Calendar;
