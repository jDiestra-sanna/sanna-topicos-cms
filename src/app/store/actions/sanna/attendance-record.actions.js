export const SET_ATTENDANCE_RECORD_ENTRY_TIME = '[ATTENDANCE RECORD] SET ENTRY TIME';
export const SET_ATTENDANCE_RECORD_LEAVING_TIME = '[ATTENDANCE RECORD] SET LEAVING TIME';
export const SET_ATTENDANCE_RECORD_ENTRY_OBSERVATION = '[ATTENDANCE RECORD] SET ENTRY OBSERVATION';
export const SET_ATTENDANCE_RECORD_PARTIAL = '[ATTENDANCE RECORD] SET PARTIAL OBJECT';
export const SET_ATTENDANCE_RECORD = '[ATTENDANCE RECORD] SET OBJECT';
export const RESET_ATTENDANCE_RECORD_STATE = '[ATTENDANCE RECORD] RESET STATE';

export function setEntryTime(value) {
  return {
    type: SET_ATTENDANCE_RECORD_ENTRY_TIME,
    value,
  };
}

export function setEntryObservation(value) {
  return {
    type: SET_ATTENDANCE_RECORD_ENTRY_OBSERVATION,
    value,
  };
}

export function setLeavingTime(value) {
  return {
    type: SET_ATTENDANCE_RECORD_LEAVING_TIME,
    value,
  };
}

export function setAttendanceRecord(value) {
  return {
    type: SET_ATTENDANCE_RECORD,
    value,
  };
}

export function setPartialAttendanceRecord(value) {
  return {
    type: SET_ATTENDANCE_RECORD_PARTIAL,
    value,
  };
}

export function resetState() {
  return {
    type: RESET_ATTENDANCE_RECORD_STATE,
  };
}
