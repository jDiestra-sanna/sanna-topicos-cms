import React from "react";
import {authRoles} from 'app/auth';
import Home from "../admin/auth/Home";
import Usuarios from "./usuarios/Usuarios";
import Data from "./datos/Data";
import {Redirect} from "react-router-dom";
import DataGeneral from "./datos/DataGeneral";
import DataLocation from "./datos/DataLocation";
import DataPayment from "./datos/DataPayment";
import DataPresentation from "./datos/DataPresentation";
import Legal from "./legal/Legal";
import Convocatorias from "./convocatorias/Convocatorias";
import DataRubro from "./datos/DataRubro";
import Facturas from "./facturas/Facturas";
import Formatos from "./formatos/Formatos";
import Perfil from "./perfil/Perfil";
import PerfilClave from "./perfil/PerfilClave";

export default {
    settings: {
        layout: {
            config: {}
        }
    },
    auth    : authRoles.admin,
    routes  : [
        {
            path: '/datos', component: Data, routes: [
                {path: '/datos', component: () => <Redirect to="/datos/generales"/>, exact: true},
                {path: '/datos/generales', component: DataGeneral, exact: true},
                {path: '/datos/ubicacion', component: DataLocation, exact: true},
                {path: '/datos/cuentas', component: DataPayment, exact: true},
                {path: '/datos/presentacion', component: DataPresentation, exact: true},
                {path: '/datos/rubros', component: DataRubro, exact: true},
            ]
        },
        {path: '/usuarios', component: Usuarios},
        {path: '/convocatorias', component: Convocatorias},
        {path: '/facturas', component: Facturas},
        {path: '/formatos', component: Formatos},
        {path: '/legal', component: Legal},

        {
            path: '/perfil', component: Perfil, routes: [
                {path: '/perfil', component: () => <Redirect to="/perfil/clave"/>, exact: true},
                {path: '/perfil/clave', component: PerfilClave, exact: true},
            ]
        },

        {path: '', component: Home, exact: true},
    ]
};