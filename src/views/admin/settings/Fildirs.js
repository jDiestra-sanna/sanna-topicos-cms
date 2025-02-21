import React from 'react';
import PropTypes from 'prop-types';
import Fildir from "./Fildir";
import {List} from "@material-ui/core";

function W(props) {

    const items = props.items;

    return (
        <List dense component="div" disablePadding>
            {items.map((o, i) => (
                <Fildir key={i} fildir={o}/>
            ))}
        </List>
    );
}

W.propTypes = {
    items: PropTypes.array.isRequired,
};

export default W;