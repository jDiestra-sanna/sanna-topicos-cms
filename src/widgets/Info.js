import React from 'react';

import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";

function W(props) {
    return (
        <div className={props.className}>
            <Grid container spacing={props.spacing || 2}>
                {props.children}
            </Grid>
        </div>
    );
}

W.propTypes = {
    children : PropTypes.node,
    spacing  : PropTypes.number,
    className: PropTypes.string,
};

export default W;