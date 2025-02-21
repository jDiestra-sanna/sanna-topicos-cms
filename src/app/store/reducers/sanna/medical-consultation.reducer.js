import * as Actions from 'app/store/actions/sanna/medical-consultation.actions';

const initialState = {
  is_first_load: true,
  step: 0,
  modal_confirm: {
    open: false,
    accepted: false,
  },

  id: 0,
  code: '',
  campus_id: 0,
  attendance_date: '',
  attendance_time_hour: '',
  attendance_time_min: '',
  attendance_time_ampm: '',

  patient: {
    id: 0,
    document_type_id: '',
    document_number: '',
    contact_number: '',
    name: '',
    paternal_surname: '',
    maternal_surname: '',
    birth_date: '',
    age: '',
    sex_id: '',
    childs_guardian_surname: '',
    childs_guardian_name: '',
    childs_guardian_contact_number: '',
    role_id: '',
    role_name: '',
    role_other_description: '',
  },

  allergies: {
    food: '',
    drug: '',
  },

  medical_history: {
    surgical_history: '',
    has_hypertension: 0,
    has_asthma: 0,
    has_cancer: 0,
    has_diabetes: 0,
    has_epilepsy: 0,
    has_psychological_condition: 0,
    psychological_condition_description: '',
    has_other: 0,
    other_description: '',
  },

  detail_care: {
    consultation_type_id: '',
    consultation_type_name: '',
    place_id: '',
    referred_to_clinic: '',
    anamnesis: '',
    physical_exam: '',
    sick_time_count: '',
    sick_time_unit_time_id: '',
    fc: '',
    fr: '',
    t: '',
    pa: '',
    sto2: '',
  },

  diagnosis: {
    main_diagnostic_id: '',
    main_name: '',
    main_code: '',
    secondary_diagnostic_id: '',
    secondary_name: '',
    secondary_code: '',
    system_type_id: '',
    mental_health_involved: '',
    has_medical_rest: '',
    medical_rest_start_date: '',
    medical_rest_end_date: '',
  },

  prescription: {
    medicine_id: '',
    medicine_name: '',
    workplan: '',
    observation: '',
  },
};

