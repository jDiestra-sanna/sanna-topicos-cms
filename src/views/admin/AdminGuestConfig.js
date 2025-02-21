import Login from "./auth/Login";
import Recover from "./auth/Recover";

export default {
    settings: {
        layout: {
            config: {
                navbar        : {
                    display: false
                },
                toolbar       : {
                    display: false
                },
                footer        : {
                    display: false
                },
                leftSidePanel : {
                    display: false
                },
                rightSidePanel: {
                    display: false
                }
            }
        }
    },
    routes  : [
        {path: '/login', component: Login, exact: true},
        {path: '/login/:action', component: Login, exact: true},
        {path: '/recover', component: Recover},
        {path: '/:dir/recover', component: Recover},
    ]
};

