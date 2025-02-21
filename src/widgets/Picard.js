import React from 'react';
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
import ListItemText from "@material-ui/core/ListItemText";
import Pic from "../inc/Pic";
import PropTypes from "prop-types";
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
    root: {
        '& p': {
            lineHeight: '12px',
            fontSize  : '12px',
        },
    },
});

function Picard(props) {
    const classes = useStyles();

    return (
        <ListItem dense className={classes.root} style={{padding: 0}}>
            <ListItemAvatar style={{minWidth: 42}}>
                <Avatar src={props.pic} style={{width: 32, height: 32}}>
                    <Icon>person</Icon>
                </Avatar>
            </ListItemAvatar>
            <ListItemText style={{margin: 0}}
                          primary={props.title}
                          secondary={props.subtitle}/>
        </ListItem>
    );
}


Picard.propTypes = {
    pic     : PropTypes.string,
    title   : PropTypes.string,
    subtitle: PropTypes.node,
};

export default Picard;
