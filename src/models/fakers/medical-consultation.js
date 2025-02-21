import { faker } from '@faker-js/faker';
import Api from 'inc/Apiv2';
import moment from 'moment';

class MedicalConsultationFaker {
  static async generatePatient() {
    const preparePatientDataToSend = (
      isOtherProfile = false,
      isMinor = false,
      medicalHistoryPsychologicalCondition = false,
      medicalHistoryOthers = false,
    ) => {
      return {
        patient: {
          document_type_id: faker.number.int({ min: 1, max: 2 }),
          document_number: faker.number.int({ min: 10000000, max: 99999999 }).toString(),
          contact_number: faker.number.int({ min: 100000000, max: 999999999 }).toString(),
          surname_first: faker.person.lastName(),
          surname_second: faker.person.middleName(),
          name: faker.person.firstName(),
          birthdate: isMinor
            ? faker.date.between('2008-01-01', '2010-12-31')
            : faker.date.between('1975-01-01', '2005-12-31'),
          sex_id: faker.number.int({ min: 1, max: 2 }),
          patient_profile_id: isOtherProfile ? 3 : faker.number.int({ min: 1, max: 2 }), // 1,2,3 (otros)
          other_profile: isOtherProfile ? faker.person.jobTitle() : '',
          minor_attorney_names: isMinor ? faker.person.firstName() : '',
          minor_attorney_surnames: isMinor ? faker.person.lastName() : '',
          minor_attorney_contact_number: isMinor ? faker.number.int({ min: 100000000, max: 999999999 }).toString() : '',
        },
        allergy: {
          food_allergy: faker.lorem.words(),
          drug_allergy: faker.lorem.words(),
        },
        medical_history: {
          surgical_history: faker.lorem.paragraph(),
          hypertension: faker.datatype.boolean(),
          asthma: faker.datatype.boolean(),
          cancer: faker.datatype.boolean(),
          diabetes: faker.datatype.boolean(),
          epilepsy: faker.datatype.boolean(),
          psychological_condition: medicalHistoryPsychologicalCondition,
          observation: medicalHistoryPsychologicalCondition ? faker.lorem.words() : '',
          others: medicalHistoryOthers,
          others_description: medicalHistoryOthers ? faker.lorem.words() : '',
        },
      };
    };

    const response = await Api.post(
      'medical-consultations/patient',
      preparePatientDataToSend(
        faker.datatype.boolean(),
        faker.datatype.boolean(),
        faker.datatype.boolean(),
        faker.datatype.boolean(),
      ),
    );
    return response;
  }

  static async generateMedicalConsultation() {
    const prepareConsultationDataToSend = patient_id => {
      const isEmergencia = faker.datatype.boolean();

      const issued_medical_rest = faker.datatype.boolean();
      let medical_rest_start = null;
      let medical_rest_end = null;
      if (issued_medical_rest) {
        const startDate = faker.date.between({ from: '2024-01-01T00:00:00.000Z', to: '2024-07-31T00:00:00.000Z' });
        medical_rest_start = moment(startDate).format('YYYY-MM-DD');
        medical_rest_end = moment(startDate)
          .add(faker.number.int({ min: 1, max: 20 }), 'days')
          .format('YYYY-MM-DD');
      }

      return {
        medical_consultation: {
          attendance_date: moment(
            faker.date.between({ from: '2024-06-01T00:00:00.000Z', to: '2024-06-05T00:00:00.000Z' }),
          ).format('YYYY-MM-DD'),
          attendance_time: moment(faker.date.anytime()).format('HH:mm'),
          patient_id,
        },
        attendance_detail: {
          consultation_type_id: isEmergencia ? 2 : 1,
          clinic_derived: isEmergencia ? faker.datatype.boolean() : false,
          attendance_place_id: faker.number.int({ min: 1, max: 2 }),
          anamnesis: faker.lorem.words(),
          physical_exam: faker.lorem.words(),
          illness_quantity: faker.number.int({ min: 1, max: 20 }),
          illness_quantity_type_id: faker.number.int({ min: 1, max: 4 }),
          heart_rate: faker.number.int({ min: 1, max: 30 }),
          respiratory_rate: faker.number.int({ min: 1, max: 30 }),
          temperature: faker.number.int({ min: 1, max: 30 }),
          pa: faker.number.int({ min: 1, max: 30 }),
          oxygen_saturation: faker.number.int({ min: 1, max: 30 }),
        },
        medical_diagnosis: {
          main_diagnosis_id: 3,
          secondary_diagnosis_id: 3,
          biological_system_id: faker.number.int({ min: 1, max: 10 }),
          involves_mental_health: faker.datatype.boolean(),
          issued_medical_rest,
          medical_rest_start,
          medical_rest_end,
        },
        prescription: [
          {
            medicine_id: 1,
            workplan: faker.lorem.words(),
          },
        ],
      };
    };

    const patientResponse = await this.generatePatient();

    const medicalResponse = await Api.post(
      'medical-consultations/consultation',
      prepareConsultationDataToSend(patientResponse.data),
    );
    return medicalResponse;
  }

  static async generateMultiMedicalConsultation(count = 10) {
    for (let index = 0; index < count; index++) {
      await this.generateMedicalConsultation();
    }
  }
}

export default MedicalConsultationFaker;
