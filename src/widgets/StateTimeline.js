import React from 'react';

import PropTypes from "prop-types";
import Icon from "@material-ui/core/Icon";

import './StateTimeline.css';
import {humanDate} from "../inc/Utils";

function W(props) {
    const {state} = props;

    return (
        <span className="inline px-4 pdg-tb-2 text-white uppercase font-bold w-StateTimeline"
              /*style={{borderColor: state.color}}*/
              onClick={() => props.onClick()}>

            <div className="wST-dot" style={{backgroundColor: state.color}}/>

            <div style={{
                fontSize  : 12,
                fontWeight: 'bold',
                color     : '#000000',
            }}>{state.name}</div>
            <div style={{
                fontSize: 12,
                color   : '#777',
            }}>
                {/*<Icon fontSize="inherit" style={{color: '#CCC'}}>date_range</Icon>*/}
                {state.surname ? humanDate(state.surname) : '-'}
            </div>
            <Icon className="wST-arrow">chevron_right</Icon>
        </span>
    );
}

W.propTypes = {
    state  : PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default W;