import React from 'react';
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

function W(props) {
    return (
        <Grid item xs={12}>
            <Typography variant="subtitle1">{props.label}</Typography>
        </Grid>
    );
}

W.propTypes = {
    label: PropTypes.string,
};

export default W;