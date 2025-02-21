import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  backButton: {
    padding: '8px',
    backgroundColor: theme.palette.secondary.main,
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
    },
  },
}));

function ArrowBackButton(props) {
  const classes = useStyles();

  return (
    <IconButton
      size="small"
      className={clsx(classes.backButton, props.className)}
      style={props.style}
      onClick={props.onClick}
    >
      <ArrowBackIcon />
    </IconButton>
  );
}

ArrowBackButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
};

export default ArrowBackButton;
