import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import clsx from 'clsx';
import Fade from '@material-ui/core/Fade';
import MUIModal from '@material-ui/core/Modal';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none!important',
    borderRadius: '16px',
  },
}));

const Modal = props => {
  const classes = useStyles();

  return (
    <MUIModal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={props.open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      style={props.style}
    >
      <Fade in={props.open}>
        <div className={clsx(classes.paper, props.classNamePaper)} style={props.stylePaper}>{props.children}</div>
      </Fade>
    </MUIModal>
  );
};

Modal.propTypes = {
  classNamePaper: PropTypes.string,
  open: PropTypes.bool,
  children: PropTypes.node,
  style: PropTypes.object,
  stylePaper: PropTypes.object,
};

export default Modal;
