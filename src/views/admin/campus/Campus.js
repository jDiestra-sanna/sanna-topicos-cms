import React, {useEffect, useRef, useState} from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import {getModuleByPath, humanDate} from "../../../inc/Utils";
import Datable from "../../../widgets/datable/DatableV2";
import Dahead, {Fil} from "../../../widgets/datable/DaheadV2";
import CampusM from "./CampusM";
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
                        Fil.ajax('client_id', 'Cliente', '/dropdown-options/clients'),
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
                        correlative             : {value: 'Código', order_col: 'campus.correlative'},
                        pic                     : {value: 'Logo', row: 'pic'},
                        name                    : {value: 'Nombre', order_col: 'campus.name'},
                        client                  : {value: 'Cliente', order_col: 'client.name', row: o => o.client?.name || ''},
                        group                   : {value: 'Grupo', order_col: 'group.name', row: o => o.client?.group?.name || ''},
                        ubigeo_peru_department  : {value: 'Departamento', order_col: 'department.name', row: o => o.ubigeo_peru_department?.name || ''},
                        ubigeo_peru_province    : {value: 'Provincia', order_col: 'province.name', row: o => o.ubigeo_peru_province?.name || ''},
                        ubigeo_peru_district    : {value: 'Distrito', order_col: 'district.name', row: o => o.ubigeo_peru_district?.name || ''},
                        state                   : {value: '', order_col: 'campus.state', row: 'state'},
                        date_created            : {value: 'Fecha de registro', order_col: 'campus.date_created' ,row: 'datetime'},
                        _menu                   : {
                            value: '', row: 'h-menu', items: o => {
                                if (o.protected) {
                                    return [];
                                } else {
                                    return [':edit', ':toggle', ':remove'];
                                }
                            }
                        },
                        contact                 : {detail: true, value: 'Contacto', order_col: 'campus.contact'},
                        phone                   : {detail: true, value: 'Teléfono', order_col: 'campus.phone'},
                        email                   : {detail: true, value: 'Email', order_col: 'campus.email'},
                        warehouse_code          : {detail: true, value: 'Código Almacén', },
                        address                 : {detail: true, value: 'Dirección', },
                        opening_date            : {detail: true, value: 'Fecha Apertura', row: o => humanDate(o.opening_date)},
                        opening_hours           : {detail: true, value: 'Horario de atención', },
                    }}/>
            }
        />
        <CampusM ref={modal} onSaved={() => datable.current.apply()}/>
    </>
}
