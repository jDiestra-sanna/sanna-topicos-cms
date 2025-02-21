import React, {useEffect, useState} from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Util, {getModuleByPath, InputUtils, objectToFormData} from "../../../inc/Utils";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import FuseAnimate from "@fuse/core/FuseAnimate";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Api from "../../../inc/Apiv2";
import Toast from "../../../inc/Toast";
import jwtService from "../../../app/services/jwtService/jwtService";
import Alert from '../../../inc/Alert';
import WLoading from "../../../widgets/WLoading";
import WError from "../../../widgets/WError";
import InfoDetail from "../../../widgets/InfoDetail";
import Form from "../../../widgets/fields/Form";
import FText from "../../../widgets/fields/FText";
import FNumber from "../../../widgets/fields/FNumber";
import history from "@history";
import FFile from "../../../widgets/fields/FFile";
import FCheck from "../../../widgets/fields/FCheck";
import Info from "../../../widgets/Info";
import {Table, TableBody, TableCell, TableRow} from "@material-ui/core";
import Fildirs from "./Fildirs";


export default function (props) {
    const [module] = useState(() => getModuleByPath(props.route.path));

    const [selectedTab, setSelectedTab] = useState(() => {
        let params = Util.params();
        return parseInt(params.t) || 0;
    });
    const [data, setData] = useState(null);
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData()
    }, []);

    async function loadData() {
        setData(null);
        const response = await Api.get('/setting', {}, false);

        if (response.ok) {
            setItem(response.data);
        }

        setData(response);
    }

    const handleTabChange = (event, value) => {
        setSelectedTab(value);
        history.replace({
            search: value === 0 ? '' : '?t=' + value,
        });
    };

    const changed = e => {
        const target = e.target;
        const name = target.name;
        if (target.type === 'file') {
            const file = target.files[0];
            setItem({...item, [name]: file});
        } else {
            const value = target.type === 'checkbox' ? target.checked ? '1' : '0' : target.value;
            setItem({...item, [name]: value});
        }
    };

    const save = async () => {
        // let data = objectToFormData({...item});
        let data = {...item};

        const file_favicon = data.pic_favicon;
        const file_logo = data.pic_logo;

        delete data.pic_favicon;
        delete data.pic_logo;

        setLoading(true);

        const responeUpdate = await Api.patch('/setting', data, 'Guardando...');
        let responseUploadFavicon = null;
        let responseUploadLogo = null;

        if (typeof file_favicon !== 'string' && file_favicon) {
            responseUploadFavicon = await Api.post('/setting/favicon-image', objectToFormData({ file: file_favicon }), 'Guardando...')  
        }

        if (typeof file_logo !== 'string' && file_logo) {
            responseUploadLogo = await Api.post('/setting/logo-image', objectToFormData({ file: file_logo }), 'Guardando...')  
        }

        setLoading(false);

        if (!responeUpdate.ok) {
            return Alert.error(responeUpdate.message);
        }

        if (responseUploadFavicon && !responseUploadFavicon?.ok) {
            return Alert.error(responseUploadFavicon.message);
        }

        if (responseUploadLogo && !responseUploadLogo?.ok) {
            return Alert.error(responseUploadLogo.message);
        }

        setItem({
            ...item,
            pic_favicon: responseUploadFavicon ? responseUploadFavicon.data : item.pic_favicon,
            pic_logo: responseUploadLogo ? responseUploadLogo.data : item.pic_logo
        })

        Toast.success('Guardado correctamente');
        jwtService.emitOnAutoLogin();
    };

    function guardarConfig(tipo, data = null) {
        let params = {tipo};

        if (data)
            params = {...params, ...data};

        Alert.confirm(() => {
            Api.post('/settings/guardarConfig', params, rsp => {
                if (rsp.ok) {
                    loadData();
                    Toast.success(rsp.msg);
                } else {
                    Alert.error(rsp.msg);
                }
            });
        });
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

                    {(module.edit && data && data.ok) && (
                        <FuseAnimate animation="transition.slideRightIn" delay={100}>
                            <Button
                                variant="contained"
                                color="secondary"
                                disabled={loading}
                                onClick={save}>
                                Guardar cambios
                            </Button>
                        </FuseAnimate>
                    )}
                </div>
            }
            contentToolbar={
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    indicatorColor="secondary"
                    textColor="secondary"
                    variant="fullWidth"
                    className="w-full">
                    {/* <Tab label="General"/> */}
                    {/* <Tab label="Correo"/> */}
                    <Tab label="Empresa"/>
                    {/* <Tab label="Credenciales"/> */}
                </Tabs>
            }
            content={data == null ? (
                <WLoading/>
            ) : !data.ok ? (
                <WError error={data.msg} onRetry={loadData}/>
            ) : (
                <div className="p-32">
                    {/* {selectedTab === 0 && (
                        <Form spacing={4}>

                            <FText
                                sm={4}
                                label="Símbolo de moneda"
                                name="coin"
                                value={item.coin}
                                onChange={changed}/>

                            <FNumber
                                sm={4}
                                label="Intervalo"
                                name="interval"
                                value={item.interval}
                                onChange={changed}
                                suffix=" segundos"
                                info="Intervalo de actualización para módulos en tiempo real."/>

                            <Table sm={12} className="datable border-1">
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={7} className="bold">Configuraciones</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            MySQL Backups
                                        </TableCell>
                                        <TableCell>
                                            <FCheck
                                                value={data.codigo_backups_configurado}
                                                onChange={() => {
                                                    if (data.codigo_backups_configurado) {
                                                        guardarConfig('eliminar_codigo_backup');
                                                    } else {
                                                        guardarConfig('crear_codigo_backup');
                                                    }
                                                }}
                                                dense/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={7} className="bold">Cron Jobs</TableCell>
                                    </TableRow>
                                    {data.crons.map((o, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="w1 text-center">{o.hour}</TableCell>
                                            <TableCell className="w1 text-center">{o.minute}</TableCell>
                                            <TableCell className="w1 text-center">{o.day_of_month}</TableCell>
                                            <TableCell className="w1 text-center">{o.month}</TableCell>
                                            <TableCell className="w1 text-center">{o.day_of_week}</TableCell>
                                            <TableCell>{o.command}</TableCell>
                                            <TableCell className="w1">
                                                <FCheck
                                                    value={o.instalado}
                                                    onChange={() => {
                                                        if (o.instalado) {
                                                            guardarConfig('eliminar_cron', {id: o.id});
                                                        } else {
                                                            guardarConfig('instalar_cron', {id: o.id});
                                                        }
                                                    }}
                                                    dense/>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={7} className="bold">Copias de seguridad</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <Fildirs items={data.mysql_backups}/>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                        </Form>
                    )}
                    {selectedTab === 1 && (
                        <Form spacing={4}>

                            <FText
                                sm={6}
                                label="Remitente"
                                name="mail_sender"
                                value={item.mail_sender}
                                onChange={changed}
                                info="Todos los correos electrónicos se enviarán con esta dirección."/>

                            <FText
                                sm={6}
                                label="Copia oculta"
                                name="mail_bcc"
                                value={item.mail_bcc}
                                onChange={changed}
                                info="Puede ingresar varios correos electrónicos separados por comas."/>

                            <FCheck
                                sm={6}
                                label="Autenticación SMTP"
                                name="mail_auth"
                                value={item.mail_auth}
                                onChange={changed}/>

                            <FText
                                sm={6}
                                label="Host"
                                name="mail_host"
                                value={item.mail_host}
                                onChange={changed}/>

                            <FText
                                sm={6}
                                label="Usuario"
                                name="mail_username"
                                value={item.mail_username}
                                onChange={changed}/>

                            <FText
                                sm={6}
                                label="Contraseña"
                                name="mail_password"
                                value={item.mail_password}
                                onChange={changed}/>

                        </Form>
                    )} */}
                    {selectedTab === 0 && (
                        <Form spacing={4}>
                            <FText
                                sm={6}
                                label="Marca"
                                name="brand"
                                value={item.brand}
                                onChange={changed}/>

                            <FText
                                onKeyPress={InputUtils.onlyNumbers}
                                inputProps={{
                                    maxLength: 11,
                                }}
                                sm={6}
                                label="Documento"
                                name="ruc"
                                value={item.ruc}
                                onChange={changed}/>

                            <FText
                                sm={12}
                                label="Nombre legal"
                                name="name"
                                value={item.name}
                                onChange={changed}/>

                            <FText
                                sm={6}
                                label="Sitio web"
                                name="website"
                                value={item.website}
                                onChange={changed}/>

                            <FText
                                sm={6}
                                label="Correo electrónico"
                                name="email"
                                value={item.email}
                                onChange={changed}/>

                            <FText
                                sm={6}
                                onKeyPress={InputUtils.onlyNumbers}
                                inputProps={{
                                    maxLength: 9,
                                }}
                                label="Teléfono"
                                name="phone"
                                value={item.phone}
                                onChange={changed}/>

                            <FText
                                sm={6}
                                label="Ubicación"
                                name="country_code"
                                value={item.country_code}
                                onChange={changed}/>

                            <FText
                                sm={12}
                                label="Dirección"
                                name="address"
                                value={item.address}
                                onChange={changed}/>

                            <FFile
                                sm={6}
                                label="Logo"
                                name="pic_logo"
                                value={item.pic_logo}
                                onChange={changed}
                                image original/>

                            <FFile
                                sm={6}
                                label="Favicon"
                                name="pic_favicon"
                                value={item.pic_favicon}
                                onChange={changed}
                                image original/>

                        </Form>
                    )}
                    {/* {selectedTab === 3 && (
                        <Form spacing={4}>

                            <FText
                                sm={12}
                                label="Google Maps"
                                name="key_maps"
                                value={item.key_maps}
                                onChange={changed}/>

                            <FText
                                sm={12}
                                label="Firebase"
                                name="key_firebase"
                                value={item.key_firebase}
                                onChange={changed}/>

                        </Form>
                    )} */}
                </div>
            )}
            rightSidebarHeader={<div/>}
            rightSidebarContent={data == null || !data.ok ? <div/> : (
                <Info className="p-8" spacing={1}>
                    {/* <InfoDetail>
                        <b>Sistema</b>
                    </InfoDetail>
                    <InfoDetail title="Fecha">{data.tiempo.fecha}</InfoDetail>
                    <InfoDetail title="Diferencia">{data.tiempo.diferencia}</InfoDetail>
                    <InfoDetail title="Zona hor." tooltip="Zona horaria">{data.tiempo.zona_horaria}</InfoDetail>
                    <InfoDetail title="V. CMS" tooltip="Versión del CMS">{item.cms_version}</InfoDetail> */}
                </Info>
            )}
            innerScroll
        />
    )
}