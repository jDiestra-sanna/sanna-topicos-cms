import React, {useEffect, useRef, useState} from 'react';

import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import Autosuggest from 'react-autosuggest';
import {makeStyles} from '@material-ui/styles';
import Api from '../../inc/Api';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CPoint from '../../views/admin/choosers/CPoint';
import Typography from '@material-ui/core/Typography';

let timeoutAC;

const useStyles = makeStyles(theme => ({
    root                    : {},
    container               : {
        width: '100%'
    },
    suggestionsContainerOpen: {},
    suggestion              : {
        display: 'block'
    },
    suggestionsList         : {
        margin       : 0,
        padding      : 0,
        listStyleType: 'none'
    },
    divider                 : {
        height: theme.spacing(2)
    }
}));

function W(props) {
    const classes = useStyles();

    const [suggestions, setSuggestions] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [value, setValue] = useState({...props.value});
    const [loading, setLoading] = useState(false);

    const c_point = useRef(null);

    useEffect(() => {
        props.onPoint({
            lat    : value.lat,
            lng    : value.lng,
            address: value.address
        });
    }, [value]);

    function tapMap() {
        c_point.current.choose(value.lat, value.lng, (lat, lng) => {
            setValue({...value, lat, lng});
        });
    }

    return (
        <>
            <Autosuggest
                theme={{
                    container               : classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList         : classes.suggestionsList,
                    suggestion              : classes.suggestion
                }}
                style={{width: '100%'}}
                suggestions={suggestions}
                renderInputComponent={inputProps => (
                    <TextField
                        label={props.label}
                        placeholder={props.placeholder}
                        name="request_radius"
                        variant="outlined"
                        required={props.required}
                        fullWidth
                        margin="dense"
                        className="m-0"
                        InputProps={{
                            ...inputProps,
                            /*startAdornment: (
                                <InputAdornment position="start">
                                    {loading ? (
                                        <CircularProgress size={20}/>
                                    ) : (
                                        <Icon fontSize="small" color="disabled">search</Icon>
                                    )}
                                </InputAdornment>
                            ),*/
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="Ubicar en el mapa">
                                        <IconButton
                                            size="small"
                                            onClick={tapMap}>
                                            {loading ? (
                                                <CircularProgress size={20}/>
                                            ) : (
                                                <Icon fontSize="small">location_on</Icon>
                                            )}
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            )
                        }}
                        error={props.error && props.error !== ''}
                        helperText={props.error}/>
                )}
                inputProps={{
                    value   : value.address,
                    onChange: (event, e) => {
                        if (e.method === 'type') {
                            setValue({
                                ...value,
                                address: e.newValue
                            });
                        }
                    },
                    inputRef: node => setAnchorEl(node)
                }}
                getSuggestionValue={sug => sug.name}
                renderSuggestion={(sug, e) => (
                    <MenuItem selected={e.isHighlighted} dense component="div">
                        <Typography>{sug.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                            <Icon fontSize="inherit" color="inherit">chevron_right</Icon>
                            {sug.address}
                        </Typography>
                    </MenuItem>
                )}
                renderSuggestionsContainer={options => (
                    <Popper anchorEl={anchorEl} open={Boolean(options.children)} style={{zIndex: 1500}}>
                        <Paper
                            {...options.containerProps}
                            square
                            style={{
                                width: anchorEl
                                    ? anchorEl.clientWidth
                                    : undefined
                            }}>
                            {options.children}
                        </Paper>
                    </Popper>
                )}
                onSuggestionsFetchRequested={e => {
                    if (e.reason === 'input-changed') {
                        if (timeoutAC)
                            clearTimeout(timeoutAC);

                        timeoutAC = setTimeout(() => {

                            setLoading(true);
                            Api.get('/../map/autocomplete', {query: e.value}, rsp => {
                                setLoading(false);
                                setSuggestions(rsp.ok ? [...rsp.items] : []);
                            }, false);

                        }, 500);
                    }
                }}
                onSuggestionsClearRequested={() => {
                    setSuggestions([]);
                }}
                onSuggestionSelected={(e, {suggestion}) => {
                    setLoading(true);
                    setValue({
                        ...value,
                        address: `${suggestion.name}, ${suggestion.address}`
                    });
                    Api.get('/../map/place', {id: suggestion.id}, rsp => {
                        setLoading(false);
                        if (rsp.ok) {
                            setValue({
                                address: `${suggestion.name}, ${suggestion.address}`,
                                lat    : rsp.lat,
                                lng    : rsp.lng
                            });
                        }
                    }, false);
                }}
            />
            <CPoint ref={c_point}/>
        </>
    );
}

W.propTypes = {
    value      : PropTypes.exact({
        address: PropTypes.string,
        lat    : PropTypes.number,
        lng    : PropTypes.number
    }).isRequired,
    onPoint    : PropTypes.func.isRequired,
    label      : PropTypes.string,
    placeholder: PropTypes.string,
    required   : PropTypes.bool,
    error      : PropTypes.string,
};

W.defaultProps = {};

export default W;