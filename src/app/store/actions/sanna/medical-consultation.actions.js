// generic
export const SET_MEDICAL_CONSULTATION_FIRST_LOAD = '[MEDICAL CONSULTATION] SET FIRST LOAD';
export const SET_MEDICAL_CONSULTATION_STEP = '[MEDICAL CONSULTATION] NEXT STEP';
export const RESET_MEDICAL_CONSULTATION_STATE = '[MEDICAL CONSULTATION] RESET STATE';
export const SET_MEDICAL_CONSULTATION_DATA = '[MEDICAL CONSULTATION] SET DATA';

export function setFirstLoad() {
  return {
    type: SET_MEDICAL_CONSULTATION_FIRST_LOAD,
  };
}

export function resetState() {
  return {
    type: RESET_MEDICAL_CONSULTATION_STATE,
  };
}

export function setStep(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_STEP,
    value,
  };
}

export function setData(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DATA,
    value,
  };
}

export const SET_MEDICAL_CONSULTATION_MODAL_CONFIRM_OPEN = '[MEDICAL CONSULTATION] SET MODAL CONFIRM OPEN';
export const SET_MEDICAL_CONSULTATION_MODAL_CONFIRM_ACCEPTED = '[MEDICAL CONSULTATION] SET MODAL CONFIRM ACCEPTED';

export function setModalConfirmOpen(value = true) {
  return {
    type: SET_MEDICAL_CONSULTATION_MODAL_CONFIRM_OPEN,
    value,
  };
}

export function setModalConfirmAccepted(value = true) {
  return {
    type: SET_MEDICAL_CONSULTATION_MODAL_CONFIRM_ACCEPTED,
    value,
  };
}

// attendance
export const SET_MEDICAL_CONSULTATION_ATTENDANCE_ID = '[MEDICAL CONSULTATION] SET ATTENDANCE ID';
export const SET_MEDICAL_CONSULTATION_ATTENDANCE_CODE = '[MEDICAL CONSULTATION] SET ATTENDANCE NAME';
export const SET_MEDICAL_CONSULTATION_ATTENDANCE_CAMPUS_ID = '[MEDICAL CONSULTATION] SET ATTENDANCE CAMPUS ID';
export const SET_MEDICAL_CONSULTATION_ATTENDANCE_DATE = '[MEDICAL CONSULTATION] SET ATTENDANCE DATE';
export const SET_MEDICAL_CONSULTATION_ATTENDANCE_TIME_HOUR = '[MEDICAL CONSULTATION] SET ATTENDANCE TIME HOUR';
export const SET_MEDICAL_CONSULTATION_ATTENDANCE_TIME_MIN = '[MEDICAL CONSULTATION] SET ATTENDANCE TIME MIN';
export const SET_MEDICAL_CONSULTATION_ATTENDANCE_TIME_AMPM = '[MEDICAL CONSULTATION] SET ATTENDANCE TIME AMPM';

export function setAttendanceID(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_ATTENDANCE_ID,
    value,
  };
}

export function setAttendanceCode(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_ATTENDANCE_CODE,
    value,
  };
}

export function setAttendanceCampusID(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_ATTENDANCE_CAMPUS_ID,
    value,
  };
}

export function setAttendanceDate(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_ATTENDANCE_DATE,
    value,
  };
}

export function setAttendanceTimeHour(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_ATTENDANCE_TIME_HOUR,
    value,
  };
}

export function setAttendanceTimeMin(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_ATTENDANCE_TIME_MIN,
    value,
  };
}

export function setAttendanceTimeAMPM(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_ATTENDANCE_TIME_AMPM,
    value,
  };
}

