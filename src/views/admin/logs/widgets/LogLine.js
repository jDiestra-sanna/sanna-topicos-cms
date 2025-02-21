import React, { Fragment, useState } from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Util, { humanDatetime } from '../../../../inc/Utils';

function W(props) {

    const { log } = props;

    const user_type = log.user ? (log.user.role?.name || '') : 'Sistema'
    const user_name = log.user?.name || 'Usuario';
    const log_type_name = log.log_type?.name || ''
    const log_type_prefix = log.log_type?.prefix || ''
    const log_type_suffix = log.log_type?.suffix || ''

    return (
        <Fragment>
            {props.noUser ? (log_type_prefix || '') : (
                <Fragment>
                    {user_type}
                    {' '}{log.user_link
                        ? <Link to={log.user_link}>{user_name}</Link>
                        : <span className='font-medium'>{user_name}</span>}
                    {' '}{log_type_prefix}
                </Fragment>
            )}

            {' '}<Tooltip title={user_type + ' ' + user_name}><b>{log_type_name}</b></Tooltip>

            {' '}{log_type_suffix}

            {!props.noTarget && <>
                {' '}{log.log_target ? log.log_target.label : ''}
                {' '}{log.target_item_link
                    ? <Link to={log.target_item_link}>{log.target_row_label}</Link>
                    : <span className='font-medium'>{log.target_row_label}</span>}
            </>}

            {' '}<Tooltip title={humanDatetime(log.date_created)}>
                <Typography variant="caption" color="textSecondary">{Util.ago(log.date_created)}</Typography>
            </Tooltip>
        </Fragment>
    );
}

W.propTypes = {
    log: PropTypes.object.isRequired,
    noUser: PropTypes.bool,
    noTarget: PropTypes.bool,
};

export default W;