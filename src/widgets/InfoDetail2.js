import React, {Fragment, useState} from 'react';

import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

function W(props) {
    return (
        <Fragment>
            <Grid item xs={7}>
                {props.title && (
                    <Typography align="right" color="textSecondary">{props.title}</Typography>
                )}
            </Grid>
            <Grid item xs={5}>
                <Typography component={"div"}>{props.children}</Typography>
            </Grid>
        </Fragment>
    );
}

W.propTypes = {
    title   : PropTypes.string,
    children: PropTypes.any.isRequired,
};

export default W;