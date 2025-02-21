import React, {useState} from 'react';

import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";

function W(props) {
    const [field] = useState(props.field);

    const type = field.type.replace('datetime', 'datetime-local');
    switch (type) {
        case 'photo':
            return (
                <Grid item xs={12} sm={field.cols}>
                    <TextField
                        label={field.label}
                        name={field.name}
                        onChange={e => {
                            props.onChange(e.target.files[0]);
                        }}
                        required={field.required}
                        fullWidth
                        type="file"
                        margin="dense"
                        className="m-0 modal-form-file"
                        variant="outlined"
                        inputProps={{
                            accept: "image/*",
                        }}
                        InputProps={{
                            startAdornment: field.value && (
                                <InputAdornment position="start" style={{whiteSpace: 'nowrap'}}>
                                    {field.value.name || field.value}
                                </InputAdornment>
                            ),
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}/>
                </Grid>
            );
        case 'textarea':
            return (
                <Grid item xs={12} sm={field.cols}>
                    <TextField
                        label={field.label}
                        name={field.name}
                        value={field.value || ''}
                        onChange={e => {
                            props.onChange(e.target.value);
                        }}
                        required={field.required}
                        multiline
                        fullWidth
                        rows={3}
                        margin="dense"
                        className="m-0"
                        variant="outlined"/>
                </Grid>
            );
        case 'checkbox':
            return (
                <Grid item xs={12} sm={field.cols}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name={field.name}
                                required={field.required}
                                checked={field.value == '1'}
                                onChange={e => {
                                    props.onChange(e.target.checked ? '1' : '0');
                                }}/>
                        }
                        label={field.label}/>
                </Grid>
            );
        case 'select':
        case 'select_local':
            return (
                <Grid item xs={12} sm={field.cols}>
                    <TextField
                        label={field.label}
                        name={field.name}
                        value={field.value}
                        onChange={e => {
                            props.onChange(e.target.value);
                        }}
                        required={field.required}
                        fullWidth
                        select
                        margin="dense"
                        className="m-0"
                        variant="outlined">

                        <MenuItem dense value="">- Ninguno -</MenuItem>

                        <Divider/>

                        {field.data.map((opt, i) => (
                            <MenuItem dense key={i} value={opt.id}>
                                {opt.name}
                            </MenuItem>
                        ))}

                    </TextField>
                </Grid>
            );
        default:
            return (
                <Grid item xs={12} sm={field.cols}>
                    <TextField
                        label={field.label}
                        name={field.name}
                        value={field.value || ''}
                        onChange={e => {
                            props.onChange(e.target.value);
                        }}
                        required={field.required}
                        fullWidth
                        type={type}
                        margin="dense"
                        className="m-0"
                        variant="outlined"
                        inputProps={{
                            autoComplete: "new-password",
                            maxLength   : field.maxlength > 0 ? field.maxlength : undefined,
                        }}
                        InputLabelProps={['date', 'datetime', 'color'].includes(field.type) ? {
                            shrink: true,
                        } : {}}/>
                </Grid>
            );
    }
}

W.propTypes = {
    field   : PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default W;