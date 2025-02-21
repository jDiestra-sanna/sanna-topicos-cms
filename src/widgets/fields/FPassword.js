import React from 'react';

import PropTypes from 'prop-types';
import TextField from "@material-ui/core/TextField";

function W(props) {
    return (
        <TextField
            label={props.label}
            name={props.name}
            value={props.value}
            onChange={props.onChange}
            required={props.required}
            disabled={props.disabled}
            fullWidth
            type="password"
            margin="dense"
            className="m-0"
            variant="outlined"
            inputProps={{
                autoComplete: 'new-password',
                form        : {
                    autoComplete: 'off',
                },
            }}
            error={props.error && props.error !== ''}
            helperText={props.error}/>
    );
}

W.propTypes = {
    label   : PropTypes.string.isRequired,
    name    : PropTypes.string,
    value   : PropTypes.string,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    error   : PropTypes.string,
};

W.defaultProps = {};

export default W;