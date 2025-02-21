import { Popover, makeStyles } from '@material-ui/core';
import Button from 'widgets/sanna/Button';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles(theme => ({
  popover: {
    marginTop: -10,
    overflow: 'visible',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 'calc(100%)',
      left: 'calc(50% - 10px)',
      width: 0,
      height: 0,
      borderLeft: '10px solid transparent',
      borderRight: '10px solid transparent',
      borderTop: '10px solid white',
    },
  },
}));

const MonthlyScheduleEvent = props => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className="w-full ">
      <div
        onClick={handleClick}
        className="bg-muisecondary-light text-muisecondary underline px-8 py-4 cursor-pointer select-none truncate"
      >
        {props.title}
      </div>
      <Popover
        classes={{
          paper: classes.popover,
        }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <div
          className="p-16"
          style={{ width: '326px' }}
        >
          <div className="flex font-stagsans mb-16">
            <div>
              <div className="font-medium text-muisecondary mb-8">{props.title}</div>
              <div className="text-12">
                <span>{props.entryTime}</span>-<span>{props.leavingTime}</span>
              </div>
            </div>
            {/* <div>Programado</div> */}
          </div>
          <div>
            <Button
              fullWidth
              endIcon={<ChevronRightIcon />}
              size="small"
              onClick={props.onSeeDetail}
            >
              Ver detalle
            </Button>
          </div>
        </div>
      </Popover>
    </div>
  );
};

MonthlyScheduleEvent.propTypes = {
  title: PropTypes.string.isRequired,
  entryTime: PropTypes.string.isRequired,
  leavingTime: PropTypes.string.isRequired,
  onSeeDetail: PropTypes.func.isRequired,
};

export default MonthlyScheduleEvent;
