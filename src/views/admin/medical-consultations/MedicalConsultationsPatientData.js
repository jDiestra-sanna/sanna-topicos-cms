import { Button, TextField, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from 'app/store/actions/sanna/medical-consultation.actions';
import Api from 'inc/Apiv2';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import clsx from 'clsx';
import DocumentType from 'models/document-type';
import FCheck from 'widgets/fields/FCheck';
import FSelectLocal from 'widgets/fields/FSelectLocal';
import FText from 'widgets/fields/FText';
import history from '@history';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import moment from 'moment';
import Patient, { PatientRoleId } from 'models/patient';
import PropTypes from 'prop-types';
import React from 'react';
import SButton from 'widgets/sanna/Button';
import SearchIcon from '@material-ui/icons/Search';
import Toast from 'inc/Toast';
import Util, { InputUtils } from 'inc/Utils';
import useAuthUser from 'hooks/auth-user';

const PatientsData = props => {
  const dispatch = useDispatch();
  const medicalConsultation = useSelector(({ sanna }) => sanna.medicalConsultation);
  const currentDate = moment().format('YYYY-MM-DD');
  const currentHour = moment().format('hh');
  const currentMins = moment().format('mm');
  const currentAMPM = moment().format('A');
  const authUser = useAuthUser();


  React.useLayoutEffect(() => {
    if (!medicalConsultation.is_first_load || medicalConsultation.id > 0) return;
    setTimeout(() => {
      dispatch(Actions.setAttendanceDate(currentDate));
      dispatch(Actions.setAttendanceTimeHour(currentHour));
      dispatch(Actions.setAttendanceTimeMin(currentMins));
      dispatch(Actions.setAttendanceTimeAMPM(currentAMPM));
      dispatch(Actions.setFirstLoad(false));
    }, 200);
  }, [medicalConsultation.is_first_load, medicalConsultation.id]);

  const handleChangeHour = e => {
    const inputValue = e.target.value;
    // Expresión regular para validar si el valor es un número entre 01 y 12
    const regex = /^(0?[1-9]|1[0-2]|0)$/;

    if (regex.test(inputValue) || inputValue === '') {
      dispatch(Actions.setAttendanceTimeHour(inputValue));
    }
  };

  const handleChangeMin = e => {
    const inputValue = e.target.value;
    // Expresión regular para validar si el valor es un número entre 00 y 59
    const regex = /^(0?[0-9]|[1-5][0-9])$/;

    if (inputValue === '' || regex.test(inputValue)) {
      dispatch(Actions.setAttendanceTimeMin(inputValue));
    }
  };

  const handleNext = () => {
    // fecha de atención
    if (!medicalConsultation.attendance_date) {
      return Toast.warning('Debe ingresar la fecha de atención');
    }
    if (!(medicalConsultation.attendance_time_hour.trim() > 0)) {
      return Toast.warning('Debe ingresar la hora de atención correctamente');
    }
    if (!medicalConsultation.attendance_time_min.trim()) {
      return Toast.warning('Debe ingresar el hora de atención correctamente');
    }
    if (!isOkAttendanceTime()) {
      return Toast.warning('La hora de atención debe ser menor o igual a la hora actual');
    }
    // datos del paciente
    if (!medicalConsultation.patient.document_type_id) {
      return Toast.warning('Debe ingresar el tipo de documento');
    }
    if (!medicalConsultation.patient.document_number.trim()) {
      return Toast.warning('Debe ingresar el número de documento');
    }
    if (medicalConsultation.patient.contact_number && medicalConsultation.patient.contact_number.length !== 9) {
      return Toast.warning('El número de contacto debe tener 9 dígitos');
    }
    if (!medicalConsultation.patient.paternal_surname.trim()) {
      return Toast.warning('Debe ingresar el apellido paterno');
    }
    if (!medicalConsultation.patient.maternal_surname.trim()) {
      return Toast.warning('Debe ingresar el apellido materno');
    }
    if (!medicalConsultation.patient.name.trim()) {
      return Toast.warning('Debe ingresar el nombre');
    }
    if (!medicalConsultation.patient.birth_date) {
      return Toast.warning('Debe ingresar la fecha de nacimiento');
    }
    if (!medicalConsultation.patient.age) {
      return Toast.warning('Debe ingresar la fecha correctamente para que se calcule la edad');
    }
    if (medicalConsultation.patient.age < Patient.ADULTHOOD && medicalConsultation.patient.age !== '') {
      if (!medicalConsultation.patient.childs_guardian_surname.trim())
        return Toast.warning('Paciente menor de edad, debe ingresar los apellidos del apoderado');
      if (!medicalConsultation.patient.childs_guardian_name.trim())
        return Toast.warning('Paciente menor de edad, debe ingresar los nombres del apoderado');
      if (!medicalConsultation.patient.childs_guardian_contact_number.trim())
        return Toast.warning('Paciente menor de edad, debe ingresar el número de contacto del apoderado');
      if (medicalConsultation.patient.childs_guardian_contact_number.length !== 9)
        return Toast.warning('El numero de contacto del apoderado debe tener 9 dígitos');
    }

    if (!medicalConsultation.patient.sex_id) {
      return Toast.warning('Debe seleccionar el sexo');
    }
    if (!medicalConsultation.patient.role_id) {
      return Toast.warning('Debe seleccionar el perfil del paciente');
    }
    if (
      medicalConsultation.patient.role_id === PatientRoleId.OTRO_ID &&
      !medicalConsultation.patient.role_other_description.trim()
    ) {
      return Toast.warning('Si el perfil del paciente es "Otro", debe ingresar una descripción del perfil');
    }
    // alergias
    if (!medicalConsultation.allergies.food.trim()) {
      return Toast.warning('El campo alergia alimentaria es requerido');
    }
    if (!medicalConsultation.allergies.drug.trim()) {
      return Toast.warning('El campo alergia medicamentosa es requerido');
    }
    // antecedentes médicos
    if (!medicalConsultation.medical_history.surgical_history.trim()) {
      return Toast.warning('Debe ingresar los antecedentes quirúrgicos');
    }
    if (
      medicalConsultation.medical_history.has_psychological_condition &&
      !medicalConsultation.medical_history.psychological_condition_description.trim()
    ) {
      return Toast.warning('Si el paciente tiene "Condición psicológica" debe ingresar el detalle');
    }
    if (
      medicalConsultation.medical_history.has_other > 0 &&
      !medicalConsultation.medical_history.other_description.trim()
    ) {
      return Toast.warning('Si el antecedente médico es "Otro", debe ingresar una descripción');
    }

    dispatch(Actions.setStep(1));
  };

  // si la fecha de atencion es igual a la fecha actual la hora de atencion debe ser menor o igual a la hora actual
  // si la fecha de atencion es diferente a la fecha actual la hora de atencion puede ser cualquiera
  const isOkAttendanceTime = () => {
    if (medicalConsultation.attendance_date !== currentDate) return true;

    const timeHour = medicalConsultation.attendance_time_hour.padStart(2, '0');
    const timeMin = medicalConsultation.attendance_time_min.padStart(2, '0');
    const startHour = `${timeHour}:${timeMin} ${medicalConsultation.attendance_time_ampm}`;
    const currentHour = moment().format('hh:mm A');
    const startHourMoment = moment(startHour, 'hh:mm A');
    const currentHourMoment = moment(currentHour, 'hh:mm A');
    const oneMinuteLater = currentHourMoment.add(1, 'minute');

    return startHourMoment.isBefore(oneMinuteLater);
  };

  const findClient = async () => {
    const query = {
      document_number: medicalConsultation.patient.document_number.trim(),
      document_type: medicalConsultation.patient.document_type_id,
    };
    const response = await Api.get('/medical-consultations/patient', query, 'Buscando datos del paciente');
    if (response.statusCode >= 500) return Toast.error(response.message);
    if (response.statusCode === 404) return Toast.info('El paciente no se encuentra registrado, proceda a registrarlo');
    if (response.statusCode >= 400) return Toast.warning(response.message);

    const patient = response.data;

    dispatch(
      Actions.setPatient({
        id: patient.id,
        document_type_id: patient.document_type_id,
        document_number: patient.document_number,
        contact_number: patient.contact_number,
        name: patient.name,
        paternal_surname: patient.surname_first,
        maternal_surname: patient.surname_second,
        birth_date: patient.birthdate,
        age: patient.age,
        sex_id: patient.sex_id,
        childs_guardian_surname: patient.minor_attorney_surnames,
        childs_guardian_name: patient.minor_attorney_names,
        childs_guardian_contact_number: patient.minor_attorney_contact_number,
        role_id: patient.patient_profile.id,
        role_name: patient.patient_profile.name,
        role_other_description: patient.other_profile,
      }),
    );

    dispatch(
      Actions.setAllergies({
        food: patient.allergy.food_allergy,
        drug: patient.allergy.drug_allergy,
      }),
    );

    dispatch(
      Actions.setMedicalHistory({
        surgical_history: patient.medical_history.surgical_history,
        has_hypertension: patient.medical_history.hypertension ? 1 : 0,
        has_asthma: patient.medical_history.asthma ? 1 : 0,
        has_cancer: patient.medical_history.cancer ? 1 : 0,
        has_diabetes: patient.medical_history.diabetes ? 1 : 0,
        has_epilepsy: patient.medical_history.epilepsy ? 1 : 0,
        has_psychological_condition: patient.medical_history.psychological_condition ? 1 : 0,
        psychological_condition_description: patient.medical_history.observation,
        has_other: patient.medical_history.others ? 1 : 0,
        other_description: patient.medical_history.others_description,
      }),
    );
  };

  return (
    <div>
      <div className="mb-32">
        <Typography
          variant="h6"
          className="font-semibold text-16 mb-20"
        >
          Fecha y hora de atención
        </Typography>

        <div className="flex gap-16 bg-grey-50 border border-bg-grey-200 rounded-8 p-24">
          <TextField
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              max: currentDate,
            }}
            className="w-192 bg-white"
            type="date"
            variant="outlined"
            label="Fecha de atención"
            value={medicalConsultation.attendance_date}
            onChange={e => dispatch(Actions.setAttendanceDate(e.target.value))}
            disabled={medicalConsultation.id > 0}
            required
          />

          <div className="flex items-center gap-8">
            <TextField
              size="small"
              className="w-56 bg-white"
              variant="outlined"
              value={medicalConsultation.attendance_time_hour}
              onChange={handleChangeHour}
              label="Hor"
              disabled={medicalConsultation.id > 0}
              required
            />
            <div className="text-24 leading-none">:</div>
            <TextField
              size="small"
              className="w-56 bg-white"
              variant="outlined"
              value={medicalConsultation.attendance_time_min}
              onChange={handleChangeMin}
              label="Min"
              disabled={medicalConsultation.id > 0}
              required
            />
            <div className="flex flex-col">
              <Button
                variant="contained"
                color="secondary"
                className={clsx(
                  'rounded-b-none leading-none shadow-none hover:shadow-none',
                  medicalConsultation.attendance_time_ampm === 'PM' &&
                    'bg-muisecondary-light text-black hover:bg-muisecondary-light',
                  medicalConsultation.id > 0 && 'pointer-events-none',
                )}
                style={{ fontWeight: 400, textTransform: 'none', height: 18 }}
                onClick={_ => dispatch(Actions.setAttendanceTimeAMPM('AM'))}
              >
                am
              </Button>
              <Button
                variant="contained"
                color="secondary"
                className={clsx(
                  'rounded-t-none leading-none shadow-none hover:shadow-none',
                  (medicalConsultation.attendance_time_ampm === 'AM' ||
                    medicalConsultation.attendance_time_ampm === '') &&
                    'bg-muisecondary-light text-black hover:bg-muisecondary-light',
                  medicalConsultation.id > 0 && 'pointer-events-none',
                )}
                style={{ fontWeight: 400, textTransform: 'none', height: 18 }}
                onClick={_ => dispatch(Actions.setAttendanceTimeAMPM('PM'))}
              >
                pm
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-32">
        <Typography
          variant="h6"
          className="font-semibold text-16"
        >
          Datos personales del paciente
        </Typography>

        <Typography
          variant="subtitle1"
          className="mb-20 text-14"
        >
          Ingresa el tipo de documento y número de documento del paciente para buscar su información
        </Typography>

        <div className="grid grid-cols-3 gap-20 bg-grey-50 border border-bg-grey-200 rounded-8 p-24">
          <FSelectLocal
            endpoint="/dropdown-options/document-types"
            label="Tipo de documento"
            className="bg-white"
            value={medicalConsultation.patient.document_type_id}
            onChange={e => {
              dispatch(Actions.setPatientDocumentTypeId(e.target.value));
              dispatch(Actions.setPatientDocumentNumber(''));
            }}
            disabled={medicalConsultation.id > 0}
            required
          />
          <div className="flex">
            <FText
              className="bg-white"
              label="Número de documento"
              value={medicalConsultation.patient.document_number}
              onChange={e => dispatch(Actions.setPatientDocumentNumber(e.target.value))}
              disabled={medicalConsultation.id > 0}
              onBlur={e => {
                let value = e.target.value;
                if (!value || !medicalConsultation.patient.document_type_id) return;
                const length = medicalConsultation.patient.document_type_id == DocumentType.DNI_ID ? 8 : 12;
                value = value.padStart(length, '0');
                dispatch(Actions.setPatientDocumentNumber(value));
              }}
              onKeyPress={e => InputUtils.onlyNumbers(e)}
              inputProps={{ maxLength: medicalConsultation.patient.document_type_id == DocumentType.DNI_ID ? 8 : 12 }}
              required
            />
            <Button
              onClick={findClient}
              variant="outlined"
              color="secondary"
              className="bg-muisecondary-light"
              disabled={medicalConsultation.id > 0}
            >
              <SearchIcon />
            </Button>
          </div>

          <FText
            className="bg-white"
            label="Número de contacto"
            value={medicalConsultation.patient.contact_number}
            onChange={e => dispatch(Actions.setPatientContactNumber(e.target.value))}
            disabled={medicalConsultation.id > 0}
            onKeyPress={e => InputUtils.onlyNumbers(e)}
            inputProps={{ maxLength: 9 }}
            required
          />

          <FText
            className="bg-white"
            label="Apellido paterno"
            value={medicalConsultation.patient.paternal_surname}
            onChange={e => dispatch(Actions.setPatientPaternalSurname(e.target.value))}
            onKeyPress={e => {
              if (InputUtils.onlyLetters(e, { spaces: true })) {
                dispatch(Actions.setPatientPaternalSurname(e.target.value));
              }
            }}
            inputProps={{ maxLength: 50 }}
            disabled={medicalConsultation.id > 0}
            required
          />

          <FText
            className="bg-white"
            label="Apellido materno"
            value={medicalConsultation.patient.maternal_surname}
            onChange={e => dispatch(Actions.setPatientMaternalSurname(e.target.value))}
            onKeyPress={e => {
              if (InputUtils.onlyLetters(e, { spaces: true })) {
                dispatch(Actions.setPatientMaternalSurname(e.target.value));
              }
            }}
            inputProps={{ maxLength: 50 }}
            disabled={medicalConsultation.id > 0}
            required
          />

          <FText
            className="bg-white"
            label="Nombres"
            value={medicalConsultation.patient.name}
            onChange={e => dispatch(Actions.setPatientName(e.target.value))}
            onKeyPress={e => {
              if (InputUtils.onlyLetters(e, { spaces: true })) {
                dispatch(Actions.setPatientName(e.target.value));
              }
            }}
            inputProps={{ maxLength: 50 }}
            disabled={medicalConsultation.id > 0}
            required
          />

          <FText
            className="bg-white"
            label="Fecha de nacimiento"
            value={medicalConsultation.patient.birth_date}
            onChange={e => {
              const date = e.target.value;
              if (date) {
                const age = Util.getAgeFromDate(date);
                dispatch(Actions.setPatientAge(age));

                if (age >= Patient.ADULTHOOD) {
                  dispatch(Actions.setPatientChildGuardianSurname(''));
                  dispatch(Actions.setPatientChildGuardianName(''));
                  dispatch(Actions.setPatientChildGuardianContactNumber(''));
                }
              } else {
                dispatch(Actions.setPatientAge(''));
              }

              dispatch(Actions.setPatientBirthDate(e.target.value));
            }}
            type="date"
            inputProps={{
              max: currentDate,
            }}
            disabled={medicalConsultation.id > 0}
            required
          />

          <FText
            className="bg-white"
            label="Edad del paciente"
            value={
              medicalConsultation.patient.age > 0 || medicalConsultation.patient.age === 0
                ? medicalConsultation.patient.age + ' años'
                : ''
            }
            onChange={e => {}}
            InputProps={{
              readOnly: true,
            }}
            disabled={medicalConsultation.id > 0}
            required
          />

          <FSelectLocal
            className="bg-white"
            endpoint="/dropdown-options/sexes"
            value={medicalConsultation.patient.sex_id}
            onChange={e => dispatch(Actions.setPatientSexId(e.target.value))}
            label="Sexo"
            disabled={medicalConsultation.id > 0}
            required
          />

          {medicalConsultation.patient.age < Patient.ADULTHOOD && medicalConsultation.patient.age !== '' && (
            <>
              <div className="col-span-3 px-16 py-8 bg-muisecondary text-white rounded-8">
                <div className="flex items-center gap-8">
                  <CheckCircleIcon />
                  <Typography>Paciente menor de edad, revise protocolos</Typography>
                </div>
              </div>

              <FText
                className="bg-white"
                label="Apellidos del apoderado"
                value={medicalConsultation.patient.childs_guardian_surname}
                onChange={e => dispatch(Actions.setPatientChildGuardianSurname(e.target.value))}
                onKeyPress={e => {
                  if (InputUtils.onlyLetters(e, { spaces: true })) {
                    dispatch(Actions.setPatientChildGuardianSurname(e.target.value));
                  }
                }}
                inputProps={{ maxLength: 50 }}
                disabled={medicalConsultation.id > 0}
                required
              />

              <FText
                className="bg-white"
                label="Nombres del apoderado"
                value={medicalConsultation.patient.childs_guardian_name}
                onChange={e => dispatch(Actions.setPatientChildGuardianName(e.target.value))}
                onKeyPress={e => {
                  if (InputUtils.onlyLetters(e, { spaces: true })) {
                    dispatch(Actions.setPatientChildGuardianName(e.target.value));
                  }
                }}
                inputProps={{ maxLength: 50 }}
                disabled={medicalConsultation.id > 0}
                required
              />

              <FText
                className="bg-white"
                label="Número de contacto del apoderado"
                value={medicalConsultation.patient.childs_guardian_contact_number}
                onChange={e => dispatch(Actions.setPatientChildGuardianContactNumber(e.target.value))}
                disabled={medicalConsultation.id > 0}
                onKeyPress={e => InputUtils.onlyNumbers(e)}
                inputProps={{ maxLength: 9 }}
                required
              />
            </>
          )}

          <div>
            <FSelectLocal
              className="bg-white"
              endpoint="/dropdown-options/patient-profiles"
              label="Perfil del paciente"
              value={medicalConsultation.patient.role_id}
              onChangeObject={data => {
                if (!data) return;
                dispatch(Actions.setPatientRoleId(data.id));
                dispatch(Actions.setPatientRoleName(data.name));
                dispatch(Actions.setPatientRoleOtherDescription(''));
              }}
              disabled={medicalConsultation.id > 0}
              required
            />
          </div>

          <TextField
            className="bg-white"
            size="small"
            variant="outlined"
            label="Otro (opcional)"
            helperText="En caso elegiste “OTRO”, describe el perfil"
            FormHelperTextProps={{
              className: 'bg-grey-50 m-0 pt-4',
            }}
            value={medicalConsultation.patient.role_other_description}
            onChange={e => dispatch(Actions.setPatientRoleOtherDescription(e.target.value))}
            disabled={medicalConsultation.id > 0 || medicalConsultation.patient.role_id !== PatientRoleId.OTRO_ID}
          />
        </div>
      </div>

      <div className="mb-32">
        <Typography
          variant="h6"
          className="font-semibold text-16 mb-20"
        >
          Alergias
        </Typography>

        <div className="grid grid-cols-2 gap-20 bg-grey-50 border border-bg-grey-200 rounded-8 p-24">
          <FText
            className="bg-white"
            label="Alergia alimentaria"
            rows={5}
            value={medicalConsultation.allergies.food}
            onChange={e => dispatch(Actions.setAllergiesFood(e.target.value))}
            disabled={medicalConsultation.id > 0}
            multiline
            required
          />

          <FText
            className="bg-white"
            label="Alergia medicamentosa"
            rows={5}
            value={medicalConsultation.allergies.drug}
            onChange={e => dispatch(Actions.setAllergiesDrug(e.target.value))}
            disabled={medicalConsultation.id > 0}
            multiline
            required
          />
        </div>
      </div>

      <div className="mb-32">
        <Typography
          variant="h6"
          className="font-semibold text-16 mb-20"
        >
          Antecedentes médicos
        </Typography>

        <div className="flex flex-col gap-16 bg-grey-50 border border-bg-grey-200 rounded-8 p-24">
          <FText
            className="bg-white"
            label="Antecedentes quirúrgicos"
            rows={4}
            value={medicalConsultation.medical_history.surgical_history}
            onChange={e => dispatch(Actions.setMedicalHistorySurgicalHistory(e.target.value))}
            disabled={medicalConsultation.id > 0}
            multiline
            required
          />

          <div className="grid grid-cols-7">
            <FCheck
              label="Hipertensión"
              value={medicalConsultation.medical_history.has_hypertension}
              onChange={e => dispatch(Actions.setMedicalHistoryHypertension(e.target.checked ? 1 : 0))}
              disabled={medicalConsultation.id > 0}
            />
            <FCheck
              value={medicalConsultation.medical_history.has_asthma}
              onChange={e => dispatch(Actions.setMedicalHistoryAsthma(e.target.checked ? 1 : 0))}
              label="Asma"
              disabled={medicalConsultation.id > 0}
            />
            <FCheck
              value={medicalConsultation.medical_history.has_cancer}
              onChange={e => dispatch(Actions.setMedicalHistoryCancer(e.target.checked ? 1 : 0))}
              label="Cáncer"
              disabled={medicalConsultation.id > 0}
            />
            <FCheck
              value={medicalConsultation.medical_history.has_diabetes}
              onChange={e => dispatch(Actions.setMedicalHistoryDiabetes(e.target.checked ? 1 : 0))}
              label="Diabetes"
              disabled={medicalConsultation.id > 0}
            />
            <FCheck
              value={medicalConsultation.medical_history.has_epilepsy}
              onChange={e => dispatch(Actions.setMedicalHistoryEpilepsy(e.target.checked ? 1 : 0))}
              label="Epilepsia"
              disabled={medicalConsultation.id > 0}
            />
            <FCheck
              value={medicalConsultation.medical_history.has_psychological_condition}
              onChange={e => {
                const checked = e.target.checked;
                dispatch(Actions.setMedicalHistoryPsychologicalCondition(checked ? 1 : 0));
                dispatch(Actions.setMedicalHistoryPsychologicalConditionDescription(''));
              }}
              label="Condición psicológica"
              disabled={medicalConsultation.id > 0}
            />
            <FCheck
              value={medicalConsultation.medical_history.has_other}
              onChange={e => {
                dispatch(Actions.setMedicalHistoryOther(e.target.checked ? 1 : 0));
                dispatch(Actions.setMedicalHistoryOtherDescription(''));
              }}
              label="Otro"
              disabled={medicalConsultation.id > 0}
            />
          </div>

          {medicalConsultation.medical_history.has_psychological_condition > 0 && (
            <div>
              <TextField
                className="bg-white"
                fullWidth
                size="small"
                variant="outlined"
                label="Observación"
                helperText="Detalle la condición psicológica"
                FormHelperTextProps={{
                  className: 'bg-grey-50 m-0 pt-4',
                }}
                value={medicalConsultation.medical_history.psychological_condition_description}
                onChange={e => dispatch(Actions.setMedicalHistoryPsychologicalConditionDescription(e.target.value))}
                disabled={medicalConsultation.id > 0}
              />
            </div>
          )}

          <div>
            <TextField
              className="bg-white"
              fullWidth
              size="small"
              variant="outlined"
              label="Otro (opcional)"
              helperText="En caso elegiste “OTRO”, describe el antecedente"
              FormHelperTextProps={{
                className: 'bg-grey-50 m-0 pt-4',
              }}
              value={medicalConsultation.medical_history.other_description}
              onChange={e => dispatch(Actions.setMedicalHistoryOtherDescription(e.target.value))}
              disabled={medicalConsultation.id > 0 || !medicalConsultation.medical_history.has_other}
            />
          </div>
        </div>
      </div>

      <div
        className="flex justify-end gap-16"
        aria-label="next"
      >
        {medicalConsultation.id > 0 ? (
          <>
            <SButton
              variant="outlined"
              className="text-black w-216"
              onClick={() => dispatch(Actions.setStep(1))}
            >
              Siguiente
            </SButton>
            {!authUser.isAdmin() && (
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
          <SButton
            onClick={handleNext}
            endIcon={<KeyboardArrowRightIcon />}
          >
            Siguiente
          </SButton>
        )}
      </div>
    </div>
  );
};

PatientsData.propTypes = {};

export default PatientsData;
