import React, {useEffect, useState} from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import {getModuleByPath} from "../../../inc/Utils";
import FuseAnimate from "@fuse/core/FuseAnimate";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Api from "../../../inc/Api";
import Toast from "../../../inc/Toast";
import jwtService from "../../../app/services/jwtService/jwtService";
import Alert from '../../../inc/Alert';
import WLoading from "../../../widgets/WLoading";
import WError from "../../../widgets/WError";


export default function (props) {
    const [module] = useState(() => getModuleByPath(props.route.path));
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => loadData(), []);

    function loadData() {
        setData(null);
        Api.get('/../proveedor/legal', {}, setData, false);
    }

    function acceptLegal() {
        setLoading(true);
        Api.post('/../proveedor/legal/accept', {}, rsp => {
            setLoading(false);
            if (rsp.ok) {
                Toast.success('Guardado correctamente');
                jwtService.emitOnAutoLogin();
            } else {
                Alert.error(rsp.msg);
            }
        }, 'Guardando...');
    }

    return (
        <FusePageCarded
            header={
                <div className="flex flex-1 w-full items-center justify-between">

                    <div className="flex flex-1 items-center">
                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                            <Typography className="hidden sm:flex" variant="h6">
                                {module.title}
                            </Typography>
                        </FuseAnimate>
                    </div>

                    {(data != null && !data.accepted) && (
                        <FuseAnimate animation="transition.slideRightIn" delay={300}>
                            <Button
                                variant="contained"
                                color="secondary"
                                disabled={loading}
                                onClick={acceptLegal}>
                                Aceptar
                            </Button>
                        </FuseAnimate>
                    )}

                </div>
            }

            content={data == null ? (
                <WLoading/>
            ) : !data.ok ? (
                <WError error={data.msg} onRetry={loadData}/>
            ) : (
                <div className="p-32">
                    <div dangerouslySetInnerHTML={{__html: data.legal}}/>
                </div>
            )}
            innerScroll/>
    )
}