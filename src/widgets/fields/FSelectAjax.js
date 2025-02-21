import React from 'react';
import PropTypes from 'prop-types';
import Api from '../../inc/Apiv2';
import AsyncSelect from 'react-select/async/dist/react-select.esm';
import Typography from "@material-ui/core/Typography";

export const prepareOptions = (options, optionDisabledColumn = 'state', optionDisabledValues = [0, 2]) => {
    return options.map(option => {
        const isDisabled = optionDisabledValues.includes(option[optionDisabledColumn]);
    
        return {
          ...option,
          isDisabled,
        };
    })
};

function W(props) {    
    return (
        <div style={{position: 'relative', zIndex: props.zIndex}}>
            <AsyncSelect
                classNamePrefix={props.classNamePrefix}
                className={props.className}
                isDisabled={props.disabled}
                cacheOptions={props.cacheOptions}
                isClearable
                defaultOptions={props.defaultOptions}
                placeholder={props.placeholder}
                loadOptions={async (query, callback) => {
                    const response = await Api.get(props.endpoint, {...props.fil, query}, false);
                    if (!response.ok) return callback([]);

                    if (typeof props.onLoadItems === 'function') {
                        callback(props.onLoadItems(response.data));
                    } else {
                        callback(prepareOptions(response.data, props.optionDisabledColumn, props.optionDisabledValues));
                    }
                }}
                getOptionValue={option => option[props.optionValue]}
                getOptionLabel={option => typeof props.optionLabel === 'function'
                    ? props.optionLabel(option)
                    : option[props.optionLabel]}
                value={props.value}
                onChange={o => {
                    props.onChange(o);
                }}
                autoFocus={props.autoFocus}
                styles={{
                    placeholder: (defaultStyles) => {
                        return {
                            ...defaultStyles,
                            color: '#AAAAAA',
                        }
                    }
                }}/>
            {props.label && (
                <div style={{
                    position  : 'absolute',
                    top       : -9,
                    left      : 10,
                    background: 'white',
                    padding   : '0px 4px'
                }}>
                    <Typography variant="caption" color="textSecondary">
                        {props.label + (props.required ? ' *' : '')}
                    </Typography>
                </div>
            )}
        </div>
    );
}

W.propTypes = {
    label         : PropTypes.string,
    name          : PropTypes.string,
    value         : PropTypes.object,
    placeholder   : PropTypes.string,
    endpoint      : PropTypes.string,
    optionValue   : PropTypes.string,
    optionLabel   : PropTypes.any,
    onChange      : PropTypes.func.isRequired,
    onLoadItems   : PropTypes.func,
    required      : PropTypes.bool,
    defaultOptions: PropTypes.bool,
    autoFocus     : PropTypes.bool,
    disabled      : PropTypes.bool,
    zIndex        : PropTypes.number,
    fil           : PropTypes.object,
    cacheOptions  : PropTypes.bool,
    className     : PropTypes.string,
    classNamePrefix: PropTypes.string,
    optionDisabledColumn: PropTypes.string,
    optionDisabledValues: PropTypes.array,
};

W.defaultProps = {
    optionValue: 'id',
    optionLabel: 'name',
    placeholder: 'Buscar...',
    zIndex     : 2,
    optionDisabledColumn: 'state',
    optionDisabledValues: [0, 2],
};

export default W;
