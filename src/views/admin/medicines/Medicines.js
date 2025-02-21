import React, { useRef, useState } from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import {getModuleByPath} from "../../../inc/Utils";
import Datable from "../../../widgets/datable/DatableV2";
import Dahead, {Fil} from "../../../widgets/datable/DaheadV2";
import MedicinesM from "./MedicinesM";

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
                        Fil.local('article_group_id', 'Grupo Artículo', '/dropdown-options/article-groups'),
                        Fil.local('form_factor_id', 'Presentación', '/dropdown-options/form-factors'),
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
                        code            : {value: 'Código', order_col: 'medicine.code'},
                        name            : {value: 'Nombre', order_col: 'medicine.name'},
                        dci             : {value: 'DCI', order_col: 'medicine.dci'},
                        article_group   : {value: 'Grupo Artículo', order_col: 'article_group.name', row: o => o.article_group?.name},
                        form_factor     : {value: 'Presentación', order_col: 'form_factor.name', row: o => o.form_factor?.name},
                        state           : {value: '', order_col: 'medicine.state', row: 'state'},
                        date_created    : {value: 'Fecha de registro', order_col: 'medicine.date_created' ,row: 'datetime'},
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
        <MedicinesM ref={modal} onSaved={() => datable.current.apply()}/>
    </>
}
