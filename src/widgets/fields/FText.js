import React from 'react';

import PropTypes from 'prop-types';
import TextField from "@material-ui/core/TextField";
import {Icon, InputAdornment, Tooltip} from "@material-ui/core";
import clsx from 'clsx';

function W(props) {
    let {className, ...resultProps} = {...props};

    if (props.info) {
        resultProps.InputProps = {
            endAdornment: (
                <InputAdornment position="end">
                    <Tooltip title={props.info}>
                        <Icon className="text-20" color="action">help</Icon>
                    </Tooltip>
                </InputAdornment>
            )
        }
    }

    return (
        <TextField
            label={props.label}
            name={props.name}
            value={props.value}
            onChange={props.onChange}
            required={props.required}
            disabled={props.disabled}
            fullWidth
            margin="dense"
            className={clsx("m-0", className)}
            variant="outlined"
            type={props.type}
            error={props.error && props.error !== ''}
            helperText={props.error}
            {...resultProps}
            InputLabelProps={{
                shrink: (props.shrink === true || props.type === 'date') ? true : undefined,
            }}
            />
    );
}

W.propTypes = {
    label   : PropTypes.string,
    name    : PropTypes.string,
    value   : PropTypes.string,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    type    : PropTypes.string,
    error   : PropTypes.string,
    shrink  : PropTypes.bool,
    info    : PropTypes.string,
};

W.defaultProps = {};

export default W;