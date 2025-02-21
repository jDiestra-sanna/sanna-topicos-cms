import React, {useRef, useState} from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Util, {getModuleByPath, getUser, humanDatetime} from "../../../inc/Utils";
import Datable from "../../../widgets/datable/DatableV2";
import Dahead from "../../../widgets/datable/DaheadV2";
import Api from "../../../inc/Apiv2";
import Toast from "../../../inc/Toast";
import TableCell from "@material-ui/core/TableCell";
import Picard from "../../../widgets/Picard";
import Alert from '../../../inc/Alert';
import {MenuItems} from "../../../widgets/Menu";
import { useHistory } from 'react-router';

export default function (props) {
    const user = getUser();
    const [module] = useState(() => getModuleByPath(props.route.path));

    const dahead = useRef(null);
    const datable = useRef(null);
    const history = useHistory()
    
    const closeSession = (id, user_id) => {
        Alert.confirm(async () => {
            const response = await Api.delete(`/sessions/${id}`);

            if (!response.ok) return Alert.error(response.message);

            if (user.data?.id == user_id) {
                Toast.success();
                return setTimeout(() => history.push('/login'), 500)
            }
            
            Toast.success();
            datable.current.apply();
        });
    };

    return (
        <FusePageCarded
            header={
                <Dahead
                    {...props}
                    ref={dahead}
                    datable={datable}
                    module={module}/>
            }
            content={
                <Datable
                    {...props}
                    ref={datable}
                    fil={() => dahead.current.fil()}
                    module={module}
                    columns={{
                        user           : {
                            value: 'Persona', 
                            row: o => (
                                <TableCell key="name">
                                    <Picard pic={o.user.pic}
                                            title={o.user.name + ' ' + o.user.surname}
                                            subtitle={o.user.user_type?.name}/>
                                </TableCell>
                            ), 
                            order_col: 'user.name'
                        },
                        platform       : {value: 'Plataforma', order_col: 'session.platform'},
                        language       : {value: 'Idioma', order_col: 'session.language'},
                        os             : {value: 'SO', order_col: 'session.os'},
                        state          : {value: '', row: 'state', order_col: 'session.state'},
                        date_created   : {value: 'Fecha', row: 'datetime', order_col: 'session.date_created'},
                        _menu          : {
                            value: '', row: 'h-menu', items: (o, i) => {
                                if (o.state === 0) return [];
                                
                                let items = new MenuItems();

                                if (module.edit) {
                                    items.item('Cerrar sesión', () => closeSession(o.id, o.user_id))
                                        .setIcon('exit_to_app');
                                }

                                return items;
                            }
                        },
                        os_version     : {detail: true, value: 'Versión de SO'},
                        device_brand   : {detail: true, value: 'Marca del dispositivo'},
                        device_model   : {detail: true, value: 'Modelo del dispositivo'},
                        app_version    : {detail: true, value: 'Versión de app'},
                        uuid           : {detail: true, value: 'UUID'},
                        date_expiration: {
                            detail: true,
                            value : 'Fecha de expiración',
                            row   : o => `${humanDatetime(o.date_expiration)} (${Util.ago(o.date_expiration)})`
                        },
                        date_updated   : {detail: true, value: 'Última actualización', row: 'datetime'},
                        date_deleted   : {detail: true, value: 'Último cierre', row: 'datetime'},
                    }}/>
            }
        />
    )
}