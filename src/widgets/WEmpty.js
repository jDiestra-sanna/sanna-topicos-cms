import React from 'react';

import FuseAnimate from "@fuse/core/FuseAnimate";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";

function W(props) {
    return (
        <div className="flex flex-1 items-center justify-center h-full">
            <div className="max-w-512 text-center">

                {props.title && (
                    <FuseAnimate animation="transition.expandIn" delay={100}>
                        <Typography variant="h2"
                                    color="inherit"
                                    className="font-medium mb-16">
                            {props.title}
                        </Typography>
                    </FuseAnimate>
                )}

                <FuseAnimate delay={props.title ? 500 : 100}>
                    <Typography variant="caption"
                                color="textSecondary"
                                className="mb-16">
                        {props.message}
                    </Typography>
                </FuseAnimate>

            </div>
        </div>
    );
}

W.propTypes = {
    title  : PropTypes.string,
    message: PropTypes.string,
};

W.defaultProps = {
    message: 'No hay contenido para mostrar.',
};

export default W;