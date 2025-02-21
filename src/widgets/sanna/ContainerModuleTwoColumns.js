import React from 'react';
import PropTypes from 'prop-types';

function ContainerModuleTwoColumns(props) {
  return (
    <div className="flex">
      <div className="flex-1 pr-32 border-r-2 border-grey-200">{props.leftContent}</div>
      <div className="flex-1 pl-32">{props.rightContent}</div>
    </div>
  );
}

ContainerModuleTwoColumns.propTypes = {
  rightContent: PropTypes.any,
  leftContent: PropTypes.any,
};

export default ContainerModuleTwoColumns;
