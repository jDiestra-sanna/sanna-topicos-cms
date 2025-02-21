import React, {useState} from 'react';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import {ListItemIcon} from '@material-ui/core';

const menu = [
    {
        url  : '/clave',
        title: 'Contraseña',
        icon : 'lock'
    },
];

export default function (props) {

    const [id] = useState(props.match.params.id);

    return (
        <div className="flex-auto border-l-1 border-solid">

            <List>
                {menu.map(o => (
                    <ListItem
                        button
                        component={NavLinkAdapter}
                        to={'/perfil' + o.url}
                        activeClassName="Mui-selected"
                        key={o.url}>
                        <ListItemIcon style={{minWidth: 46}}>
                            <Icon className="list-item-icon" color="action">{o.icon}</Icon>
                        </ListItemIcon>
                        <ListItemText primary={o.title} disableTypography={true}/>
                    </ListItem>
                ))}
            </List>

        </div>
    );
}