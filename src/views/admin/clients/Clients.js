import React, {useEffect, useRef, useState} from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import {getModuleByPath} from "../../../inc/Utils";
import Datable from "../../../widgets/datable/DatableV2";
import Dahead, {Fil} from "../../../widgets/datable/DaheadV2";
import ClientsM from "./ClientsM";
import Api from 'inc/Apiv2';

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
                        Fil.local('group_id', 'Grupo', '/dropdown-options/groups'),
                    ]}/>
            }
            content={
                <Datable
                    {...props}
                    ref={datable}
                    fil={() => dahead.current.fil()}
                    modal={modal}
                    module={module}
                    onRowStyles={o => (o.protected ? {opacity: '0.3'} : {})}
                    columns={{
                        correlative : {value: 'Código', order_col: 'client.correlative'},
                        pic         : {value: 'Logo', row: 'pic'},
                        name        : {value: 'Nombre', order_col: 'client.name'},
                        group       : {value: 'Grupo', order_col: 'group.name', row: o => o.group?.name || ''},
                        contact     : {value: 'Contacto', order_col: 'client.contact'},
                        phone       : {value: 'Teléfono', order_col: 'client.phone'},
                        email       : {value: 'Email', order_col: 'client.email'},
                        state       : {value: '', order_col: 'client.state', row: 'state'},
                        date_created: {value: 'Fecha de registro', order_col: 'client.date_created' ,row: 'datetime'},
                        _menu       : {
                            value: '', row: 'h-menu', items: o => {
                                if (o.protected) {
                                    return [];
                                } else {
                                    return [':edit', ':toggle', ':remove'];
                                }
                            }
                        }
                    }}/>
            }
        />
        <ClientsM ref={modal} onSaved={() => datable.current.apply()}/>
    </>
}
