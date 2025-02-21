import React from 'react';
import {Typography} from '@material-ui/core';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/styles';
import {stg} from "../../../inc/Utils";
import Pic from "../../../inc/Pic";
import Api from "../../../inc/Api";

const useStyles = makeStyles(theme => ({
    root         : {
        '& .logo-icon'                   : {
            maxWidth: '100%', height: 50, transition: theme.transitions.create(['width', 'height'], {
                duration: theme.transitions.duration.shortest, easing: theme.transitions.easing.easeInOut
            })
        }, '& .react-badge, & .logo-text': {
            transition: theme.transitions.create('opacity', {
                duration: theme.transitions.duration.shortest, easing: theme.transitions.easing.easeInOut
            })
        }
    }, reactBadge: {
        backgroundColor: 'rgba(0,0,0,0.6)', color: '#61DAFB'
    }
}));

function Logo() {
    const classes = useStyles();

    return (<div className={clsx(classes.root, "flex items-center page-logo")}>
        <img className="logo-icon" src={stg.pic_logo} alt="logo"/>
        <Typography className="text-16 ml-12 font-light logo-text" color="textPrimary"/>

        {stg.debug === true && (<a href={Api.URL_LOG_FILE} target="_blank">
            <div className="debug-mode"/>
        </a>)}
    </div>);
}

export default Logo;
