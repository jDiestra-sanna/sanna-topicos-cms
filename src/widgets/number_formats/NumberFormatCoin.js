import NumberFormat from "react-number-format";
import {stg} from "../../inc/Utils";
import React from "react";

export default function (props) {
    const {inputRef, onChange, ...other} = props;
    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            decimalScale={2}
            onValueChange={values => {
                onChange({
                    target: {
                        name : props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            prefix={stg.coin + " "}
        />
    );
}