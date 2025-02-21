import * as Actions from '../actions';

const initialState = {
	state: false,
	data : null,
	badge: 0,
};

const quickPanel = function (state = initialState, action) {
	switch (action.type) {
		case Actions.GET_QUICK_PANEL_DATA: {
			return {
				...state,
				data: action.payload
			};
		}
		case Actions.TOGGLE_QUICK_PANEL: {
			return {
				...state,
				state: !state.state
			};
		}
		case Actions.SET_QUICK_PANEL_BADGE: {
			return {
				...state,
				badge: action.value
			};
		}
		case Actions.GET_QUICK_PANEL_BADGE: {
			return state.badge;
		}
		default: {
			return state;
		}
	}
};

export default quickPanel;
