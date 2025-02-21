import React, {useEffect, useState} from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import FuseAnimate from "../../../@fuse/core/FuseAnimate/FuseAnimate";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Api from "../../../inc/Api";
import Toast from "../../../inc/Toast";
import Header from "./_header";
import Sidebar from "./_sidebar";
import FPassword from "../../../widgets/fields/FPassword";
import Form from "../../../widgets/fields/Form";
import WLoading from "../../../widgets/WLoading";
import WError from "../../../widgets/WError";
import {default as AlertX} from "../../../inc/Alert";
import {Alert} from "@material-ui/lab";
import jwtService from "../../../app/services/jwtService/jwtService";
import history from "../../../@history/@history";

let _item = {
    current_password: '',
    new_password_1  : '',
    new_password_2  : '',
};

export default function (props) {

    const [files, setFiles] = useState({});
    const [state, setState] = useState({
        loading: false,
        error  : null,
        errors : null,
    });
    const [item, setItem] = useState({..._item});
    const [data, setData] = useState(null);

    useEffect(() => loadData(), []);

    function loadData() {
        Api.get('/me', setData);
    }

    function save() {
        AlertX.confirm({
            title        : '',
            message      : '¿Estás seguro de que deseas cambiar tu contraseña?',
            confirmButton: 'Cambiar contraseña',
            callback     : () => {
                setState({
                    ...state,
                    loading: true,
                    error  : null,
                    errors : null,
                });
                Api.post('/me/cambiarClave', {...item}, rsp => {
                    if (rsp.ok) {
                        setState({
                            ...state,
                            loading: false,
                            error  : null,
                            errors : null,
                        });
                        setItem({..._item})
                        Toast.success('Guardado correctamente');

                        if (data.cambiar_clave_generica) {
                            jwtService.setUser(null);
                            jwtService.emitOnAutoLogin();
                            history.push('/');
                        }

                    } else {
                        setState({
                            ...state,
                            loading: false,
                            error  : rsp.msg,
                            errors : rsp.errors,
                        });
                    }
                });
            },
        });
    }

    function changed(e) {
        const target = e.target;
        const name = target.name;
        if (target.type === 'file') {
            const file = target.files[0];
            setFiles({...files, [name]: file});
        } else {
            const value = target.type === 'checkbox' ? target.checked ? '1' : '0' : target.value;
            setItem({...item, [name]: value});
        }
    }

    return <>
        <FusePageCarded
            classes={{
                toolbar    : 'max-w-640',
                header     : 'max-w-640',
                contentCard: 'max-w-640',
            }}
            header={
                <div className="flex flex-1 w-full items-center justify-between">

                    <div className="flex flex-1 items-center">
                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                            <Typography className="hidden sm:flex" variant="h6">
                                Contraseña
                            </Typography>
                        </FuseAnimate>
                    </div>

                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                        <Button
                            variant="contained"
                            color="secondary"
                            disabled={state.loading}
                            onClick={save}>
                            Cambiar la contraseña
                        </Button>
                    </FuseAnimate>
                </div>
            }
            leftSidebarHeader={<Header {...props}/>}
            leftSidebarContent={<Sidebar {...props}/>}
            content={data == null ? (
                <WLoading/>
            ) : !data.ok ? (
                <WError error={data.msg} onRetry={loadData}/>
            ) : (
                <Form error={state.error} errors={state.errors} disabled={state.loading} style={{padding: 24}}>

                    {data.msg && (
                        <Alert sm={7} severity="warning">{data.msg}</Alert>
                    )}

                    <FPassword
                        sm={7}
                        label="Contraseña actual"
                        name="current_password"
                        value={item.current_password}
                        onChange={changed}/>

                    <FPassword
                        sm={7}
                        label="Contraseña nueva"
                        name="new_password_1"
                        value={item.new_password_1}
                        onChange={changed}/>

                    <FPassword
                        sm={7}
                        label="Confirma la nueva contraseña"
                        name="new_password_2"
                        value={item.new_password_2}
                        onChange={changed}/>

                </Form>
            )}
        />
    </>
}