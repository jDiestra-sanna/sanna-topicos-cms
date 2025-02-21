import { Icon, Typography } from '@material-ui/core';
import Button from 'widgets/sanna/Button';
import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';

const NotResults = props => {
  return (
    <div
      className="text-center"
      style={{ paddingTop: '100px' }}
    >
      <div className="text-muisecondary mb-24">
        <Icon style={{ fontSize: 32 }}>help_outline</Icon>
      </div>
      <Typography
        variant="h6"
        className={clsx('font-semibold', !props.queryText && 'mb-20')}
      >
        {props.queryText ? (
          <>
            No hemos encontrado <br /> resultados para:
          </>
        ) : (
          <>
            No hemos encontrado <br /> resultados
          </>
        )}
      </Typography>
      {props.queryText && <Typography className="mb-20">{props.queryText}</Typography>}

      {props.seeCleanButton && (
        <Button
          onClick={props.onClean}
          style={{ paddingLeft: 60, paddingRight: 60 }}
        >
          Limpiar búsqueda
        </Button>
      )}
    </div>
  );
};

NotResults.propTypes = {
  onClean: PropTypes.func.isRequired,
  queryText: PropTypes.string.isRequired,
  seeCleanButton: PropTypes.bool,
};

NotResults.defaultProps = {
  queryText: '',
  seeCleanButton: true,
};

export default NotResults;
