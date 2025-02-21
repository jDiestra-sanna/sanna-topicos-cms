import React from 'react';
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";

function W(props) {

    function buildItem(el, i = 0) {
        if (el && el.type === Grid) {
            return el;
        } else if (el) {
            let name = el.props.name;
            let error = props.errors ? props.errors[name] : '';
            return (
                <Grid
                    key={i}
                    item
                    xs={el.props.xs || 12}
                    sm={el.props.sm || undefined}
                    md={el.props.md || undefined}
                    lg={el.props.lg || undefined}>
                    {el}
                    {error && (
                        <div style={{color: '#f44336', fontSize: 12, padding: '4px 4px 0 4px'}}>
                            {error}
                        </div>
                    )}
                </Grid>
            );
        }
    }

    function buildGrid() {
        return (
            <Grid container spacing={props.spacing || 3}>
                {props.error && (
                    <Grid item xs={12}>
                        <Alert severity="error">
                            {props.error}
                        </Alert>
                    </Grid>
                )}
                {props.children.length > 0 ? props.children.map(buildItem) : buildItem(props.children)}
            </Grid>
        );
    }

    return (
        <fieldset
            disabled={props.disabled}
            style={{
                padding: 0,
                opacity: props.disabled ? 1.0 : 1,
                ...props.style,
            }}>
            {props.onSubmit ? (
                <form className={props.className} style={props.style} onSubmit={e => {
                    e.preventDefault();
                    props.onSubmit(e);
                }}>
                    {buildGrid()}
                </form>
            ) : (
                <div className={props.className} style={props.style}>
                    {buildGrid()}
                </div>
            )}
        </fieldset>
    );
}

W.propTypes = {
    children : PropTypes.node,
    error    : PropTypes.string,
    className: PropTypes.string,
    style      : PropTypes.object,
    errors   : PropTypes.object,
    disabled : PropTypes.bool,
    onSubmit : PropTypes.func,
    spacing  : PropTypes.number,
};

W.defaultProps = {
    style: {},
};

export default W;
