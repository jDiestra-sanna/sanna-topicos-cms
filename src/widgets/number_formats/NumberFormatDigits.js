import NumberFormat from "react-number-format";
import React from "react";

export default function (props) {
    const {inputRef, onChange, ...other} = props;
    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            decimalScale={0}
            onValueChange={values => {
                onChange({
                    target: {
                        name : props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            suffix={" dígitos"}
        />
    );
}