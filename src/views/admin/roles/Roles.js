import React, {useRef, useState} from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import {getModuleByPath} from "../../../inc/Utils";
import Datable from "../../../widgets/datable/DatableV2";
import Dahead, {Fil} from "../../../widgets/datable/DaheadV2";
import RolesM from "./RolesM";
import Icon from "@material-ui/core/Icon";

export default function (props) {

    const [module] = useState(() => getModuleByPath(props.route.path));

    const dahead = useRef(null);
    const datable = useRef(null);
    const modal = useRef(null);

    return <>
        <FusePageCarded
            header={
                <Dahead
                    {...props}
                    ref={dahead}
                    modal={modal}
                    datable={datable}
                    module={module}
                    fields={[
                        // Fil.local('user_type_id', 'Persona', '/fil_datas/user_types'),
                    ]}/>
            }
            content={
                <Datable
                    {...props}
                    ref={datable}
                    fil={() => dahead.current.fil()}
                    modal={modal}
                    module={module}
                    onRowStyles={(o, i) => {
                        if (o.protected) {
                            return {opacity: '0.3'};
                        } else {
                            return {};
                        }
                    }}
                    defaultPageLimit={15}
                    columns={{
                        // tu_name     : {value: 'Para'},
                        name           : {value: 'Nombre', order_col: 'role.name'},
                        home_module    : { value: 'Modulo Inicio', order_col: 'module.name', row: o => o.home_module?.name },
                        // num_users   : {value: <Icon>person</Icon>, width: '1%', tooltip: 'Número de usuarios'},
                        date_created: {value: 'Fecha de registro', order_col: 'role.date_created', row: 'datetime'},
                        _menu       : {
                            value: '', row: 'h-menu', items: (o, i) => {
                                let items = [];
                                items.push(':edit');
                                if (!o.protected) {
                                    items.push(':remove');
                                }
                                return items;
                            }
                        },
                    }}/>
            }
        />
        <RolesM ref={modal} onSaved={() => datable.current.apply()}/>
    </>
}