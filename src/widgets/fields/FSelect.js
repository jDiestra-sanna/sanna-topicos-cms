import React from 'react';

import PropTypes from 'prop-types';
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import {CircularProgress, InputAdornment} from "@material-ui/core";

function W(props) {
    return (
        <TextField
            label={props.label}
            name={props.name}
            value={props.value}
            onChange={val => {
                props.onChange(val);
            }}
            required={props.required}
            disabled={props.disabled || props.items == null}
            fullWidth
            select
            margin="dense"
            className="m-0"
            variant="outlined"
            error={props.error && props.error !== ''}
            helperText={props.error}

            SelectProps={{
                IconComponent: props.items == null ? () => null : undefined,
            }}

            InputProps={{
                endAdornment: props.items == null ? (
                    <InputAdornment position="end">
                        <CircularProgress color="inherit" size={18}/>
                    </InputAdornment>
                ) : undefined
            }}>
            {props.items != null && !props.required && <MenuItem value="" dense>- Ninguno -</MenuItem>}
            {props.items != null && !props.required && <Divider/>}
            {props.items != null && props.items.map((o, i) => (
                <MenuItem
                    key={i}
                    value={o[props.optionValue]}
                    dense>
                    {typeof props.optionLabel === 'function' ? props.optionLabel(o, i) : o[props.optionLabel]}
                </MenuItem>
            ))}
        </TextField>
    );
}

W.propTypes = {
    label      : PropTypes.string,
    name       : PropTypes.string,
    value      : PropTypes.string,
    items      : PropTypes.array,
    optionLabel: PropTypes.any,
    optionValue: PropTypes.string,
    onChange   : PropTypes.func.isRequired,
    required   : PropTypes.bool,
    disabled   : PropTypes.bool,
    error      : PropTypes.string,
};

W.defaultProps = {
    optionValue: 'id',
    optionLabel: 'name',
};

export default W;