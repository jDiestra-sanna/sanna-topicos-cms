import React from 'react';

import PropTypes from 'prop-types';
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

function W(props) {
    return props.label ? (
        <FormControlLabel
            disabled={props.disabled}
            control={
                <Checkbox
                    name={props.name}
                    checked={props.value === true || props.value == '1'}
                    onChange={e => props.onChange(e)}
                    className={props.dense ? "py-0" : "py-8"}/>
            }
            label={props.label + (props.required ? ' *' : '')}
        />
    ) : (
        <Checkbox
            name={props.name}
            checked={props.value === true || props.value == '1'}
            disabled={props.disabled}
            onChange={e => props.onChange(e)}
            className={props.dense ? "py-0" : "py-8"}/>
    );
}

W.propTypes = {
    label   : PropTypes.string,
    name    : PropTypes.string,
    value   : PropTypes.any,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    error   : PropTypes.string,
    dense   : PropTypes.bool,
};

W.defaultProps = {};

export default W;