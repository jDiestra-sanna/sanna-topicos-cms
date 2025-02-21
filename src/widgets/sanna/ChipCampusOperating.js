import { Chip } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

export const campusConditions = Object.freeze({
  programmed: {
    id: 1,
    name: 'Programado',
  },
  operative: {
    id: 2,
    name: 'Operativo',
  },
  not_operative: {
    id: 3,
    name: 'No operativo',
  },
  turn_shift: {
    id: 4,
    name: 'Cambio de turno',
  },
  others: {
    id: 5,
    name: 'Otros',
  },
})

const ChipCampusCondition = props => {
  const { state } = props;

  return (
    <Chip
      className={clsx(
        'border border-solid text-12',
        state.id === campusConditions.operative.id
          ? 'border-muiprimary bg-muiprimary-light text-muiprimary'
          : state.id === campusConditions.not_operative.id
          ? 'border-muired bg-muired-light text-muired'
          : 'border-muisecondary bg-muisecondary-light text-muisecondary',
      )}
      size="small"
      label={state.name}
    />
  );
};

ChipCampusCondition.propTypes = {
  state: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
};

export default ChipCampusCondition;
