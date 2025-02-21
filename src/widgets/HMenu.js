import React from 'react';

import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

function W(props) {

    function getItems() {
        return typeof props.items === 'function' ? props.items() : props.items;
    }

    function buttonStyle(item) {
        if (item.color) {
            return {color: item.color}
        } else {
            return {};
        }
    }

    return <>
        <ButtonGroup
            size="small"
            aria-label="small outlined button group"
            disabled={props.disabled}>

            {getItems().map((item, i) => {
                if (item === ':divider') {
                    return ''; // no hay divider en este tipo de menu
                } else {
                    if (!item.title || item.disabled) {
                        return (
                            <Button
                                key={i}
                                disabled={item.disabled}
                                onClick={() => item.onClick()}
                                style={buttonStyle(item)}>
                                <Icon fontSize="small">{item.icon}</Icon>
                            </Button>
                        );
                    } else {
                        return (
                            <Tooltip key={i} title={item.title}>
                                <Button
                                    disabled={item.disabled}
                                    onClick={() => item.onClick()}
                                    style={buttonStyle(item)}>
                                    <Icon fontSize="small">{item.icon}</Icon> {props.titled && item.title}
                                </Button>
                            </Tooltip>
                        );
                    }
                }
            })}

        </ButtonGroup>
    </>;
}

W.propTypes = {
    items   : PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.array
    ]).isRequired,
    disabled: PropTypes.bool,
    titled  : PropTypes.bool,
};

export default W;