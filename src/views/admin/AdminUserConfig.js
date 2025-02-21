import {authRoles} from 'app/auth';
import {Redirect} from "react-router-dom";
import AssignedTeam from './topics/sanna-team/SannaTeam';
import Campus from "./campus/Campus";
import Clients from "./clients/Clients";
import Dashboard from './dashboard/Dashboard';
import Diagnoses from "./diagnoses/Diagnoses";
import FileViewer from "./file-viewer/FileViewer";
import Groups from "./groups/Groups";
import HealthTeamProfile from "./health-team-profile/HealthTeamProfile";
import Home from "./auth/Home";
import Legal from "./legal/Legal";
import Logs from "./logs/Logs";
import ManagementHealthTeamProfile from './topics/managment/ManagementHealTeamProfile';
import MedicalCalendars from "./medical-calendars/MedicalCalendars";
import MedicalCalendarsForm from "./medical-calendars/MedicalCalendarsForm";
import MedicalConsultations from "./medical-consultations/MedicalConsultations";
import MedicalConsultationsHistory from './medical-consultations-history/MedicalConsultationsHistory';
import Medicines from "./medicines/Medicines";
import Modules from "./modules/Modules";
import MonthlySchedule from './topics/monthly-schedule/MonthlySchedule';
import MonthlyScheduleHealthTeamProfile from './topics/monthly-schedule/MonthlyScheduleHealthTeamProfile';
import Perfil from "./perfil/Perfil";
import PerfilClave from "./perfil/PerfilClave";
import PerfilDatos from "./perfil/PerfilDatos";
import Protocols from "./protocols/Protocols";
import React from "react";
import Roles from "./roles/Roles";
import SannaTeamHealthTeamProfile from './topics/sanna-team/SannaTeamHealTeamProfile';
import Sessions from "./sessions/Sessions";
import Settings from "./settings/Settings";
import TopicManagment from './topics/managment/Managment';
import Users from "./users/Users";
import MedicalConsultationReport from './reports/medical-consultation/MedicalConsultationReport';

export default {
    settings: {
        layout: {
            config: {}
        }
    }, auth : authRoles.admin, routes: [

        {path: '/setting', component: Settings},
        {path: '/modules', component: Modules},
        {path: '/roles', component: Roles},
        {path: '/logs', component: Logs},
        {path: '/sessions', component: Sessions},
        {path: '/legal', component: Legal},
        {path: '/users', component: Users, exact: true},

        {path: '/file-viewer/:fileId', component: FileViewer},
        {path: '/groups', component: Groups, exact: true},
        {path: '/clients', component: Clients, exact: true},
        {path: '/campus', component: Campus, exact: true},
        {path: '/medical-calendars', component: MedicalCalendars, exact: true},
        {path: '/medical-calendars/form/:userId/:campusId', component: MedicalCalendarsForm, exact: true},
        {path: '/medical-consultations', component: MedicalConsultations, exact: true},
        {path: '/medical-consultations/:medicalConsultationId', component: MedicalConsultations},
        {path: '/consultation-histories', component: MedicalConsultationsHistory, exact: true},
        {path: '/health-team-profiles', component: HealthTeamProfile, exact: true},
        {path: '/health-team-profiles/file-viewer/:fileId', component: FileViewer, exact: true},
        {path: '/medicines', component: Medicines, exact: true},
        {path: '/diagnoses', component: Diagnoses, exact: true},
        {path: '/protocols', component: Protocols, exact: true},
        {path: '/dashboard', component: Dashboard, exact: true},
        {path: '/topic-managments', component: TopicManagment, exact: true},
        {path: '/topic-managments/file-viewer/:fileId', component: FileViewer, exact: true},
        {path: '/topic-managments/health-team-profiles/:userId/:campusId', component: ManagementHealthTeamProfile, exact: true},
        {path: '/topic-sanna-teams', component: AssignedTeam, exact: true},
        {path: '/topic-sanna-teams/file-viewer/:fileId', component: FileViewer, exact: true},
        {path: '/topic-sanna-teams/health-team-profiles/:userId/:campusId', component: SannaTeamHealthTeamProfile, exact: true},
        {path: '/topic-calendars', component: MonthlySchedule, exact: true},
        {path: '/topic-calendars/file-viewer/:fileId', component: FileViewer, exact: true},
        {path: '/topic-calendars/health-team-profiles/:userId/:campusId', component: MonthlyScheduleHealthTeamProfile, exact: true},
        {path: '/report-medical-consultations', component: MedicalConsultationReport, exact: true},

        {
            path     : '/perfil',
            component: Perfil,
            routes   : [{path: '/perfil', component: () => <Redirect to="/perfil/datos"/>, exact: true},
                {path: '/perfil/datos', component: PerfilDatos, exact: true},
                {path: '/perfil/clave', component: PerfilClave, exact: true},]
        },

        {path: '/', component: Home, exact: true},
    ]
};
