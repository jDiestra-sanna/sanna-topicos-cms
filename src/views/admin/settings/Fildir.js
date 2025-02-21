import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Fildirs from "./Fildirs";
import Icon from "@material-ui/core/Icon";
import {Collapse, ListItem, ListItemIcon, ListItemText, Typography} from "@material-ui/core";
import Util from "../../../inc/Utils";

function W(props) {

    const [openDir, setOpenDir] = useState(false);

    const item = props.fildir;

    return item.type === 'dir' ? (
        <>
            <ListItem
                onClick={() => {
                    setOpenDir(!openDir);
                }}
                disabled={item.items.length === 0}
                dense button>
                <ListItemIcon style={{minWidth: 28}}>
                    <Icon fontSize="small" style={{color: '#FCD46D'}}>{openDir ? 'folder_open' : 'folder'}</Icon>
                </ListItemIcon>
                <ListItemText primary={item.name}/>
                <Typography color="textSecondary" variant="caption">
                    {Util.humanFilesize(item.size)}
                </Typography>
                <Icon fontSize="small">{openDir ? 'expand_less' : 'expand_more'}</Icon>
            </ListItem>
            <Collapse in={openDir} timeout="auto" unmountOnExit className="pl-16">
                <Fildirs items={item.items}/>
            </Collapse>
        </>
    ) : (
        <ListItem
            onClick={() => {
            }}
            button dense>
            <ListItemIcon style={{minWidth: 28}}>
                <Icon fontSize="small" color="disabled">arrow_right</Icon>
            </ListItemIcon>
            <ListItemText primary={item.name}/>
            <Typography color="textSecondary" variant="caption">
                {Util.humanFilesize(item.size, 1)}
            </Typography>
        </ListItem>
    );
}

W.propTypes = {
    fildir: PropTypes.object,
};

export default W;