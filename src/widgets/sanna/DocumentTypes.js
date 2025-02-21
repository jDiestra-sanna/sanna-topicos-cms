import { Button, Typography } from '@material-ui/core';
import React from 'react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Icon from '@material-ui/core/Icon';
import clsx from 'clsx';
import PropTypes from 'prop-types';

function DocumentTypesItem(props) {
  return (
    <div className="cursor-pointer inline-flex items-center border border-grey-300 p-8 rounded-8">
      <Icon className={clsx(props.iconClassName, 'mr-10 material-icons-outlined')}>{props.icon}</Icon>
      <div className="min-w-136">{props.name}</div>
      <ChevronRightIcon color="primary" />
    </div>
  );
}

function DocumentTypes(props) {
  return (
    <div>
      <Typography
        variant="h6"
        className="text-16 mb-16"
      >
        {props.title}
      </Typography>

      <div className="flex flex-wrap gap-24 mb-16">
        {props.items.map((item, index) => (
          <DocumentTypesItem
            key={index}
            {...item}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          color="primary"
          className="text-12"
          onClick={props.onClick}
        >
          Ver todo <ChevronRightIcon color="primary" />
        </Button>
      </div>
    </div>
  );
}

DocumentTypesItem.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  iconClassName: PropTypes.string,
};

DocumentTypesItem.defaultProps = {
  icon: 'folder',
};

DocumentTypes.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array,
  onClick: PropTypes.func,
};

DocumentTypes.defaultProps = {
  title: 'Documentos profesionales',
};

export default DocumentTypes;
export { DocumentTypesItem };
