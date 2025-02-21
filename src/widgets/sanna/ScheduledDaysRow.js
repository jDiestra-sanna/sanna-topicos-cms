import React from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

function ScheduledDaysRow(props) {
  const theme = useTheme();
  const [stateChecked, setStateChecked] = React.useState(props.checked);

  React.useEffect(() => {
    setStateChecked(props.checked);
  }, [props.checked]);

  return (
    <div className="flex items-center">
      {!props.readOnly && (
        <div>
          <Checkbox
            style={{ width: 30, height: 30 }}
            checked={stateChecked}
            onChange={() => {
              setStateChecked(!stateChecked);
              props.onCheck(props.item.id);
            }}
          />
        </div>
      )}
      <div className="mr-28">
        <Typography
          variant="h6"
          className="text-12 leading-tight"
        >
          {props.item.day}
        </Typography>
        <Typography
          variant="subtitle1"
          className="text-12 leading-tight"
        >
          {props.item.entryTime} - {props.item.leavingTime}
        </Typography>
      </div>
      <div className="flex-1 border-b-2 border-grey-300 h-2 mr-28"></div>
      <div>
        <Button
          variant="contained"
          className="normal-case pointer-events-none p-0 leading-tight text-12"
          style={{
            backgroundColor: theme.palette.primary.light,
            color: '#000',
          }}
        >
          {props.item.totalTime}
        </Button>
      </div>
    </div>
  );
}

ScheduledDaysRow.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    leavingTime: PropTypes.string.isRequired,
    entryTime: PropTypes.string.isRequired,
    day: PropTypes.string.isRequired,
    totalTime: PropTypes.string.isRequired,
  }).isRequired,
  onCheck: PropTypes.func,
  checked: PropTypes.bool,
  readOnly: PropTypes.bool,
};

ScheduledDaysRow.defaultProps = {
  onCheck: selectedId => {},
  checked: false,
};

export default ScheduledDaysRow;
