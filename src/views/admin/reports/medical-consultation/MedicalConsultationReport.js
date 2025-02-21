import React, { useRef, useState } from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { getModuleByPath, humanDatetime } from 'inc/Utils';
import DaheadV2 from 'widgets/datable/DaheadV2';
import Datable from 'widgets/datable/DatableV2';
import Api from 'inc/Apiv2';

export default function (props) {
  const [module] = useState(() => getModuleByPath(props.route.path));

  const dahead = useRef(null);
  const datable = useRef(null);

  return (
    <FusePageCarded
      header={
        <DaheadV2
          {...props}
          ref={dahead}
          datable={datable}
          module={module}
          actions={[
            {
              label: `Descargar Reporte`,
              onClick: () => {
                Api.download(`/report-medical-consultations/export`, dahead.current.fil());
              },
            },
          ]}
          notQuery
        />
      }
      content={
        <Datable
          {...props}
          ref={datable}
          fil={() => dahead.current.fil()}
          module={module}
          columns={{
            id: { value: '#', order_col: 'medcon.id' },
            campus: { value: 'Sede', row: o => o.campus.name, order_col: 'ca.name' },
            user: { value: 'Profesional', row: o => o.user.name + ' ' + o.user.surname_first, order_col: 'us.name' },
            patient: {
              value: 'Paciente',
              row: o => o.patient.name + ' ' + o.patient.surname_first,
              order_col: 'pat.name',
            },
            consultation_type: {
              value: 'Tipo de consulta',
              row: o => o.attendance_detail.consultation_type.name,
              order_col: 'cty.name',
            },
            main_diagnosis: {
              value: 'Diagnostico principal',
              row: o => o.medical_diagnosis.main_diagnosis.name,
              order_col: 'maidiag.name',
            },
            prescription: {
              value: 'Prescripción',
              row: o => o.prescriptions[0]?.medicine?.name ?? '',
              order_col: 'medi.name',
            },
            attendance_date: {
              value: 'Fecha de atención',
              row: 'datetime',
              row: o => humanDatetime(o.attendance_date + ' ' + o.attendance_time),
              order_col: 'medcon.attendance_date',
            },
            attendance_place: {
              value: 'Lugar de atencion',
              detail: true,
              row: o => o.attendance_detail.attendance_place.name,
            },
            patient_surname_second: {
              value: 'Apellido materno del paciente',
              row: o => o.patient.surname_second,
              detail: true,
            },
            patient_age: { value: 'Edad del paciente', row: o => o.patient.age, detail: true },
            patient_birthdate: {
              value: 'Fecha de nacimiento del paciente',
              detail: true,
              row: o => o.patient.birthdate,
            },
            patient_gender: {
              value: 'Sexo del paciente',
              detail: true,
              row: o => o.patient.sex.name,
            },
            patient_profile: {
              value: 'Perfil del paciente',
              detail: true,
              row: o => o.patient.patient_profile.name,
            },
            patient_document_type: {
              value: 'Tipo de documento del paciente',
              detail: true,
              row: o => o.patient.document_type.name,
            },
            patient_document_number: {
              value: 'Numero de documento del paciente',
              detail: true,
              row: o => o.patient.document_number,
            },
            patient_food_allergy: {
              value: 'Alergia a alimentos',
              detail: true,
              row: o => o.patient.allergy.food_allergy,
            },
            patient_drug_allergy: {
              value: 'Alergia a medicamentos',
              detail: true,
              row: o => o.patient.allergy.drug_allergy,
            },
            patient_medical_history_surgical_history: {
              value: 'Historial quirurgico',
              detail: true,
              row: o => o.patient.medical_history.surgical_history,
            },
            patient_medical_history_hypertension: {
              value: 'Hipertension',
              detail: true,
              row: o => o.patient.medical_history.hypertension,
            },
            patient_medical_history_asthma: {
              value: 'Asma',
              detail: true,
              row: o => o.patient.medical_history.asthma,
            },
            patient_medical_history_surgical_cancer: {
              value: 'Cancer',
              detail: true,
              row: o => o.patient.medical_history.cancer,
            },
            patient_medical_history_surgical_diabetes: {
              value: 'Diabetes',
              detail: true,
              row: o => o.patient.medical_history.diabetes,
            },
            patient_medical_history_surgical_epilepsy: {
              value: 'Epilepsia',
              detail: true,
              row: o => o.patient.medical_history.epilepsy,
            },
            patient_medical_history_surgical_psychological_condition: {
              value: 'Condicion psicologica',
              detail: true,
              row: o => o.patient.medical_history.psychological_condition,
            },
            patient_medical_history_surgical_observation: {
              value: 'Observacion',
              detail: true,
              row: o => o.patient.medical_history.observation,
            },
            patient_medical_history_surgical_others: {
              value: 'Otros',
              detail: true,
              row: o => o.patient.medical_history.others,
            },
            patient_medical_history_surgical_others_description: {
              value: 'Descripcion de Otros',
              detail: true,
              row: o => o.patient.medical_history.others_description,
            },
            involves_mental_health: {
              value: 'Involucra salud mental',
              detail: true,
              row: o => o.medical_diagnosis.involves_mental_health,
            },
            biological_system: {
              value: 'Sistema biologico',
              detail: true,
              row: o => o.medical_diagnosis.biological_system.name,
            },
            main_diagnosis_code: {
              value: 'Codigo de diagnostico principal',
              detail: true,
              row: o => o.medical_diagnosis.main_diagnosis?.code ?? '',
            },
            secondary_diagnosis_code: {
              value: 'Codigo de diagnostico secundario',
              detail: true,
              row: o => o.medical_diagnosis.secondary_diagnosis?.code ?? '',
            },
            secondary_diagnosis: {
              value: 'Diagnostico secundario',
              detail: true,
              row: o => o.medical_diagnosis.secondary_diagnosis?.name ?? '',
            },
            document_type: {
              value: 'Tipo de documento del profesional',
              detail: true,
              row: o => o.user.document_type.name,
            },
            surname_second: {
              value: 'Apellido materno del profesional',
              detail: true,
              row: o => o.user.surname_second,
            },
            document_number: {
              value: 'Numero de documento del profesional',
              detail: true,
              row: o => o.user.document_number,
            },
            colegiatura: {
              value: 'Colegiatura del profesional',
              detail: true,
              row: o => o.user.colegiatura,
            },
            proffession: {
              value: 'Profesión',
              detail: true,
              row: o => o.user.proffession.name,
            },
          }}
        />
      }
    />
  );
}
