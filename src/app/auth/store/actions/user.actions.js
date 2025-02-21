import history from '@history';
import _ from '@lodash';
import jwtService from 'app/services/jwtService';
import * as FuseActions from 'app/store/actions/fuse';
import Toast from '../../../../inc/Toast';

export const SET_USER_DATA = '[USER] SET DATA';
export const REMOVE_USER_DATA = '[USER] REMOVE DATA';
export const USER_LOGGED_OUT = '[USER] LOGGED OUT';

/**
 * Set User Data
 */
export function setUserData(user) {
	return dispatch => {

		/* Set User Settings */
		if (user.data)
			dispatch(FuseActions.setDefaultSettings(user.data.settings));

		/* Set User Data */
		dispatch({
			type   : SET_USER_DATA,
			payload: user
		})
	};
}

/**
 * Update User Settings
 */
export function updateUserSettings(settings) {
	return (dispatch, getState) => {
		const oldUser = getState().auth.user;
		const user = _.merge({}, oldUser, { data: { settings } });

		updateUserData(user, dispatch);

		return dispatch(setUserData(user));
	};
}

/**
 * Update User Shortcuts
 */
export function updateUserShortcuts(shortcuts) {
	return (dispatch, getState) => {
		const { user } = getState().auth;
		const newUser = {
			...user,
			data: {
				...user.data,
				shortcuts
			}
		};

		updateUserData(newUser, dispatch);

		return dispatch(setUserData(newUser));
	};
}

/**
 * Remove User Data
 */
export function removeUserData() {
	return {
		type: REMOVE_USER_DATA
	};
}

/**
 * Logout
 */
export function logoutUser() {
	return () => {
		jwtService.logout();
		history.push('/login');
	};
}

/**
 * Update User Data
 */
function updateUserData(user, dispatch) {
	if (!user.role || user.role.length === 0) {
		// is guest
		return;
	}

	switch (user.from) {
		default: {
			jwtService.updateUserData(user, rsp => {
				if (rsp.ok) {
					Toast.success();
				} else {
					Toast.error(rsp.msg);
				}
			});
			break;
		}
	}
}
