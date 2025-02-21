import React, {useEffect, useState} from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import FuseAnimate from "../../../@fuse/core/FuseAnimate/FuseAnimate";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import FFile from "../../../widgets/fields/FFile";
import Api from "../../../inc/Api";
import WLoading from "../../../widgets/WLoading";
import WError from "../../../widgets/WError";
import FText from "../../../widgets/fields/FText";
import Alert from "../../../inc/Alert";
import Toast from "../../../inc/Toast";
import Header from "./_header";
import Sidebar from "./_sidebar";

export default function (props) {

    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState({});
    const [item, setItem] = useState(null);

    useEffect(() => loadData(), []);

    function loadData() {
        Api.get('/me', setItem);
    }

    function save() {
        let data = new FormData();
        for (let [key, value] of Object.entries(files)) {
            data.append(key, value);
        }
        setLoading(true);
        Api.post('/me/actualizarPerfil', data, rsp => {
            setLoading(false);
            if (rsp.ok) {
                Toast.success('Actualizado correctamente');
            } else {
                Alert.error(rsp.msg);
            }
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
                                Editar perfil
                            </Typography>
                        </FuseAnimate>
                    </div>

                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                        <Button
                            variant="contained"
                            color="secondary"
                            disabled={loading || item == null}
                            onClick={save}>
                            Guardar
                        </Button>
                    </FuseAnimate>
                </div>
            }
            leftSidebarHeader={<Header {...props}/>}
            leftSidebarContent={<Sidebar {...props}/>}
            content={item == null ? (
                <WLoading/>
            ) : !item.ok ? (
                <WError error={item.msg} onRetry={loadData}/>
            ) : (
                <div className="p-16">
                    <Grid container spacing={2}>
                        <Grid item sm={6}>
                            <FText
                                label="Nombre"
                                value={item.name}
                                onChange={changed}
                                disabled/>
                        </Grid>
                        <Grid item sm={6}>
                            <FText
                                label="Apellido"
                                value={item.surname}
                                onChange={changed}
                                disabled/>
                        </Grid>
                        <Grid item sm={12}>
                            <FFile
                                label="Firma digital"
                                name="pic_firma"
                                value={item.pic_firma}
                                onChange={changed}
                                image/>
                        </Grid>
                    </Grid>
                </div>
            )
            }
        />
    </>
}