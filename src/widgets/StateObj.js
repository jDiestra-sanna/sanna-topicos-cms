import React from 'react';

import PropTypes from "prop-types";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";

import './StateObj.css';

function W(props) {
    const {state} = props;

    function mkLabel(showInfo = false) {
        return (
            <span className="state-obj"
                  style={{
                      background: state.color
                  }}>
                <div className="_so-label">
                    {state.name}
                </div>
                {showInfo && (
                    <div className="_so-icon">
                        <Icon fontSize="inherit">help_outline</Icon>
                    </div>
                )}
            </span>
        );
    }

    return state.surname ? (
        <Tooltip title={state.surname}>
            {mkLabel(true)}
        </Tooltip>
    ) : mkLabel();
}

W.propTypes = {
    state: PropTypes.object.isRequired,
};

export default W;