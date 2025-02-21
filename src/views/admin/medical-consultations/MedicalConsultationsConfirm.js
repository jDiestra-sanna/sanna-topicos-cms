import 'moment/locale/es';
import { Chip, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from 'app/store/actions/sanna/medical-consultation.actions';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import Button from 'widgets/sanna/Button';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ConsultationType from 'models/consultation-type';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import GoHeart from './go-heart.png';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Modal from 'widgets/sanna/Modal';
import moment from 'moment';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import React from 'react';
import Api from 'inc/Apiv2';
import Toast from 'inc/Toast';
import useLocalStorage, { Keys } from 'hooks/useLocalStorage';

moment.locale('es');

const MedicalConsultationsConfirm = () => {
  const [attendance, _] = useLocalStorage(Keys.ATTENDANCE);
  const dispatch = useDispatch();
  const medicalConsultation = useSelector(({ sanna }) => sanna.medicalConsultation);
  const hour = `${medicalConsultation.attendance_time_hour}:${medicalConsultation.attendance_time_min} ${medicalConsultation.attendance_time_ampm}`;
  const fullname = `${medicalConsultation.patient.name} ${medicalConsultation.patient.paternal_surname} ${medicalConsultation.patient.maternal_surname}`;
  const date = moment(medicalConsultation.attendance_date, 'YYYY-MM-DD').format('dddd, D [de] MMMM YYYY');

  const preparePatientDataToSend = () => {
    return {
      patient: {
        document_type_id: medicalConsultation.patient.document_type_id,
        document_number: medicalConsultation.patient.document_number,
        contact_number: medicalConsultation.patient.contact_number,
        surname_first: medicalConsultation.patient.paternal_surname,
        surname_second: medicalConsultation.patient.maternal_surname,
        name: medicalConsultation.patient.name,
        birthdate: medicalConsultation.patient.birth_date,
        sex_id: medicalConsultation.patient.sex_id,
        patient_profile_id: medicalConsultation.patient.role_id,
        other_profile: medicalConsultation.patient.role_other_description,
        minor_attorney_names: medicalConsultation.patient.childs_guardian_name,
        minor_attorney_surnames: medicalConsultation.patient.childs_guardian_surname,
        minor_attorney_contact_number: medicalConsultation.patient.childs_guardian_contact_number,
      },
      allergy: {
        food_allergy: medicalConsultation.allergies.food,
        drug_allergy: medicalConsultation.allergies.drug,
      },
      medical_history: {
        surgical_history: medicalConsultation.medical_history.surgical_history,
        hypertension: medicalConsultation.medical_history.has_hypertension > 0,
        asthma: medicalConsultation.medical_history.has_asthma > 0,
        cancer: medicalConsultation.medical_history.has_cancer > 0,
        diabetes: medicalConsultation.medical_history.has_diabetes > 0,
        epilepsy: medicalConsultation.medical_history.has_epilepsy > 0,
        psychological_condition: medicalConsultation.medical_history.has_psychological_condition > 0,
        observation: medicalConsultation.medical_history.psychological_condition_description,
        others: medicalConsultation.medical_history.has_other > 0,
        others_description: medicalConsultation.medical_history.other_description,
      },
    };
  };

  const prepareConsultationDataToSend = patient_id => {
    const timeHour = medicalConsultation.attendance_time_hour.padStart(2, '0');
    const timeMin = medicalConsultation.attendance_time_min.padStart(2, '0');
    const time12hours = `${timeHour}:${timeMin} ${medicalConsultation.attendance_time_ampm}`;
    const time24hours = moment(time12hours, 'hh:mm A').format('HH:mm');

    return {
      medical_consultation: {
        attendance_date: medicalConsultation.attendance_date,
        attendance_time: time24hours,
        campus_id: attendance.campus.id,
        patient_id,
      },
      attendance_detail: {
        consultation_type_id: medicalConsultation.detail_care.consultation_type_id,
        attendance_place_id: medicalConsultation.detail_care.place_id,
        anamnesis: medicalConsultation.detail_care.anamnesis,
        physical_exam: medicalConsultation.detail_care.physical_exam,
        illness_quantity: medicalConsultation.detail_care.sick_time_count * 1,
        illness_quantity_type_id: medicalConsultation.detail_care.sick_time_unit_time_id,
        heart_rate: medicalConsultation.detail_care.fc * 1,
        respiratory_rate: medicalConsultation.detail_care.fr * 1,
        temperature: medicalConsultation.detail_care.t * 1,
        pa: medicalConsultation.detail_care.pa,
        oxygen_saturation: medicalConsultation.detail_care.sto2 * 1,
        clinic_derived: medicalConsultation.detail_care.referred_to_clinic > 0,
      },
      medical_diagnosis: {
        main_diagnosis_id: medicalConsultation.diagnosis.main_diagnostic_id,
        secondary_diagnosis_id: medicalConsultation.diagnosis.secondary_diagnostic_id || null,
        biological_system_id: medicalConsultation.diagnosis.system_type_id,
        involves_mental_health: medicalConsultation.diagnosis.mental_health_involved > 0,
        issued_medical_rest: medicalConsultation.diagnosis.has_medical_rest > 0,
        medical_rest_start: medicalConsultation.diagnosis.medical_rest_start_date || null,
        medical_rest_end: medicalConsultation.diagnosis.medical_rest_end_date || null,
      },
      prescription: [
        {
          medicine_id: medicalConsultation.prescription.medicine_id || null,
          workplan: medicalConsultation.prescription.workplan,
        },
      ],
    };
  };

  const handleSave = async () => {
    let patientId = 0;

    const findResponse = await Api.get('/medical-consultations/patient', {
      document_number: medicalConsultation.patient.document_number.trim(),
      document_type: medicalConsultation.patient.document_type_id,
    });

    if (findResponse.statusCode === 200) patientId = findResponse.data.id;

    let patientResponse;

    if (patientId) {
      patientResponse = await Api.patch(`/medical-consultations/patient/${patientId}`, preparePatientDataToSend());
    } else {
      patientResponse = await Api.post('medical-consultations/patient', preparePatientDataToSend());
    }

    if (!patientResponse.ok) return Toast.warning(patientResponse.message);

    const patientData = prepareConsultationDataToSend(patientId || patientResponse.data);

    const medicalResponse = await Api.post('medical-consultations/consultation', patientData);
    if (!medicalResponse.ok) return Toast.warning(medicalResponse.message);

    dispatch(Actions.setAttendanceID(medicalResponse.data));
    dispatch(Actions.setAttendanceCode(medicalResponse.data.toString().padStart(5, '0')));
    dispatch(Actions.setModalConfirmAccepted(true));
  };

  const handleClickNewConsultation = () => {
    dispatch(Actions.setModalConfirmOpen(false));
    setTimeout(() => {
      dispatch(Actions.resetState());
    }, 250);
  };

  const goBack = () => {
    dispatch(Actions.setModalConfirmOpen(false));
    setTimeout(() => {
      dispatch(Actions.setModalConfirmAccepted(false));
      dispatch(Actions.setStep(0));
    }, 250);
  };

  return (
    <Modal
      open={medicalConsultation.modal_confirm.open}
      classNamePaper="w-512"
    >
      {medicalConsultation.modal_confirm.accepted ? (
        <div>
          <div className="flex flex-col items-center gap-16 mb-20">
            <div>
              <img src={GoHeart} />
            </div>
            <Typography variant="h6">Consulta registrada con éxito</Typography>
          </div>
          <div className="flex gap-16 mt-16">
            <Button
              onClick={handleClickNewConsultation}
              variant="outlined"
              className="flex-1 text-black"
            >
              Nueva consulta
            </Button>
            <Button
              onClick={goBack}
              className="flex-1"
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-col items-center gap-16 mb-20">
            <div>
              <img src={GoHeart} />
            </div>
            <Typography variant="h6">¿Confirmar registro de consulta?</Typography>
          </div>
          <div className="shadow-xs bg-grey-50 rounded-8 p-16 flex flex-col gap-16">
            <div className="flex justify-between">
              <Typography
                variant="subtitle2"
                className="font-medium text-16"
              >
                Información del consulta
              </Typography>
              <Chip
                label={medicalConsultation.detail_care.consultation_type_name}
                size="small"
                color="secondary"
                className={
                  medicalConsultation.detail_care.consultation_type_id === ConsultationType.EMERGENCY_ID
                    ? 'bg-muired-light text-muired'
                    : 'bg-muisecondary-light text-muisecondary'
                }
              />
            </div>

            <div className="p-12 bg-muisecondary text-white leading-none rounded-8">
              <div className="text-14 flex items-center mb-8">
                <LocationOnIcon style={{ color: '#A6B3FF', height: 20, marginRight: 4 }} />
                <span className="font-stagsans">
                  {attendance ? attendance.campus.client.name : ''} - {attendance ? attendance.campus.name : ''}
                </span>
              </div>
              <div className="flex text-14">
                <div className="flex items-center mr-16">
                  <QueryBuilderIcon style={{ color: '#A6B3FF', height: 20, marginRight: 4 }} />
                  <span className="font-stagsans">{hour}</span>
                </div>
                <div className="flex items-center">
                  <CalendarTodayIcon style={{ color: '#A6B3FF', height: 20, marginRight: 4 }} />
                  <span className="font-stagsans">{date}</span>
                </div>
              </div>
            </div>

            <div className="p-12 rounded-8 bg-white shadow-sm">
              <div className="flex items-center mb-8">
                <AccountCircleOutlinedIcon style={{ color: '#A6B3FF', height: 20, marginRight: 4 }} />
                <span className="font-medium text-14 font-stagsans">{fullname}</span>
              </div>
              <div className="text-14 pl-28">
                <div className="font-stagsans">{medicalConsultation.patient.role_name}</div>
                <div className="font-stagsans">{medicalConsultation.patient.document_number}</div>
              </div>
            </div>

            <div className="p-12 rounded-8 bg-white shadow-sm">
              <div className="flex items-center mb-8">
                <FavoriteBorderOutlinedIcon style={{ color: '#A6B3FF', height: 20, marginRight: 4 }} />
                <span className="font-medium text-14 font-stagsans">Diagnóstico</span>
              </div>
              <div className="text-14 pl-28">
                <div className="flex justify-between gap-32">
                  <div className="font-stagsans">{medicalConsultation.diagnosis.main_name}</div>
                  <div className="font-stagsans">{medicalConsultation.diagnosis.main_code}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-16 mt-16">
            <Button
              onClick={() => dispatch(Actions.setModalConfirmOpen(false))}
              variant="outlined"
              className="flex-1 text-black"
            >
              Volver atrás
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
            >
              Confirmar
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

MedicalConsultationsConfirm.propTypes = {};

export default MedicalConsultationsConfirm;
