import { TextField, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from 'app/store/actions/sanna/medical-consultation.actions';
import Alert from 'inc/Alert';
import ConsultationType from 'models/consultation-type';
import DiagnosisType from 'models/diagnosis-type';
import FCheck from 'widgets/fields/FCheck';
import FSelectAjax from 'widgets/fields/FSelectAjax';
import FSelectLocal from 'widgets/fields/FSelectLocal';
import FText from 'widgets/fields/FText';
import history from '@history';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import Proffesion from 'models/proffesion';
import PropTypes from 'prop-types';
import React from 'react';
import SButton from 'widgets/sanna/Button';
import Toast from 'inc/Toast';
import moment from 'moment';
import useAuthUser from 'hooks/auth-user';

const MedicalConsultationsCareData = () => {
  const dispatch = useDispatch();
  const medicalConsultation = useSelector(({ sanna }) => sanna.medicalConsultation);
  const authUser = useSelector(({ auth }) => auth.user);
  const _authUser = useAuthUser();


  const handleChangeVitalSigns = (e, propName) => {
    const inputValue = e.target.value;
    // Expresión regular para validar si el valor es un número entre 0 y 99.99
    let regex = /^(?:\d{1,2}(?:\.\d{0,2})?)?$/;

    if (propName === 'fc' || propName === 'fr') {
      regex = /^\d{1,3}$/;
    }

    if (propName === 'pa') {
      regex = /^\d{1,3}(?:\/\d{0,3})?$/;
    }

    if (regex.test(inputValue) || inputValue === '') {
      switch (propName) {
        case 'fc':
          dispatch(Actions.setDetailCareFc(inputValue));
          break;
        case 'fr':
          dispatch(Actions.setDetailCareFr(inputValue));
          break;
        case 't':
          dispatch(Actions.setDetailCareT(inputValue));
          break;
        case 'pa':
          dispatch(Actions.setDetailCarePa(inputValue));
          break;
        case 'sto2':
          dispatch(Actions.setDetailCareSto2(inputValue));
          break;

        default:
          console.log('Invalid propName to change vital signs:', propName);
          break;
      }
    }
  };

  const handleChangeSickTimeCount = e => {
    const inputValue = e.target.value;
    // Expresión regular para validar si el valor es un número entre 01 y 999
    const regex = /^(0?[1-9]|[1-9][0-9]{1,2}|0)$/;

    if (regex.test(inputValue) || inputValue === '') {
      dispatch(Actions.setDetailCareSickTimeCount(inputValue));
    }
  };

  const handleRegisterConsultation = () => {
    if (!medicalConsultation.detail_care.consultation_type_id) {
      return Toast.warning('Debe seleccionar el tipo de consulta');
    }
    if (
      medicalConsultation.detail_care.consultation_type_id === ConsultationType.EMERGENCY_ID &&
      medicalConsultation.detail_care.referred_to_clinic === ''
    ) {
      return Toast.warning('Si el tipo de consulta es "Emergencia", debe seleccionar si se derivó a clínica');
    }
    if (!medicalConsultation.detail_care.place_id) {
      return Toast.warning('Debe seleccionar el lugar de atención');
    }
    if (!medicalConsultation.detail_care.anamnesis.trim()) {
      return Toast.warning('El campo Anamnesis es requerido');
    }
    if (!medicalConsultation.detail_care.physical_exam.trim()) {
      return Toast.warning('El campo examen físico es requerido');
    }
    if (!(medicalConsultation.detail_care.sick_time_count > 0)) {
      return Toast.warning('Debe ingresar el tiempo de enfermedad (N°)');
    }
    if (!medicalConsultation.detail_care.sick_time_unit_time_id) {
      return Toast.warning('Debe ingresar el tiempo de enfermedad (Unidad de tiempo)');
    }
    if (!medicalConsultation.detail_care.fc) {
      return Toast.warning('Debe ingresar la Frecuencia Cardíaca (FC)');
    }
    if (!medicalConsultation.detail_care.fr) {
      return Toast.warning('Debe ingresar la Frecuencia Respiratoria (FR)');
    }
    if (!medicalConsultation.detail_care.t) {
      return Toast.warning('Debe ingresar la Temperatura (T°)');
    }
    if (!medicalConsultation.detail_care.pa) {
      return Toast.warning('Debe ingresar la Presión Arterial (PA)');
    }
    if (!medicalConsultation.detail_care.sto2) {
      return Toast.warning('Debe ingresar la Saturación de Oxígeno (St02)');
    }
    if (!medicalConsultation.diagnosis.main_diagnostic_id) {
      return Toast.warning('Debe seleccionar el diagnóstico principal');
    }
    // if (!medicalConsultation.diagnosis.secondary_diagnostic_id) {
    //   return Toast.warning('Debe seleccionar el diagnóstico secundario');
    // }
    if (!medicalConsultation.diagnosis.system_type_id) {
      return Toast.warning('Debe seleccionar el tipo de sistema involucrado');
    }
    if (medicalConsultation.diagnosis.mental_health_involved === '') {
      return Toast.warning('Debe seleccionar si el paciente tiene la salud mental involucrada');
    }
    // if (medicalConsultation.diagnosis.has_medical_rest === '') {
    //   return Toast.warning('Debe seleccionar si se emitió descanso médico');
    // }
    if (medicalConsultation.diagnosis.has_medical_rest && !medicalConsultation.diagnosis.medical_rest_start_date) {
      return Toast.warning('Si se emitió descanso médico, debe ingresar la fecha de inicio de descanso');
    }
    if (medicalConsultation.diagnosis.has_medical_rest && !medicalConsultation.diagnosis.medical_rest_end_date) {
      return Toast.warning('Si se emitió descanso médico, debe ingresar la fecha de fin de descanso');
    }
    if (
      medicalConsultation.diagnosis.has_medical_rest &&
      !(
        moment(medicalConsultation.diagnosis.medical_rest_start_date).isBefore(
          moment(medicalConsultation.diagnosis.medical_rest_end_date),
        ) ||
        moment(medicalConsultation.diagnosis.medical_rest_start_date).isSame(
          moment(medicalConsultation.diagnosis.medical_rest_end_date),
        )
      )
    ) {
      return Toast.warning('La fecha fin del descanso médico no puede ser anterior a la fecha de inicio');
    }
    // if (!medicalConsultation.prescription.medicine_id) {
    //   return Toast.warning('Debe seleccionar el medicamento a recetar');
    // }
    if (!medicalConsultation.prescription.workplan.trim()) {
      return Toast.warning('Debe ingresar el plan de trabajo');
    }
    dispatch(Actions.setModalConfirmOpen(true));
  };

  return (
    <div>
      <div className="mb-32">
        <Typography
          variant="h6"
          className="font-semibold text-16 mb-20"
        >
          Detalle de la atención
        </Typography>

        <div className="grid grid-cols-2 gap-16 bg-grey-50 border border-bg-grey-200 rounded-8 p-24">
          <FSelectLocal
            className="bg-white"
            endpoint="/dropdown-options/consultation-types"
            label="Tipo de consulta"
            value={medicalConsultation.detail_care.consultation_type_id}
            onChangeObject={data => {
              if (!data) return;
              dispatch(Actions.setDetailCareConsultationTypeId(data.id));
              dispatch(Actions.setDetailCareConsultationTypeName(data.name));
              dispatch(Actions.setDetailCareReferredToClinic(''));
            }}
            disabled={medicalConsultation.id > 0}
            required
          />

          <FSelectLocal
            className="bg-white"
            endpoint="/dropdown-options/attendance-places"
            label="Lugar de atención"
            value={medicalConsultation.detail_care.place_id}
            onChange={e => dispatch(Actions.setDetailCarePlaceId(e.target.value))}
            disabled={medicalConsultation.id > 0}
            required
          />

          {medicalConsultation.detail_care.consultation_type_id === ConsultationType.EMERGENCY_ID && (
            <div className="col-span-2">
              <div className="mb-4 text-12">¿Se derivó a clínica? *</div>
              <div className="flex gap-8">
                <FCheck
                  value={medicalConsultation.detail_care.referred_to_clinic === 1}
                  onChange={e => dispatch(Actions.setDetailCareReferredToClinic(1))}
                  label="Si"
                  disabled={medicalConsultation.id > 0}
                />
                <FCheck
                  value={medicalConsultation.detail_care.referred_to_clinic === 0}
                  onChange={e => dispatch(Actions.setDetailCareReferredToClinic(0))}
                  label="No"
                  disabled={medicalConsultation.id > 0}
                />
              </div>
            </div>
          )}

          <FText
            className="bg-white"
            label="Anamnesis"
            rows={5}
            value={medicalConsultation.detail_care.anamnesis}
            onChange={e => dispatch(Actions.setDetailCareAnamnesis(e.target.value))}
            disabled={medicalConsultation.id > 0}
            multiline
            required
          />

          <FText
            className="bg-white"
            label="Examen físico"
            value={medicalConsultation.detail_care.physical_exam}
            onChange={e => dispatch(Actions.setDetailCarePhysicalExam(e.target.value))}
            rows={5}
            disabled={medicalConsultation.id > 0}
            multiline
            required
          />

          <div>
            <div className="mb-4 text-12">Tiempo de enfermedad</div>
            <div className="flex gap-4">
              <TextField
                size="small"
                className="w-72 bg-white"
                variant="outlined"
                label="N°"
                value={medicalConsultation.detail_care.sick_time_count}
                onChange={handleChangeSickTimeCount}
                disabled={medicalConsultation.id > 0}
                required
              />

              <FSelectLocal
                className="bg-white"
                endpoint="/dropdown-options/illness-quantity-types"
                label="Unidad de tiempo"
                value={medicalConsultation.detail_care.sick_time_unit_time_id}
                onChange={e => dispatch(Actions.setDetailCareSickTimeUnitTimeId(e.target.value))}
                disabled={medicalConsultation.id > 0}
                required
              />
            </div>
          </div>

          <div />

          <div className="col-span-2">
            <div className="mb-4 text-12">Signos Vitales</div>
            <div className="flex gap-32">
              <div className="flex gap-8 items-center">
                <div>FC:*</div>
                <TextField
                  size="small"
                  className="w-72 bg-white"
                  variant="outlined"
                  placeholder="000"
                  value={medicalConsultation.detail_care.fc}
                  onChange={e => handleChangeVitalSigns(e, 'fc')}
                  disabled={medicalConsultation.id > 0}
                />
                <div>x'</div>
              </div>
              <div className="flex gap-8 items-center">
                <div>FR:*</div>
                <TextField
                  size="small"
                  className="w-72 bg-white"
                  variant="outlined"
                  placeholder="000"
                  value={medicalConsultation.detail_care.fr}
                  onChange={e => handleChangeVitalSigns(e, 'fr')}
                  disabled={medicalConsultation.id > 0}
                />
                <div>x'</div>
              </div>
              <div className="flex gap-8 items-center">
                <div>T°:*</div>
                <TextField
                  size="small"
                  className="w-72 bg-white"
                  variant="outlined"
                  placeholder="00.00"
                  value={medicalConsultation.detail_care.t}
                  onChange={e => handleChangeVitalSigns(e, 't')}
                  disabled={medicalConsultation.id > 0}
                />
                <div>C°</div>
              </div>
              <div className="flex gap-8 items-center">
                <div>PA°:*</div>
                <TextField
                  size="small"
                  className="bg-white"
                  style={{ width: 90 }}
                  variant="outlined"
                  placeholder="000/000"
                  value={medicalConsultation.detail_care.pa}
                  onChange={e => handleChangeVitalSigns(e, 'pa')}
                  disabled={medicalConsultation.id > 0}
                />
                <div>mmHg</div>
              </div>
              <div className="flex gap-8 items-center">
                <div>StO2:*</div>
                <TextField
                  size="small"
                  className="w-72 bg-white"
                  variant="outlined"
                  placeholder="00.00"
                  value={medicalConsultation.detail_care.sto2}
                  onChange={e => handleChangeVitalSigns(e, 'sto2')}
                  disabled={medicalConsultation.id > 0}
                />
                <div>%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-32">
        <Typography
          variant="h6"
          className="font-semibold text-16 mb-20"
        >
          Diagnóstico
        </Typography>

        <div className="grid grid-cols-2 gap-16 bg-grey-50 border border-bg-grey-200 rounded-8 p-24">
          <div className="flex gap-8">
            <div className="flex-1">
              <FSelectAjax
                zIndex={20}
                fil={
                  authUser.data?.proffesion_id === Proffesion.GENERAL_PHYSICIAN_ID
                    ? { diagnosis_type_id: DiagnosisType.CIE10_ID }
                    : authUser.data?.proffesion_id === Proffesion.DEGREE_IN_NURSING_ID
                    ? { diagnosis_type_id: DiagnosisType.NANDA_ID }
                    : {}
                }
                className="bg-white mb-4"
                endpoint="/dropdown-options/diagnoses"
                label="Diagnóstico principal"
                value={
                  medicalConsultation.diagnosis.main_diagnostic_id > 0
                    ? {
                        id: medicalConsultation.diagnosis.main_diagnostic_id,
                        name: medicalConsultation.diagnosis.main_name,
                      }
                    : null
                }
                onChange={value => {
                  if (value) {
                    dispatch(Actions.setDiagnosisMainDiagnosticId(value.id));
                    dispatch(Actions.setDiagnosisMainName(value.name));
                    dispatch(Actions.setDiagnosisMainCode(value.code));
                  } else {
                    dispatch(Actions.setDiagnosisMainDiagnosticId(''));
                    dispatch(Actions.setDiagnosisMainName(''));
                    dispatch(Actions.setDiagnosisMainCode(''));
                  }
                }}
                disabled={medicalConsultation.id > 0}
                required
              />
              {/* <div className="text-12 text-grey-500">Busca el diagnóstico</div> */}
            </div>
            <div>
              <FText
                InputProps={{
                  readOnly: true,
                }}
                className="bg-white w-200"
                label="Código de diagnóstico"
                value={medicalConsultation.diagnosis.main_code}
                disabled={medicalConsultation.id > 0}
                required
              />
            </div>
          </div>

          <div className="flex gap-8">
            <div className="flex-1">
              <FSelectAjax
                fil={
                  authUser.data?.proffesion_id === Proffesion.GENERAL_PHYSICIAN_ID
                    ? { diagnosis_type_id: DiagnosisType.CIE10_ID }
                    : authUser.data?.proffesion_id === Proffesion.DEGREE_IN_NURSING_ID
                    ? { diagnosis_type_id: DiagnosisType.NANDA_ID }
                    : {}
                }
                className="bg-white mb-4"
                endpoint="/dropdown-options/diagnoses"
                label="Diagnóstico secundario"
                value={
                  medicalConsultation.diagnosis.secondary_diagnostic_id > 0
                    ? {
                        id: medicalConsultation.diagnosis.secondary_diagnostic_id,
                        name: medicalConsultation.diagnosis.secondary_name,
                      }
                    : null
                }
                onChange={value => {
                  if (value) {
                    dispatch(Actions.setDiagnosisSecondaryDiagnosticId(value.id));
                    dispatch(Actions.setDiagnosisSecondaryName(value.name));
                    dispatch(Actions.setDiagnosisSecondaryCode(value.code));
                  } else {
                    dispatch(Actions.setDiagnosisSecondaryDiagnosticId(''));
                    dispatch(Actions.setDiagnosisSecondaryName(''));
                    dispatch(Actions.setDiagnosisSecondaryCode(''));
                  }
                }}
                disabled={medicalConsultation.id > 0}
                // required
              />
              {/* <div className="text-12 text-grey-500">Busca el diagnóstico</div> */}
            </div>
            <div>
              <FText
                className="bg-white w-200"
                label="Código de diagnóstico"
                value={medicalConsultation.diagnosis.secondary_code}
                disabled={medicalConsultation.id > 0}
                // required
              />
            </div>
          </div>

          <div className="flex gap-8">
            <div className="flex-1">
              <div className="mb-4 text-12">Tipo sistema involucrado</div>
              <FSelectLocal
                className="bg-white mb-4"
                endpoint="/dropdown-options/biological-systems"
                label="Sistema involucrado"
                value={medicalConsultation.diagnosis.system_type_id}
                onChange={e => dispatch(Actions.setDiagnosisSystemTypeId(e.target.value))}
                disabled={medicalConsultation.id > 0}
                required
              />
              <div className="text-12 text-grey-500">Para categorizar el diagnóstico elige un sistema</div>
            </div>
          </div>

          <div>
            <div className="mb-4 text-12">¿Salud mental involucrada? *</div>
            <div className="flex gap-8">
              <FCheck
                value={medicalConsultation.diagnosis.mental_health_involved === 1}
                onChange={e => dispatch(Actions.setDiagnosisMentalHealthInvolved(1))}
                disabled={medicalConsultation.id > 0}
                label="Si"
              />
              <FCheck
                value={medicalConsultation.diagnosis.mental_health_involved === 0}
                onChange={e => dispatch(Actions.setDiagnosisMentalHealthInvolved(0))}
                disabled={medicalConsultation.id > 0}
                label="No"
              />
            </div>
          </div>

          {/* <div>
            <div className="mb-4 text-12">¿Se emitió descanso médico?</div>
            <div className="flex gap-8">
              <FCheck
                value={medicalConsultation.diagnosis.has_medical_rest === 1}
                onChange={e => dispatch(Actions.setDiagnosisHasMedicalRest(1))}
                disabled={medicalConsultation.id > 0}
                label="Si"
              />
              <FCheck
                value={medicalConsultation.diagnosis.has_medical_rest === 0}
                onChange={e => {
                  dispatch(Actions.setDiagnosisHasMedicalRest(0));
                  dispatch(Actions.setDiagnosisMedicalRestStartDate(''));
                  dispatch(Actions.setDiagnosisMedicalRestEndDate(''));
                }}
                disabled={medicalConsultation.id > 0}
                label="No"
              />
            </div>
          </div> */}

          {medicalConsultation.diagnosis.has_medical_rest === 1 && (
            <div className="flex items-end gap-8">
              <div className="flex-1">
                <FText
                  className="bg-white"
                  label="Inicio de descanso"
                  value={medicalConsultation.diagnosis.medical_rest_start_date}
                  onChange={e => {
                    dispatch(Actions.setDiagnosisMedicalRestStartDate(e.target.value));
                  }}
                  type="date"
                  disabled={medicalConsultation.id > 0}
                  required
                />
              </div>
              <div className="flex-1">
                <FText
                  className="bg-white"
                  label="Fin de descanso"
                  value={medicalConsultation.diagnosis.medical_rest_end_date}
                  onChange={e => {
                    dispatch(Actions.setDiagnosisMedicalRestEndDate(e.target.value));
                  }}
                  type="date"
                  inputProps={{
                    min: medicalConsultation.diagnosis.medical_rest_start_date,
                  }}
                  disabled={!medicalConsultation.diagnosis.medical_rest_start_date || medicalConsultation.id > 0}
                  required
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-32">
        <Typography
          variant="h6"
          className="font-semibold text-16 mb-20"
        >
          Prescripción
        </Typography>

        <div className="grid grid-cols-2 gap-16 bg-grey-50 border border-bg-grey-200 rounded-8 p-24">
          <div>
            <FSelectAjax
              zIndex={10}
              className="bg-white mb-4"
              endpoint="/dropdown-options/medicines"
              label="Medicamento recetado"
              value={
                medicalConsultation.prescription.medicine_id > 0
                  ? {
                      id: medicalConsultation.prescription.medicine_id,
                      name: medicalConsultation.prescription.medicine_name,
                    }
                  : null
              }
              onChange={value => {
                if (value) {
                  dispatch(Actions.setPrescriptionMedicineId(value.id));
                  dispatch(Actions.setPrescriptionMedicineName(value.name));
                } else {
                  dispatch(Actions.setPrescriptionMedicineId(''));
                  dispatch(Actions.setPrescriptionMedicineName(''));
                }
              }}
              disabled={medicalConsultation.id > 0}
              // required
            />
            {/* <div className="text-12 text-grey-500">Busca el medicamento recetado</div> */}
          </div>

          <FText
            className="bg-white"
            label="Plan de trabajo"
            rows={5}
            value={medicalConsultation.prescription.workplan}
            onChange={e => dispatch(Actions.setPrescriptionWorkplan(e.target.value))}
            disabled={medicalConsultation.id > 0}
            multiline
            required
          />

          <FText
            className="bg-white col-span-2"
            label="Observación (opcional)"
            value={medicalConsultation.prescription.observation}
            onChange={e => dispatch(Actions.setPrescriptionObservation(e.target.value))}
            disabled={medicalConsultation.id > 0}
            rows={5}
            multiline
          />
        </div>
      </div>

      <div
        className="flex gap-16 justify-end"
        aria-label="next"
      >
        {medicalConsultation.id > 0 ? (
          <>
            <SButton
              variant="outlined"
              className="text-black w-216"
              onClick={() => dispatch(Actions.setStep(0))}
            >
              Anterior
            </SButton>
            {!_authUser.isAdmin() && (
              <SButton
              onClick={() => {
                if (window.location.pathname !== '/medical-consultations') {
                  history.push('/medical-consultations');
                } else {
                  dispatch(Actions.resetState());
                }
              }}
              className="w-216"
            >
              Nueva Consulta
            </SButton>
            )}
          </>
        ) : (
          <>
            <SButton
              variant="outlined"
              className="text-black w-216"
              onClick={() => dispatch(Actions.setStep(0))}
            >
              Anterior
            </SButton>
            <SButton
              variant="outlined"
              className="text-black w-216"
              onClick={() => Alert.confirm(() => dispatch(Actions.resetState()))}
            >
              Cancelar
            </SButton>
            <SButton
              onClick={handleRegisterConsultation}
              className="w-216"
              endIcon={<KeyboardArrowRightIcon />}
            >
              Registrar consulta
            </SButton>
          </>
        )}
      </div>
    </div>
  );
};

MedicalConsultationsCareData.propTypes = {};

export default MedicalConsultationsCareData;