const medicalConsultations = (state = initialState, action) => {
  switch (action.type) {
    // generic
    case Actions.SET_MEDICAL_CONSULTATION_FIRST_LOAD: {
      return {
        ...state,
        is_first_load: action.value,
      };
    }
    case Actions.RESET_MEDICAL_CONSULTATION_STATE: {
      return { ...initialState };
    }
    case Actions.SET_MEDICAL_CONSULTATION_STEP: {
      return {
        ...state,
        step: action.value,
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_DATA: {
      return {
        ...state,
        ...action.value,
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_MODAL_CONFIRM_OPEN: {
      return {
        ...state,
        modal_confirm: {
          ...state.modal_confirm,
          open: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_MODAL_CONFIRM_ACCEPTED: {
      return {
        ...state,
        modal_confirm: {
          ...state.modal_confirm,
          accepted: action.value,
        },
      };
    }

    // Attendance
    case Actions.SET_MEDICAL_CONSULTATION_ATTENDANCE_ID: {
      return {
        ...state,
        id: action.value,
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_ATTENDANCE_CODE: {
      return {
        ...state,
        code: action.value,
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_ATTENDANCE_CAMPUS_ID: {
      return {
        ...state,
        campus_id: action.value,
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_ATTENDANCE_DATE: {
      return {
        ...state,
        attendance_date: action.value,
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_ATTENDANCE_TIME_HOUR: {
      return {
        ...state,
        attendance_time_hour: action.value,
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_ATTENDANCE_TIME_MIN: {
      return {
        ...state,
        attendance_time_min: action.value,
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_ATTENDANCE_TIME_AMPM: {
      return {
        ...state,
        attendance_time_ampm: action.value,
      };
    }

    // Patient
    case Actions.SET_MEDICAL_CONSULTATION_PATIENT: {
      return {
        ...state,
        patient: action.value,
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_PATIENT_ID: {
      return {
        ...state,
        patient: {
          ...state.patient,
          id: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_PATIENT_DOCUMENT_TYPE_ID: {
      return {
        ...state,
        patient: {
          ...state.patient,
          document_type_id: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_PATIENT_DOCUMENT_NUMBER: {
      return {
        ...state,
        patient: {
          ...state.patient,
          document_number: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_PATIENT_CONTACT_NUMBER: {
      return {
        ...state,
        patient: {
          ...state.patient,
          contact_number: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_PATIENT_NAME: {
      return {
        ...state,
        patient: {
          ...state.patient,
          name: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_PATIENT_PATERNAL_SURNAME: {
      return {
        ...state,
        patient: {
          ...state.patient,
          paternal_surname: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_PATIENT_MATERNAL_SURNAME: {
      return {
        ...state,
        patient: {
          ...state.patient,
          maternal_surname: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_PATIENT_BIRTH_DATE: {
      return {
        ...state,
        patient: {
          ...state.patient,
          birth_date: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_PATIENT_AGE: {
      return {
        ...state,
        patient: {
          ...state.patient,
          age: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_PATIENT_SEX_ID: {
      return {
        ...state,
        patient: {
          ...state.patient,
          sex_id: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_CHILDS_GUARDIAN_SURNAME: {
      return {
        ...state,
        patient: {
          ...state.patient,
          childs_guardian_surname: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_CHILDS_GUARDIAN_NAME: {
      return {
        ...state,
        patient: {
          ...state.patient,
          childs_guardian_name: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_CHILDS_GUARDIAN_CONTACT_NUMBER: {
      return {
        ...state,
        patient: {
          ...state.patient,
          childs_guardian_contact_number: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_PATIENT_ROLE_ID: {
      return {
        ...state,
        patient: {
          ...state.patient,
          role_id: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_PATIENT_ROLE_NAME: {
      return {
        ...state,
        patient: {
          ...state.patient,
          role_name: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_PATIENT_ROLE_OTHER_DESCRIPTION: {
      return {
        ...state,
        patient: {
          ...state.patient,
          role_other_description: action.value,
        },
      };
    }

    // Allergies
    case Actions.SET_MEDICAL_CONSULTATION_ALLERGIES: {
      return {
        ...state,
        allergies: action.value,
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_ALLERGIES_FOOD: {
      return {
        ...state,
        allergies: {
          ...state.allergies,
          food: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_ALLERGIES_DRUG: {
      return {
        ...state,
        allergies: {
          ...state.allergies,
          drug: action.value,
        },
      };
    }

    // Medical History
    case Actions.SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY: {
      return {
        ...state,
        medical_history: action.value,
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_SURGICAL_HISTORY: {
      return {
        ...state,
        medical_history: {
          ...state.medical_history,
          surgical_history: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_HYPERTENSION: {
      return {
        ...state,
        medical_history: {
          ...state.medical_history,
          has_hypertension: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_ASTHMA: {
      return {
        ...state,
        medical_history: {
          ...state.medical_history,
          has_asthma: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_CANCER: {
      return {
        ...state,
        medical_history: {
          ...state.medical_history,
          has_cancer: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_DIABETES: {
      return {
        ...state,
        medical_history: {
          ...state.medical_history,
          has_diabetes: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_EPILEPSY: {
      return {
        ...state,
        medical_history: {
          ...state.medical_history,
          has_epilepsy: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_PSYCHOLOGICAL_CONDITION: {
      return {
        ...state,
        medical_history: {
          ...state.medical_history,
          has_psychological_condition: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_PSYCHOLOGICAL_CONDITION_DESCRIPTION: {
      return {
        ...state,
        medical_history: {
          ...state.medical_history,
          psychological_condition_description: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_OTHER: {
      return {
        ...state,
        medical_history: {
          ...state.medical_history,
          has_other: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_MEDICAL_HISTORY_OTHER_DESCRIPTION: {
      return {
        ...state,
        medical_history: {
          ...state.medical_history,
          other_description: action.value,
        },
      };
    }

    // Detail Care
    case Actions.SET_MEDICAL_CONSULTATION_DETAIL_CARE_CONSULTATION_TYPE_ID: {
      return {
        ...state,
        detail_care: {
          ...state.detail_care,
          consultation_type_id: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_DETAIL_CARE_CONSULTATION_TYPE_NAME: {
      return {
        ...state,
        detail_care: {
          ...state.detail_care,
          consultation_type_name: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_DETAIL_CARE_PLACE_ID: {
      return {
        ...state,
        detail_care: {
          ...state.detail_care,
          place_id: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_DETAIL_CARE_REFERRED_TO_CLINIC: {
      return {
        ...state,
        detail_care: {
          ...state.detail_care,
          referred_to_clinic: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_DETAIL_CARE_ANAMNESIS: {
      return {
        ...state,
        detail_care: {
          ...state.detail_care,
          anamnesis: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_DETAIL_CARE_PHYSICAL_EXAM: {
      return {
        ...state,
        detail_care: {
          ...state.detail_care,
          physical_exam: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_DETAIL_CARE_SICK_TIME_COUNT: {
      return {
        ...state,
        detail_care: {
          ...state.detail_care,
          sick_time_count: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_DETAIL_CARE_SICK_TIME_UNIT_TIME_ID: {
      return {
        ...state,
        detail_care: {
          ...state.detail_care,
          sick_time_unit_time_id: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_DETAIL_CARE_FC: {
      return {
        ...state,
        detail_care: {
          ...state.detail_care,
          fc: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_DETAIL_CARE_FR: {
      return {
        ...state,
        detail_care: {
          ...state.detail_care,
          fr: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_DETAIL_CARE_T: {
      return {
        ...state,
        detail_care: {
          ...state.detail_care,
          t: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_DETAIL_CARE_PA: {
      return {
        ...state,
        detail_care: {
          ...state.detail_care,
          pa: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_DETAIL_CARE_STO2: {
      return {
        ...state,
        detail_care: {
          ...state.detail_care,
          sto2: action.value,
        },
      };
    }

    // Diagnosis
    case Actions.SET_MEDICAL_CONSULTATION_DIAGNOSIS_MAIN_DIAGNOSTIC_ID: {
      return {
        ...state,
        diagnosis: {
          ...state.diagnosis,
          main_diagnostic_id: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_DIAGNOSIS_MAIN_CODE: {
      return {
        ...state,
        diagnosis: {
          ...state.diagnosis,
          main_code: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_DIAGNOSIS_MAIN_NAME: {
      return {
        ...state,
        diagnosis: {
          ...state.diagnosis,
          main_name: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_DIAGNOSIS_SECONDARY_DIAGNOSTIC_ID: {
      return {
        ...state,
        diagnosis: {
          ...state.diagnosis,
          secondary_diagnostic_id: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_DIAGNOSIS_SECONDARY_NAME: {
      return {
        ...state,
        diagnosis: {
          ...state.diagnosis,
          secondary_name: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_DIAGNOSIS_SECONDARY_CODE: {
      return {
        ...state,
        diagnosis: {
          ...state.diagnosis,
          secondary_code: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_DIAGNOSIS_SYSTEM_TYPE_ID: {
      return {
        ...state,
        diagnosis: {
          ...state.diagnosis,
          system_type_id: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_DIAGNOSIS_MENTAL_HEALTH_INVOLVED: {
      return {
        ...state,
        diagnosis: {
          ...state.diagnosis,
          mental_health_involved: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_DIAGNOSIS_HAS_MEDICAL_REST: {
      return {
        ...state,
        diagnosis: {
          ...state.diagnosis,
          has_medical_rest: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_DIAGNOSIS_MEDICAL_REST_START_DATE: {
      return {
        ...state,
        diagnosis: {
          ...state.diagnosis,
          medical_rest_start_date: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_DIAGNOSIS_MEDICAL_REST_END_DATE: {
      return {
        ...state,
        diagnosis: {
          ...state.diagnosis,
          medical_rest_end_date: action.value,
        },
      };
    }

    // Prescription
    case Actions.SET_MEDICAL_CONSULTATION_PRESCRIPTION_MEDICINE_ID: {
      return {
        ...state,
        prescription: {
          ...state.prescription,
          medicine_id: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_PRESCRIPTION_MEDICINE_NAME: {
      return {
        ...state,
        prescription: {
          ...state.prescription,
          medicine_name: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_PRESCRIPTION_WORKPLAN: {
      return {
        ...state,
        prescription: {
          ...state.prescription,
          workplan: action.value,
        },
      };
    }
    case Actions.SET_MEDICAL_CONSULTATION_PRESCRIPTION_OBSERVATION: {
      return {
        ...state,
        prescription: {
          ...state.prescription,
          observation: action.value,
        },
      };
    }

    default: {
      return state;
    }
  }
};

export default medicalConsultations;
