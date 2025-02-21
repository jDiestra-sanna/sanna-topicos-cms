import React, {Fragment, useState} from 'react';

import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import Typography from "@material-ui/core/Typography";

function W(props) {

    return (
        <Fragment>
            {props.log.user_type}
            {' '}<Link to={props.log.user_link}>{props.log.user_name}</Link>
            {' '}ha
            {' '}<b>{props.log.type_log_name}</b>
            {' '}<Typography variant="caption" color="textSecondary">{props.log.ago}</Typography>
        </Fragment>
    );
}

W.propTypes = {
    log: PropTypes.object.isRequired,
};

export default W;