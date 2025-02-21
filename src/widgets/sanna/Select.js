import { Icon, makeStyles } from '@material-ui/core';
import { prepareOptions } from 'widgets/fields/FSelectAjax';
import PropTypes from 'prop-types';
import React from 'react';
import ReactSelect, { components } from 'react-select';

const Control = ({ children, ...props }) => {
  return (
    <components.Control {...props}>
      <div className="ml-12 flex items-center">
        <Icon
          className="material-icons-outlined text-muisecondary"
          style={{ fontSize: 20 }}
        >
          diamond
        </Icon>
      </div>
      {children}
    </components.Control>
  );
};

const useStyles = makeStyles(theme => ({
  fselect: {
    width: props => props.width,
    display: 'inline-block',
    '& .fselect__control': {
      borderWidth: '1px',
      borderColor: theme.palette.secondary.main,
      borderStyle: 'solid',
      borderRadius: '20px',
      backgroundColor: theme.palette.secondary.light,
    },
    '& .fselect__placeholder': {
      color: theme.palette.secondary.main,
      fontWeight: '500',
    },
    '& .fselect__indicator': {
      color: theme.palette.secondary.main,
    },
  },
}));

const Select = props => {
  const classes = useStyles(props);
  const { options, ...resultProps } = props;
  const optionsPrepared = prepareOptions(props.options, props.optionDisabledColumn, props.optionDisabledValues);

  return (
    <ReactSelect
      className={classes.fselect}
      classNamePrefix="fselect"
      components={{ Control }}
      getOptionValue={option => option[props.optionValue]}
      getOptionLabel={option =>
        typeof props.optionLabel === 'function' ? props.optionLabel(option) : option[props.optionLabel]
      }
      options={optionsPrepared}
      {...resultProps}
    />
  );
};

Select.propTypes = {
  placeholder: PropTypes.string,
  options: PropTypes.array,
  width: PropTypes.string,
  optionValue: PropTypes.string,
  optionLabel: PropTypes.any,
  optionDisabledColumn: PropTypes.string,
  optionDisabledValues: PropTypes.array,
};

Select.defaultProps = {
  width: '300px',
  optionValue: 'id',
  optionLabel: 'name',
  optionDisabledColumn: 'state',
  optionDisabledValues: [0, 2],
};

export default Select;
