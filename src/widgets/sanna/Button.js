import { Button as MUIButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '6px 26px',
    textTransform: 'none',
    borderRadius: '50px',
    fontWeight: '500',
    '&.Mui-disabled': {
      // backgroundColor: theme.palette.primary.main,
      // color: '#fff',
      // opacity: '0.25',
    },
  },
}));

function Button(props) {
  const classes = useStyles(props);

  const { className, ...result } = props;

  return (
    <MUIButton
      className={clsx(classes.root, className)}
      {...result}
    >
      {props.children}
    </MUIButton>
  );
}

Button.propTypes = {
  variant: PropTypes.string,
  color: PropTypes.string,
};

Button.defaultProps = {
  variant: 'contained',
  color: 'primary',
};

export default Button;
