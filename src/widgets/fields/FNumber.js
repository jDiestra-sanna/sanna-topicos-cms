import React from 'react';

import PropTypes from 'prop-types';
import TextField from "@material-ui/core/TextField";
import NumberFormat from "../number_formats/NumberFormat";
import {Icon, InputAdornment, Tooltip} from "@material-ui/core";

function W(props) {

    let fieldProps = {...props};

    fieldProps.InputProps = {...fieldProps.InputProps};

    if (props.info) {
        fieldProps.InputProps.endAdornment = (
            <InputAdornment position="end">
                <Tooltip title={props.info}>
                    <Icon className="text-20" color="action">help</Icon>
                </Tooltip>
            </InputAdornment>
        );
    }

    fieldProps.InputProps.inputComponent = NumberFormat;
    fieldProps.InputProps.inputProps = {
        prefix  : props.prefix,
        suffix  : props.suffix,
        decimals: props.decimals,
    };

    return (
        <TextField
            {...props}
            label={props.label}
            name={props.name}
            value={props.value}
            onChange={props.onChange}
            required={props.required}
            disabled={props.disabled}
            fullWidth
            margin="dense"
            className="m-0"
            variant="outlined"
            type={props.type}
            error={props.error && props.error !== ''}
            helperText={props.error}
            {...fieldProps}/>
    );
}

W.propTypes = {
    label   : PropTypes.string,
    name    : PropTypes.string,
    value   : PropTypes.any,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    prefix  : PropTypes.string,
    suffix  : PropTypes.string,
    type    : PropTypes.string,
    error   : PropTypes.string,
    decimals: PropTypes.number,
    info    : PropTypes.string,
};

W.defaultProps = {
    decimals: 0,
};

export default W;
