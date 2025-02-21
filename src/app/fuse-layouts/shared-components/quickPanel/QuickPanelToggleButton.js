import React from 'react';
import {Icon, IconButton} from '@material-ui/core';
import * as quickPanelActions from './store/actions';
import {useDispatch, useSelector} from 'react-redux';
import Badge from "@material-ui/core/Badge";

function QuickPanelToggleButton(props) {
	const dispatch = useDispatch();
	const badge = useSelector(({quickPanel}) => quickPanel.badge);

	return (
		<IconButton className="w-64 h-64" onClick={() => dispatch(quickPanelActions.toggleQuickPanel())}>
			<Badge badgeContent={badge} color="secondary" max={9}>
				<Icon>notifications</Icon>
			</Badge>
		</IconButton>
	);
}

export default QuickPanelToggleButton;