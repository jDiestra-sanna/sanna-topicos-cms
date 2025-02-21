import { combineReducers } from 'redux';
import attendanceRecord from './attendance-record.reducer';
import medicalConsultation from './medical-consultation.reducer';

const fuseReducers = combineReducers({
	attendanceRecord,
	medicalConsultation,
});

export default fuseReducers;