// Patient
export const SET_MEDICAL_CONSULTATION_PATIENT = '[PATIENT] SET';
export const SET_MEDICAL_CONSULTATION_PATIENT_ID = '[PATIENT] SET ID';
export const SET_MEDICAL_CONSULTATION_PATIENT_DOCUMENT_TYPE_ID = '[PATIENT] SET DOCUMENT TYPE ID';
export const SET_MEDICAL_CONSULTATION_PATIENT_DOCUMENT_NUMBER = '[PATIENT] SET DOCUMENT NUMBER';
export const SET_MEDICAL_CONSULTATION_PATIENT_CONTACT_NUMBER = '[PATIENT] SET CONTACT NUMBER';
export const SET_MEDICAL_CONSULTATION_PATIENT_NAME = '[PATIENT] SET NAME';
export const SET_MEDICAL_CONSULTATION_PATIENT_PATERNAL_SURNAME = '[PATIENT] SET PATERNAL SURNAME';
export const SET_MEDICAL_CONSULTATION_PATIENT_MATERNAL_SURNAME = '[PATIENT] SET MATERNAL SURNAME';
export const SET_MEDICAL_CONSULTATION_PATIENT_BIRTH_DATE = '[PATIENT] SET BIRTH DATE';
export const SET_MEDICAL_CONSULTATION_PATIENT_AGE = '[PATIENT] SET AGE';
export const SET_MEDICAL_CONSULTATION_PATIENT_SEX_ID = '[PATIENT] SET SEX ID';
export const SET_MEDICAL_CONSULTATION_CHILDS_GUARDIAN_SURNAME = '[PATIENT] SET CHILDS GUARDIAN SURNAME';
export const SET_MEDICAL_CONSULTATION_CHILDS_GUARDIAN_NAME = '[PATIENT] SET CHILDS GUARDIAN NAME';
export const SET_MEDICAL_CONSULTATION_CHILDS_GUARDIAN_CONTACT_NUMBER = '[PATIENT] SET CHILDS GUARDIAN CONTACT NUMBER';
export const SET_MEDICAL_CONSULTATION_PATIENT_ROLE_ID = '[PATIENT] SET ROLE ID';
export const SET_MEDICAL_CONSULTATION_PATIENT_ROLE_NAME = '[PATIENT] SET ROLE NAME';
export const SET_MEDICAL_CONSULTATION_PATIENT_ROLE_OTHER_DESCRIPTION = '[PATIENT] SET ROLE OTHER DESCRIPTION';

export function setPatient(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_PATIENT,
    value,
  };
}

export function setPatientId(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_PATIENT_ID,
    value,
  };
}

export function setPatientDocumentTypeId(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_PATIENT_DOCUMENT_TYPE_ID,
    value,
  };
}

export function setPatientDocumentNumber(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_PATIENT_DOCUMENT_NUMBER,
    value,
  };
}

export function setPatientContactNumber(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_PATIENT_CONTACT_NUMBER,
    value,
  };
}

export function setPatientName(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_PATIENT_NAME,
    value,
  };
}

export function setPatientPaternalSurname(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_PATIENT_PATERNAL_SURNAME,
    value,
  };
}

export function setPatientMaternalSurname(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_PATIENT_MATERNAL_SURNAME,
    value,
  };
}

export function setPatientBirthDate(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_PATIENT_BIRTH_DATE,
    value,
  };
}

export function setPatientAge(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_PATIENT_AGE,
    value,
  };
}

export function setPatientChildGuardianSurname(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_CHILDS_GUARDIAN_SURNAME,
    value,
  };
}

export function setPatientChildGuardianName(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_CHILDS_GUARDIAN_NAME,
    value,
  };
}

export function setPatientChildGuardianContactNumber(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_CHILDS_GUARDIAN_CONTACT_NUMBER,
    value,
  };
}

export function setPatientSexId(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_PATIENT_SEX_ID,
    value,
  };
}

export function setPatientRoleId(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_PATIENT_ROLE_ID,
    value,
  };
}

export function setPatientRoleName(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_PATIENT_ROLE_NAME,
    value,
  };
}

export function setPatientRoleOtherDescription(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_PATIENT_ROLE_OTHER_DESCRIPTION,
    value,
  };
}

// Allergies
export const SET_MEDICAL_CONSULTATION_ALLERGIES = '[ALLERGIES] SET';
export const SET_MEDICAL_CONSULTATION_ALLERGIES_FOOD = '[ALLERGIES] SET FOOD';
export const SET_MEDICAL_CONSULTATION_ALLERGIES_DRUG = '[ALLERGIES] SET DRUG';

export function setAllergies(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_ALLERGIES,
    value,
  };
}

export function setAllergiesFood(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_ALLERGIES_FOOD,
    value,
  };
}

export function setAllergiesDrug(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_ALLERGIES_DRUG,
    value,
  };
}

// Medical History
export const SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY = '[MEDICAL HISTORY] SET';
export const SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_SURGICAL_HISTORY = '[MEDICAL HISTORY] SET SURGICAL HISTORY';
export const SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_HYPERTENSION = '[MEDICAL HISTORY] SET HYPERTENSION';
export const SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_ASTHMA = '[MEDICAL HISTORY] SET ASTHMA';
export const SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_CANCER = '[MEDICAL HISTORY] SET CANCER';
export const SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_DIABETES = '[MEDICAL HISTORY] SET DIABETES';
export const SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_EPILEPSY = '[MEDICAL HISTORY] SET EPILEPSY';
export const SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_PSYCHOLOGICAL_CONDITION =
  '[MEDICAL HISTORY] SET PSYCHOLOGICAL CONDITION';
export const SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_PSYCHOLOGICAL_CONDITION_DESCRIPTION =
  '[MEDICAL HISTORY] SET PSYCHOLOGICAL CONDITION DESCRIPTION';
