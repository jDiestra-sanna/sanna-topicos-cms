import { Breadcrumbs, Button, Chip, Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import * as Actions from 'app/store/actions/sanna/medical-consultation.actions';
import Alert from 'inc/Alert';
import Api from 'inc/Apiv2';
import MedicalConsultationsCareData from './MedicalConsultationsCareData';
import MedicalConsultationsConfirm from './MedicalConsultationsConfirm';
import MedicalConsultationsPatientData from './MedicalConsultationsPatientData';
import moment from 'moment';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import PageWrapper from 'app/fuse-layouts/layout1/components/PageWrapper';
import PropTypes from 'prop-types';
import React from 'react';
import Toast from 'inc/Toast';
import useAuthUser from 'hooks/auth-user';

function MedicalConsultations(props) {
  const authUser = useAuthUser();
  const dispatch = useDispatch();
  const medicalConsultation = useSelector(({ sanna }) => sanna.medicalConsultation);
  const paramId = props.match.params.medicalConsultationId;

  React.useEffect(() => {
    loadMedicalConsultation();

    return () => dispatch(Actions.resetState());
  }, []);

  const loadMedicalConsultation = async () => {
    if (!paramId) return dispatch(Actions.resetState());

    const response = await Api.get('/medical-consultations/' + paramId, {}, 'Cargando datos de la consulta médica');
    if (!response.ok) return Alert.error(response.message);
    if (!response.data) return Alert.error('Consulta no encontrada');

    dispatch(
      Actions.setData({
        is_first_load: true,
        step: 0,
        modal_confirm: {
          open: false,
          accepted: false,
        },

        id: response.data.id,
        code: response.data.id.toString().padStart(5, '0'),
        campus_id: response.data.campus_id,
        attendance_date: response.data.attendance_date,
        attendance_time_hour: moment(response.data.attendance_time, 'HH:mm:ss').format('hh'),
        attendance_time_min: moment(response.data.attendance_time, 'HH:mm:ss').format('mm'),
        attendance_time_ampm: moment(response.data.attendance_time, 'HH:mm:ss').format('A'),

        patient: {
          id: response.data.patient.id,
          document_type_id: response.data.patient.document_type_id,
          document_number: response.data.patient.document_number,
          contact_number: response.data.patient.contact_number,
          name: response.data.patient.name,
          paternal_surname: response.data.patient.surname_first,
          maternal_surname: response.data.patient.surname_second,
          birth_date: response.data.patient.birthdate,
          age: response.data.patient.age,
          sex_id: response.data.patient.sex_id,
          childs_guardian_surname: response.data.patient.minor_attorney_surnames,
          childs_guardian_name: response.data.patient.minor_attorney_names,
          childs_guardian_contact_number: response.data.patient.minor_attorney_contact_number,
          role_id: response.data.patient.patient_profile.id,
          role_name: response.data.patient.patient_profile.name,
          role_other_description: response.data.patient.other_profile,
        },

        allergies: {
          food: response.data.patient.allergy.food_allergy,
          drug: response.data.patient.allergy.drug_allergy,
        },

        medical_history: {
          surgical_history: response.data.patient.medical_history.surgical_history,
          has_hypertension: response.data.patient.medical_history.hypertension,
          has_asthma: response.data.patient.medical_history.asthma,
          has_cancer: response.data.patient.medical_history.cancer,
          has_diabetes: response.data.patient.medical_history.diabetes,
          has_epilepsy: response.data.patient.medical_history.epilepsy,
          has_psychological_condition: response.data.patient.medical_history.psychological_condition,
          psychological_condition_description: response.data.patient.medical_history.observation,
          has_other: response.data.patient.medical_history.others,
          other_description: response.data.patient.medical_history.others_description,
        },

        detail_care: {
          consultation_type_id: response.data.attendance_detail.consultation_type.id,
          consultation_type_name: response.data.attendance_detail.consultation_type.name,
          place_id: response.data.attendance_detail.attendance_place.id,
          referred_to_clinic: response.data.attendance_detail.attendance_place.clinic_derived ? 1 : 0,
          anamnesis: response.data.attendance_detail.anamnesis,
          physical_exam: response.data.attendance_detail.physical_exam,
          sick_time_count: response.data.attendance_detail.illness_quantity,
          sick_time_unit_time_id: response.data.attendance_detail.illness_quantity_type_id,
          fc: response.data.attendance_detail.heart_rate,
          fr: response.data.attendance_detail.respiratory_rate,
          t: response.data.attendance_detail.temperature,
          pa: response.data.attendance_detail.pa,
          sto2: response.data.attendance_detail.oxygen_saturation,
        },

        diagnosis: {
          main_diagnostic_id: response.data.medical_diagnosis.main_diagnosis.id,
          main_name: response.data.medical_diagnosis.main_diagnosis.name,
          main_code: response.data.medical_diagnosis.main_diagnosis.code,
          secondary_diagnostic_id: response.data.medical_diagnosis.secondary_diagnosis?.id || 0,
          secondary_name: response.data.medical_diagnosis.secondary_diagnosis?.name || '',
          secondary_code: response.data.medical_diagnosis.secondary_diagnosis?.code || '',
          system_type_id: response.data.medical_diagnosis.biological_system_id,
          mental_health_involved: response.data.medical_diagnosis.involves_mental_health ? 1 : 0,
          has_medical_rest: response.data.medical_diagnosis.issued_medical_rest ? 1 : 0,
          medical_rest_start_date: response.data.medical_diagnosis.medical_rest_start || '',
          medical_rest_end_date: response.data.medical_diagnosis.medical_rest_end || '',
        },

        prescription: {
          medicine_id: response.data.prescriptions[0].medicine?.id || 0,
          medicine_name: response.data.prescriptions[0].medicine?.name || '',
          workplan: response.data.prescriptions[0].workplan,
          observation: response.data.prescriptions[0].observation,
        },
      }),
    );
  };

  const reportEmergency = async user_id => {
    Alert.confirm('¿Estás seguro de reportar una emergencia?', async () => {
      const response = await Api.post('/medical-consultations/emergency-notification', { user_id });
      if (!response.ok) return Alert.error(response.message);
      Toast.success('Se ha enviado la notificación de emergencia correctamente');
    });
  };

  return (
    <PageWrapper className="pb-136">
      <div className="p-24 rounded-8 bg-white">
        <div className="mb-8">
          <Breadcrumbs aria-label="breadcrumb">
            <span
              color="inherit"
              className="text-12"
            >
              Registro de Consulta
            </span>
            {!medicalConsultation.id && (
              <Typography
                color="textPrimary"
                className="text-12 font-medium"
              >
                Nueva Consulta
              </Typography>
            )}
          </Breadcrumbs>
        </div>
        <div className="flex justify-between items-center">
          {medicalConsultation.id > 0 ? (
            <Typography variant="h6">
              {medicalConsultation.patient.name} {medicalConsultation.patient.paternal_surname}{' '}
              {medicalConsultation.patient.maternal_surname}
              {' - '}
              {medicalConsultation.patient.document_number}
            </Typography>
          ) : (
            <Typography
              variant="h5"
              className="font-semibold"
            >
              Registro de consulta
            </Typography>
          )}

          {medicalConsultation.code && (
            <Chip
              className="bg-muisecondary-light text-muisecondary font-medium"
              aria-label="consultation number"
              label={`Consulta  N° ${medicalConsultation.code}`}
            />
          )}
        </div>

        <div>
          <Stepper
            className="bg-transparent"
            alternativeLabel
            activeStep={medicalConsultation.step}
          >
            <Step>
              <StepLabel>Datos del Paciente</StepLabel>
            </Step>
            <Step>
              <StepLabel>Datos de atención del paciente</StepLabel>
            </Step>
          </Stepper>
        </div>

        {medicalConsultation.step === 0 && <MedicalConsultationsPatientData />}
        {medicalConsultation.step === 1 && <MedicalConsultationsCareData />}

        <div
          className="relative w-full"
          aria-label="report emergency"
        >
          <Button
            variant="contained"
            className="bg-red hover:bg-red text-white normal-case font-medium rounded-8 absolute"
            style={{ right: -100, top: 50 }}
            onClick={() => reportEmergency(authUser.data?.id)}
          >
            <div>
              <div>
                <NotificationsActiveIcon />
              </div>
              <div>Reportar</div>
              <div>emergencia</div>
            </div>
          </Button>
        </div>

        <MedicalConsultationsConfirm />
      </div>
    </PageWrapper>
  );
}

export default MedicalConsultations;
