import axios from 'axios';

export const TOGGLE_QUICK_PANEL = '[QUICK PANEL] TOGGLE QUICK PANEL';
export const GET_QUICK_PANEL_DATA = '[QUICK PANEL] GET DATA';

export const SET_QUICK_PANEL_BADGE = '[QUICK PANEL] SET BADGE';
export const GET_QUICK_PANEL_BADGE = '[QUICK PANEL] GET BADGE';

export function getQuickPanelData() {
	const request = axios.get('/api/quick-panel/data');
	return (dispatch) =>
		request.then((response) =>
			dispatch({
				type   : GET_QUICK_PANEL_DATA,
				payload: response.data
			})
		);
}

export function toggleQuickPanel() {
	return {
		type: TOGGLE_QUICK_PANEL
	}
}

export function setQquickPanelBadge(badge) {
	return {
		type : SET_QUICK_PANEL_BADGE,
		value: badge,
	}
}
