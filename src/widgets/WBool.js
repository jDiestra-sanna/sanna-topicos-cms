import React from 'react';

import PropTypes from "prop-types";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

function W(props) {

    const yes = props.value === true || props.value == '1';
    const title = yes ? props.title : props.title_off;
    const icon = props.icon || 'toggle_on';

    function buildIcon() {
        return (
            <div>
                <IconButton
                    size="small"
                    color="primary"
                    style={{cursor: 'default', background: 'none'}}
                    disabled={!yes}>
                    <Icon fontSize="small">{
                        yes ? icon : props.icon_off || icon
                    }</Icon>
                </IconButton>
            </div>
        )
    }

    return title ? (
        <Tooltip title={title}>{buildIcon()}</Tooltip>
    ) : buildIcon();
}

W.propTypes = {
    value    : PropTypes.any.isRequired,
    icon     : PropTypes.string,
    icon_off : PropTypes.string,
    title    : PropTypes.string,
    title_off: PropTypes.string,
};

W.defaultProps = {};

export default W;