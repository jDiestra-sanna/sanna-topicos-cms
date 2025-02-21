import React, { useState } from 'react';

import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import { ListItemText } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';

export function menuItem(title, onClick, hidden = false, disabled = false) {
	return new Item(title, onClick, hidden, disabled);
}

export function mi(title, onClick, hidden = false, disabled = false) {
	return menuItem(title, onClick, hidden, disabled);
}

export function mii(icon, title, onClick, hidden = false, disabled = false) {
	let ins = menuItem(title, onClick, hidden, disabled);
	ins.setIcon(icon);
	return ins;
}

export function menuDivider() {
	return ':divider';
}

export class MenuItems extends Array {

	item(title, onClick = null, hidden = false, disabled = false) {
		let item = new Item(title, onClick, hidden, disabled);
		this.push(item);
		return item;
	}

	divider() {
		this.push(menuDivider());
	}

}

export class Item {

	constructor(title, onClick = null, hidden = false, disabled = false) {
		this.setTitle(title);
		this.setOnClick(onClick);
		this.setHidden(hidden);
		this.setDisabled(disabled);
	}

	setIcon(val) {
		this.icon = val;
		return this;
	}

	setColor(val) {
		this.color = val;
		return this;
	}

	setTitle(val) {
		this.title = val;
		return this;
	}

	setOnClick(val) {
		this.onClick = val;
		return this;
	}

	setHidden(val) {
		this.hidden = val;
		return this;
	}

	setDisabled(val) {
		this.disabled = val;
		return this;
	}

	if(val) {
		return this.setHidden(!val);
	}
}

function W(props) {

	const [anchor, setAnchor] = useState(null);
	const isOpen = Boolean(anchor);

	function getItems() {
		return typeof props.items === 'function' ? props.items() : props.items;
	}

	return <>
		<IconButton
			size={props.size}
			onClick={ev => {
				//ev.stopPropagation();
				setAnchor(ev.currentTarget);
			}}>
			<Icon>{props.icon}</Icon>
		</IconButton>
		<Menu
			anchorEl={anchor}
			keepMounted
			open={Boolean(anchor)}
			onClose={ev => {
				//ev.stopPropagation();
				setAnchor(null);
			}}>
			{isOpen && getItems().map((item, i) => {
				if (item === ':divider')
					return <Divider key={i}/>;
				else return (
					<MenuItem
						key={i}
						disabled={item.disabled}
						hidden={item.hidden}
						dense
						onClick={ev => {
							//ev.stopPropagation();
							setAnchor(null);
							item.onClick();
						}}>
						{item.icon && (
							<ListItemIcon style={{ minWidth: 32 }}>
								<Icon fontSize="small">{item.icon}</Icon>
							</ListItemIcon>
						)}
						<ListItemText primary={item.title}/>
					</MenuItem>
				);
			})}
		</Menu>
	</>;
}

W.propTypes = {
	items: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.array
	]).isRequired,
	icon : PropTypes.string,
	size : PropTypes.string
};

W.defaultProps = {
	icon: 'more_vert',
	size: 'small'
};

export default W;