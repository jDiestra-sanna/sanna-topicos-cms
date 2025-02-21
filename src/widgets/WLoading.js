import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';

function W(props) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-8 h-full">
      <CircularProgress />
      {props.label && (
        <Typography
          variant="caption"
          className="text-grey-700"
        >
          {props.label}
        </Typography>
      )}
    </div>
  );
}

W.propTypes = {
  label: PropTypes.node,
};

export default W;
