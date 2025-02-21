import React from 'react';
import PropTypes from 'prop-types';
import BaseRanger from 'widgets/Ranger';
import { Icon } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const Ranger = (props) => {
  return (
    <BaseRanger
      variant="text"
      endIcon={<ExpandMoreIcon style={{ fontSize: 24 }} />}
      startIcon={<Icon className="material-icons-outlined">diamond</Icon>}
      color="secondary"
      buttonClassName="normal-case font-medium border border-muisecondary border-solid bg-muisecondary-light hover:bg-muisecondary-light rounded-full px-16"
      {...props}
    />
  );
};

Ranger.propTypes = {};

export default Ranger;