export const SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_OTHER = '[MEDICAL HISTORY] SET OTHER';
export const SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_OTHER_DESCRIPTION = '[MEDICAL HISTORY] SET OTHER DESCRIPTION';

export function setMedicalHistory(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY,
    value,
  };
}

export function setMedicalHistorySurgicalHistory(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_SURGICAL_HISTORY,
    value,
  };
}

export function setMedicalHistoryHypertension(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_HYPERTENSION,
    value,
  };
}

export function setMedicalHistoryAsthma(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_ASTHMA,
    value,
  };
}

export function setMedicalHistoryCancer(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_CANCER,
    value,
  };
}

export function setMedicalHistoryDiabetes(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_DIABETES,
    value,
  };
}

export function setMedicalHistoryEpilepsy(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_EPILEPSY,
    value,
  };
}

export function setMedicalHistoryPsychologicalCondition(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_PSYCHOLOGICAL_CONDITION,
    value,
  };
}

export function setMedicalHistoryPsychologicalConditionDescription(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_PSYCHOLOGICAL_CONDITION_DESCRIPTION,
    value,
  };
}

export function setMedicalHistoryOther(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_OTHER,
    value,
  };
}

export function setMedicalHistoryOtherDescription(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_OTHER_DESCRIPTION,
    value,
  };
}

// Detail Care
export const SET_MEDICAL_CONSULTATION_DETAIL_CARE_CONSULTATION_TYPE_ID = '[DETAIL CARE] SET CONSULTATION TYPE ID';
export const SET_MEDICAL_CONSULTATION_DETAIL_CARE_CONSULTATION_TYPE_NAME = '[DETAIL CARE] SET CONSULTATION TYPE NAME';
export const SET_MEDICAL_CONSULTATION_DETAIL_CARE_PLACE_ID = '[DETAIL CARE] SET PLACE ID';
export const SET_MEDICAL_CONSULTATION_DETAIL_CARE_REFERRED_TO_CLINIC = '[DETAIL CARE] SET REFERRED TO CLINIC';
export const SET_MEDICAL_CONSULTATION_DETAIL_CARE_ANAMNESIS = '[DETAIL CARE] SET ANAMNESIS';
export const SET_MEDICAL_CONSULTATION_DETAIL_CARE_PHYSICAL_EXAM = '[DETAIL CARE] SET PHYSICAL EXAM';
export const SET_MEDICAL_CONSULTATION_DETAIL_CARE_SICK_TIME_COUNT = '[DETAIL CARE] SET SICK TIME COUNT';
export const SET_MEDICAL_CONSULTATION_DETAIL_CARE_SICK_TIME_UNIT_TIME_ID = '[DETAIL CARE] SET SICK TIME UNIT TIME ID';
export const SET_MEDICAL_CONSULTATION_DETAIL_CARE_FC = '[DETAIL CARE] SET FC';
export const SET_MEDICAL_CONSULTATION_DETAIL_CARE_FR = '[DETAIL CARE] SET FR';
export const SET_MEDICAL_CONSULTATION_DETAIL_CARE_T = '[DETAIL CARE] SET T';
export const SET_MEDICAL_CONSULTATION_DETAIL_CARE_PA = '[DETAIL CARE] SET PA';
export const SET_MEDICAL_CONSULTATION_DETAIL_CARE_STO2 = '[DETAIL CARE] SET STO2';

export function setDetailCareConsultationTypeId(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DETAIL_CARE_CONSULTATION_TYPE_ID,
    value,
  };
}

export function setDetailCareConsultationTypeName(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DETAIL_CARE_CONSULTATION_TYPE_NAME,
    value,
  };
}

export function setDetailCarePlaceId(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DETAIL_CARE_PLACE_ID,
    value,
  };
}

export function setDetailCareReferredToClinic(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DETAIL_CARE_REFERRED_TO_CLINIC,
    value,
  };
}

export function setDetailCareAnamnesis(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DETAIL_CARE_ANAMNESIS,
    value,
  };
}

export function setDetailCarePhysicalExam(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DETAIL_CARE_PHYSICAL_EXAM,
    value,
  };
}

export function setDetailCareSickTimeCount(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DETAIL_CARE_SICK_TIME_COUNT,
    value,
  };
}

export function setDetailCareSickTimeUnitTimeId(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DETAIL_CARE_SICK_TIME_UNIT_TIME_ID,
    value,
  };
}

export function setDetailCareFc(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DETAIL_CARE_FC,
    value,
  };
}

export function setDetailCareFr(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DETAIL_CARE_FR,
    value,
  };
}

export function setDetailCareT(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DETAIL_CARE_T,
    value,
  };
}

export function setDetailCarePa(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DETAIL_CARE_PA,
    value,
  };
}

