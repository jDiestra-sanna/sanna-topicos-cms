import React, {useEffect, useRef, useState} from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import {getModuleByPath} from "../../../inc/Utils";
import Datable from "../../../widgets/datable/Datable";
import Dahead from "../../../widgets/datable/Dahead";
import UsuariosM from "./UsuariosM";

export default function (props) {

    const [module] = useState(() => getModuleByPath(props.route.path));

    const dahead = useRef(null);
    const datable = useRef(null);
    const modal = useRef(null);

    useEffect(() => {
        //modal.current.add();
    }, []);

    return <>
        <FusePageCarded
            header={
                <Dahead
                    {...props}
                    ref={dahead}
                    modal={modal}
                    datable={datable}
                    module={module}/>
            }
            content={
                <Datable
                    {...props}
                    ref={datable}
                    fil={() => dahead.current.fil()}
                    modal={modal}
                    endpoint="/../proveedor/usuarios"
                    columns={{
                        id          : {value: 'ID', width: '1%'},
                        fullname    : {value: 'Nombre', row: 'fullname'},
                        email       : {value: 'Correo electrónico'},
                        phone       : {value: 'Teléfono'},
                        role_name     : {value: 'Perfil'},
                        state       : {value: '', row: 'state'},
                        date_created: {value: 'Fecha de registro', row: 'datetime'},
                        _menu       : {value: '', row: 'h-menu', items: () => [':edit', ':remove']},
                        document    : {detail: true, value: 'DNI'},
                    }}/>
            }
        />
        <UsuariosM ref={modal} type="2" onSaved={() => datable.current.apply()}/>
    </>
}