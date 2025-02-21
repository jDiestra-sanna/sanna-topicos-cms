import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Api from '../../../inc/Api';
import jwtService from '../../services/jwtService/jwtService';
import Alert from '../../../inc/Alert';

function LanguageSwitcher(props) {
	const user = useSelector(({ auth }) => auth.user);
	const [menu, setMenu] = useState(null);
	const currentLng = user.languages.find(o => o.key === user.data.language);

	const userMenuClick = event => {
		setMenu(event.currentTarget);
	};

	const userMenuClose = () => {
		setMenu(null);
	};

	function handleLanguageChange(o) {
		userMenuClose();
		Api.post('/me/setLanguage', { id_language: o.id }, rsp => {
			if (rsp.ok) {
				jwtService.setUser(null);
				jwtService.emitOnAutoLogin();
			} else {
				Alert.error(rsp.msg);
			}
		});
	}

	return (
		<>
			<Button className="h-64 w-64" onClick={userMenuClick}>
				<img
					className="mx-4 min-w-20"
					src={currentLng.pic}
					alt={currentLng.key}/>
				<Typography className="mx-4 font-600">{currentLng.key}</Typography>
			</Button>

			<Popover
				open={Boolean(menu)}
				anchorEl={menu}
				onClose={userMenuClose}
				anchorOrigin={{
					vertical  : 'bottom',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical  : 'top',
					horizontal: 'center'
				}}
				classes={{
					paper: 'py-8'
				}}>

				{user.languages.map(o => (
					<MenuItem key={o.id} onClick={() => handleLanguageChange(o)}>
						<ListItemIcon className="min-w-40">
							<img className="min-w-20" src={o.pic} alt={o.key}/>
						</ListItemIcon>
						<ListItemText primary={o.name}/>
					</MenuItem>
				))}

			</Popover>
		</>
	);
}

export default LanguageSwitcher;
