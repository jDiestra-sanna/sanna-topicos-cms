import React, {useEffect, useState} from 'react';

import PropTypes from 'prop-types';
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Api from '../../inc/Apiv2';
import Divider from "@material-ui/core/Divider";
import {CircularProgress, InputAdornment} from "@material-ui/core";
import Alert from 'inc/Alert';
import clsx from 'clsx';
import { prepareOptions } from './FSelectAjax';

function W(props) {

    const [items, setItems] = useState(null);

    useEffect(() => {
        async function loadData() {
            if (props.notLoad) return setItems([])

            setItems(null)
            const response = await Api.get(props.endpoint, {limit: 100}, false);

            if (response.ok) {
                setItems(response.data);
            } else {
                Alert.error(`Error al cargar datos para: ${props.label}`)
            }
        }

        loadData()
    }, [props.endpoint]);

    return (
        <TextField
            style={props.style}
            label={props.label}
            placeholder={props.placeholder}
            name={props.name}
            value={items == null ? '' : props.value}
            onChange={e => {
                props.onChange(e)
                props.onChangeObject(items == null ? null : items.find(o => o[props.optionValue] === e.target.value))
            }}
            required={props.required}
            disabled={props.disabled || items == null}
            fullWidth
            select
            margin="dense"
            className={clsx("m-0", props.className)}
            variant="outlined"
            error={props.error && props.error !== ''}
            helperText={props.error}

            SelectProps={{
                IconComponent: items == null ? () => null : undefined,
            }}

            InputProps={{
                endAdornment: items == null && !props.notLoad ? (
                    <InputAdornment position="end">
                        <CircularProgress color="inherit" size={18}/>
                    </InputAdornment>
                ) : undefined
            }}>
            {items != null && !props.required && <MenuItem value="" dense>- Ninguno -</MenuItem>}
            {items != null && !props.required && <Divider/>}
            {items != null && prepareOptions(items).map(o => (
                <MenuItem dense key={o.id} value={o[props.optionValue]} disabled={o.isDisabled}>{o[props.optionLabel]}</MenuItem>
            ))}
        </TextField>
    );
}

W.propTypes = {
    label           : PropTypes.string,
    placeholder     : PropTypes.string,
    name            : PropTypes.string,
    value           : PropTypes.string,
    endpoint        : PropTypes.string,
    optionLabel     : PropTypes.string,
    optionValue     : PropTypes.string,
    onChange        : PropTypes.func,
    onChangeObject  : PropTypes.func,
    required        : PropTypes.bool,
    disabled        : PropTypes.bool,
    notLoad         : PropTypes.bool,
    error           : PropTypes.string,
    className       : PropTypes.string,
};

W.defaultProps = {
    optionValue: 'id',
    optionLabel: 'name',
    onChange: () => {},
    onChangeObject: () => {},
};

export default W;