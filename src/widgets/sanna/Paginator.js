import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  pagination: {
    '& ul li:first-child button': {
      '& svg': {
        color: theme.palette.secondary.main,
      },
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      '&::after': {
        content: '"Anterior"',
        color: theme.palette.secondary.main,
        fontWeight: 500,
      },
    },
    '& ul li:last-child button': {
      '& svg': {
        color: theme.palette.secondary.main,
      },
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      '&::before': {
        content: '"Siguiente"',
        color: theme.palette.secondary.main,
        fontWeight: 500,
      },
    },
    '& ul li button.Mui-selected': {
      backgroundColor: theme.palette.secondary.main,
      color: '#fff',
      '&:hover': {
        backgroundColor: theme.palette.secondary.main,
        color: '#fff',
      },
    },
    '& ul li:not(:first-child):not(:last-child) button:not(.Mui-selected)': {
      backgroundColor: '#fff',
      color: '#000',
      '&:hover': {
        backgroundColor: '#fff',
        color: '#000',
      },
    },
  },
}));

const Paginator = props => {
  const classes = useStyles();

  return (
    <Pagination
      className={clsx(classes.pagination, props.className)}
      count={props.count}
      shape={props.shape}
      onChange={props.onChange}
    />
  );
};

Paginator.propTypes = {
  shape: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

Paginator.defaultProps = {
  shape: 'rounded',
};

export default Paginator;
