import React, {useState} from 'react';

import PropTypes from "prop-types";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

function W(props) {
    const [state] = useState(props.state);

    return (
        <Tooltip title={state ? state.name : ''}>
            <IconButton
                size="small"
                style={{color: state ? state.color : '', cursor: 'default', background: 'none'}}>
                <Icon fontSize="small">{state ? state.icon : ''}</Icon>
            </IconButton>
        </Tooltip>
    );
}

W.propTypes = {
    state: PropTypes.object,
};

export default W;
