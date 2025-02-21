import React, {Fragment, useState} from 'react';

import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {Tooltip} from "@material-ui/core";

function W(props) {
    return (
        <Fragment>
            <Grid item xs={4}>
                {props.tooltip ? (
                    <Tooltip title={props.tooltip}>
                        <Typography align="right" color="textSecondary">{props.title}</Typography>
                    </Tooltip>
                ) : (
                    <Typography align="right" color="textSecondary">{props.title}</Typography>
                )}
            </Grid>
            <Grid item xs={8}>
                <Typography component={"div"}>{props.children}</Typography>
            </Grid>
        </Fragment>
    );
}

W.propTypes = {
    title   : PropTypes.string,
    tooltip : PropTypes.string,
    children: PropTypes.any.isRequired,
};

export default W;