export function setDetailCareSto2(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DETAIL_CARE_STO2,
    value,
  };
}

// Diagnosis
export const SET_MEDICAL_CONSULTATION_DIAGNOSIS_MAIN_DIAGNOSTIC_ID = '[DIAGNOSIS] SET MAIN DIAGNOSTIC ID';
export const SET_MEDICAL_CONSULTATION_DIAGNOSIS_MAIN_NAME = '[DIAGNOSIS] SET MAIN NAME';
export const SET_MEDICAL_CONSULTATION_DIAGNOSIS_MAIN_CODE = '[DIAGNOSIS] SET MAIN CODE';
export const SET_MEDICAL_CONSULTATION_DIAGNOSIS_SECONDARY_DIAGNOSTIC_ID = '[DIAGNOSIS] SET SECONDARY DIAGNOSTIC ID';
export const SET_MEDICAL_CONSULTATION_DIAGNOSIS_SECONDARY_NAME = '[DIAGNOSIS] SET SECONDARY NAME';
export const SET_MEDICAL_CONSULTATION_DIAGNOSIS_SECONDARY_CODE = '[DIAGNOSIS] SET SECONDARY CODE';
export const SET_MEDICAL_CONSULTATION_DIAGNOSIS_SYSTEM_TYPE_ID = '[DIAGNOSIS] SET SYSTEM TYPE ID';
export const SET_MEDICAL_CONSULTATION_DIAGNOSIS_MENTAL_HEALTH_INVOLVED = '[DIAGNOSIS] SET MENTAL HEALTH INVOLVED';
export const SET_MEDICAL_CONSULTATION_DIAGNOSIS_HAS_MEDICAL_REST = '[DIAGNOSIS] SET HAS MEDICAL REST';
export const SET_MEDICAL_CONSULTATION_DIAGNOSIS_MEDICAL_REST_START_DATE = '[DIAGNOSIS] SET HAS MEDICAL REST START DATE';
export const SET_MEDICAL_CONSULTATION_DIAGNOSIS_MEDICAL_REST_END_DATE = '[DIAGNOSIS] SET HAS MEDICAL REST END DATE';

export function setDiagnosisMainDiagnosticId(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DIAGNOSIS_MAIN_DIAGNOSTIC_ID,
    value,
  };
}

export function setDiagnosisMainCode(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DIAGNOSIS_MAIN_CODE,
    value,
  };
}

export function setDiagnosisMainName(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DIAGNOSIS_MAIN_NAME,
    value,
  };
}

export function setDiagnosisSecondaryDiagnosticId(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DIAGNOSIS_SECONDARY_DIAGNOSTIC_ID,
    value,
  };
}

export function setDiagnosisSecondaryName(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DIAGNOSIS_SECONDARY_NAME,
    value,
  };
}

export function setDiagnosisSecondaryCode(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DIAGNOSIS_SECONDARY_CODE,
    value,
  };
}

export function setDiagnosisSystemTypeId(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DIAGNOSIS_SYSTEM_TYPE_ID,
    value,
  };
}

export function setDiagnosisMentalHealthInvolved(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DIAGNOSIS_MENTAL_HEALTH_INVOLVED,
    value,
  };
}

export function setDiagnosisHasMedicalRest(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DIAGNOSIS_HAS_MEDICAL_REST,
    value,
  };
}

export function setDiagnosisMedicalRestStartDate(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DIAGNOSIS_MEDICAL_REST_START_DATE,
    value,
  };
}

export function setDiagnosisMedicalRestEndDate(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_DIAGNOSIS_MEDICAL_REST_END_DATE,
    value,
  };
}

// Prescription
export const SET_MEDICAL_CONSULTATION_PRESCRIPTION_MEDICINE_ID = '[PRESCRIPTION] SET MEDICINE ID';
export const SET_MEDICAL_CONSULTATION_PRESCRIPTION_MEDICINE_NAME = '[PRESCRIPTION] SET MEDICINE NAME';
export const SET_MEDICAL_CONSULTATION_PRESCRIPTION_WORKPLAN = '[PRESCRIPTION] SET WORKPLAN';
export const SET_MEDICAL_CONSULTATION_PRESCRIPTION_OBSERVATION = '[PRESCRIPTION] SET OBSERVATION';

export function setPrescriptionMedicineId(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_PRESCRIPTION_MEDICINE_ID,
    value,
  };
}

export function setPrescriptionMedicineName(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_PRESCRIPTION_MEDICINE_NAME,
    value,
  };
}

export function setPrescriptionWorkplan(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_PRESCRIPTION_WORKPLAN,
    value,
  };
}

export function setPrescriptionObservation(value) {
  return {
    type: SET_MEDICAL_CONSULTATION_PRESCRIPTION_OBSERVATION,
    value,
  };
}
