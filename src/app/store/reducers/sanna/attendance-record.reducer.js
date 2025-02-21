import * as Actions from 'app/store/actions/sanna/attendance-record.actions';

const initialState = {
  id: 0,
  campus_id: 0,
  user_id: 0,
  day: null,
  entry_time: null,
  entry_observation: '',
  leaving_time: null,
  sessionCampus: null,
};

const attendanceRecord = (state = initialState, action) => {
  switch (action.type) {
    case Actions.SET_ATTENDANCE_RECORD: {
      return action.value;
    }
    case Actions.SET_ATTENDANCE_RECORD_PARTIAL: {
      return {
        ...state,
        ...action.value,
      };
    }
    case Actions.SET_ATTENDANCE_RECORD_ENTRY_TIME: {
      return {
        ...state,
        entry_time: action.value,
      };
    }
    case Actions.SET_ATTENDANCE_RECORD_LEAVING_TIME: {
      return {
        ...state,
        leaving_time: action.value,
      };
    }
    case Actions.SET_ATTENDANCE_RECORD_ENTRY_OBSERVATION: {
      return {
        ...state,
        leaving_time: action.value,
      };
    }
    case Actions.RESET_ATTENDANCE_RECORD_STATE: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};

export default attendanceRecord;
