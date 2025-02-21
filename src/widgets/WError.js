import React from 'react';

import PropTypes from "prop-types";
import FuseAnimate from "@fuse/core/FuseAnimate";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

function W(props) {
    return (
        <div className="flex flex-1 items-center justify-center h-full">

            <div className="max-w-512 text-center">

                <FuseAnimate animation="transition.expandIn" delay={100}>
                    <Icon fontSize="large">warning</Icon>
                </FuseAnimate>

                <FuseAnimate delay={500}>
                    <Typography variant="h6"
                                color="textSecondary"
                                className="mb-16 mt-16">
                        {props.error}
                    </Typography>
                </FuseAnimate>

                {typeof props.onRetry === 'function' && (
                    <FuseAnimate animation="transition.slideUpIn" delay={700}>
                        <Button color="secondary" onClick={props.onRetry}>
                            Reintentar
                        </Button>
                    </FuseAnimate>
                )}

            </div>
        </div>
    );
}

W.propTypes = {
    error  : PropTypes.string,
    onRetry: PropTypes.func,
};

export default W;