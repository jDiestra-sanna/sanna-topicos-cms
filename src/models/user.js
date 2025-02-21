import * as Utils from 'inc/Utils';
import Roles from './roles';
import Proffesion from './proffesion';

class AuthUser {
  static ROOT_ID = 1;

  constructor(authUser) {
    Object.assign(this, authUser);
  }

  getId() {
    return this.data?.id || 0;
  }

  getRoleId() {
    return this.data?.role_id || 0;
  }

  hasUserData() {
    return !!this.data;
  }

  hasCurrentMedicalCalendar() {
    return !!this.data?.current_medical_calendar;
  }

  isAdmin() {
    return this.getRoleId() === Roles.ADMIN_ID;
  }

  isHealthTeam() {
    return this.getRoleId() === Roles.HEALTH_TEAM_ID;
  }

  isClient() {
    return this.getRoleId() === Roles.CLIENT_ID;
  }

  isCentral() {
    return this.data?.is_central == 1;
  }

  isGeneralPhysician() {
    return this.data?.proffesion_id === Proffesion.GENERAL_PHYSICIAN_ID;
  }

  isDegreeInNursing() {
    return this.data?.proffesion_id === Proffesion.DEGREE_IN_NURSING_ID;
  }

  getAllClientsFromAssigments() {
    const assignments = this.data?.assignments || [];

    const see = new Set();
    assignments.forEach(assignment => {
      if (!see.has(JSON.stringify(assignment.campus.client))) {
        see.add(JSON.stringify(assignment.campus.client));
      }
    });

    return Array.from(see).map(entry => JSON.parse(entry));
  }

  getAllCampusFromAssigments() {
    const assignments = this.data?.assignments || [];

    const see = new Set();
    assignments.forEach(assignment => {
      if (!see.has(JSON.stringify(assignment.campus))) {
        see.add(JSON.stringify(assignment.campus));
      }
    });

    return Array.from(see).map(entry => JSON.parse(entry));
  }

  getCampusFromAssigmentsByClient(clientId) {
    const assignments = this.data?.assignments || [];

    const see = new Set();
    assignments.forEach(assignment => {
      if (assignment.campus.client_id !== clientId) return;

      if (!see.has(JSON.stringify(assignment.campus))) {
        see.add(JSON.stringify(assignment.campus));
      }
    });

    return Array.from(see).map(entry => JSON.parse(entry));
  }
}

export { AuthUser };
