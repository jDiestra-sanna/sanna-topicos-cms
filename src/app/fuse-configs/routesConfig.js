import React from 'react';
import FuseUtils from '@fuse/utils';
import Home from '../../views/admin/auth/Home';
import error404 from '../../views/admin/errors/error404';
import {getRoutes} from "../../inc/Utils";

const routeConfigs = getRoutes();

const routes = [
    ...FuseUtils.generateRoutesFromConfigs(routeConfigs),
    {
        path     : '/',
        exact    : true,
        component: Home
    },
    {
        component: error404
    }
];

export default routes;
