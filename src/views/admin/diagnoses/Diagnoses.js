import React, { useRef, useState } from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import {getModuleByPath} from "../../../inc/Utils";
import Datable from "../../../widgets/datable/DatableV2";
import Dahead, {Fil} from "../../../widgets/datable/DaheadV2";
import DiagnosesM from "./DiagnosesM";

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
                        Fil.local('diagnosis_type_id', 'Tipo', '/dropdown-options/diagnosis-types'),
                        Fil.local('proffesion_id', 'Profesión', '/dropdown-options/proffesions'),
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
                        code            : {value: 'Código', order_col: 'diagnoses.code'},
                        name            : {value: 'Nombre', order_col: 'diagnoses.name'},
                        diagnosis_type  : {value: 'Tipo', order_col: 'diagnosis_type.name', row: o => o.diagnosis_type?.name},
                        proffesion      : {value: 'Profesión', order_col: 'proffesion.name', row: o => o.proffesion?.name},
                        state           : {value: '', order_col: 'diagnoses.state', row: 'state'},
                        date_created    : {value: 'Fecha de registro', order_col: 'diagnoses.date_created' ,row: 'datetime'},
                        _menu           : {
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
        <DiagnosesM ref={modal} onSaved={() => datable.current.apply()}/>
    </>
}
