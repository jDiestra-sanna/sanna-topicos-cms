import NumberFormat from "react-number-format";
import React from "react";
import PropTypes from "prop-types";

function W(props) {
    const {inputRef, onChange, decimals, ...other} = props;
    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            decimalScale={decimals}
            onValueChange={values => {
                onChange({
                    target: {
                        name : props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            prefix={props.prefix}
            suffix={props.suffix}
        />
    );
}

W.propTypes = {
    decimals: PropTypes.number,
};

W.defaultProps = {
    decimals: 0,
};

export default W;