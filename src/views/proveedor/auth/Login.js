import React, {useEffect, useRef, useState} from 'react'
import {Card, CardContent, Typography, InputAdornment, Icon, Button} from '@material-ui/core';
import FuseAnimate from '@fuse/core/FuseAnimate';
import {Link} from 'react-router-dom';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/styles';
import Formsy from "formsy-react";
import {useSelector} from "react-redux";
import TextFieldFormsy from '@fuse/core/formsy/TextFieldFormsy';
import Api from "../../../inc/Api";
import jwtService from "../../../app/services/jwtService/jwtService";
import Util, {stg} from "../../../inc/Utils";
import Pic from "../../../inc/Pic";
import Alert from "../../../inc/Alert";
import axios from "axios";
import history from "../../../@history/@history";
import Pref from "../../../inc/Pref";
import Colors from "../../../inc/Colors";
import FText from "../../../widgets/fields/FText";
import Grid from "@material-ui/core/Grid";
import ReCAPTCHA from "react-google-recaptcha";
import Form from "../../../widgets/fields/Form";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor   : theme.palette.primary.main,
        backgroundSize    : 'cover',
        backgroundRepeat  : 'no-repeat',
        backgroundPosition: 'center',
        color             : theme.palette.primary.contrastText
    }
}));

export default function (props) {
    const classes = useStyles();

    const login = useSelector(({auth}) => auth.login);

    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);

    const [tokenCaptcha, setTokenCaptcha] = useState('');
    const recaptchaRef = useRef();

    useEffect(() => {
        if (login.error && (login.error.email || login.error.password)) {
            formRef.current.updateInputsWithError({
                ...login.error
            });
            disableButton();
        }
    }, [login.error]);

    function disableButton() {
        setIsFormValid(false);
    }

    function enableButton() {
        setIsFormValid(true);
    }

    function submit(model) {
        let data = Util.dataSession();
        data.username = model.email;
        data.password = model.password;
        data.token_captcha = tokenCaptcha;

        delete axios.defaults.headers.common['Authorization'];

        Api.post('/../proveedor/auth/login', data, rsp => {
            if (rsp.ok) {
                jwtService.setSession(rsp.token);
                jwtService.emitOnAutoLogin();
                history.push('/');

                if (props.match.params.action === 'add_account') {
                    let sessionUsers = Pref.sessionUsers;
                    let newSessionUser = {
                        id     : rsp.id,
                        name   : rsp.name,
                        surname: rsp.surname,
                        pic    : rsp.pic,
                        token  : rsp.token,
                        role_name: rsp.role_name,
                        color  : Colors.randMaterialColor(),
                    };

                    let indexSessionUser = sessionUsers.findIndex(o => o.id === rsp.id);

                    if (indexSessionUser === -1) {
                        sessionUsers.push(newSessionUser);
                    } else {
                        sessionUsers[indexSessionUser] = newSessionUser;
                    }

                    Pref.sessionUsers = sessionUsers;
                }
            } else {
                setTokenCaptcha('');
                recaptchaRef.current.reset();
                Alert.error(rsp.msg);
            }
        });
    }

    return (
        <div className={clsx(classes.root, "flex flex-col flex-1 flex-shrink-0 p-24 md:flex-row md:p-0")}>

            <div
                className="flex flex-col flex-grow-0 items-center text-white p-16 text-center md:p-128 md:items-start md:flex-shrink-0 md:flex-1 md:text-left">

                <FuseAnimate animation="transition.expandIn">
                    <div>
                        <img className="mb-8" src={stg.pic_logo} alt="logo" height={100}/>
                        <Typography variant="h6" className="ml-24" color="textPrimary">Proveedores</Typography>
                    </div>
                </FuseAnimate>

            </div>

            <FuseAnimate animation={{translateX: [0, '100%']}}>

                <Card className="w-full max-w-400 mx-auto m-16 md:m-0" square>

                    <CardContent className="flex flex-col items-center justify-center p-32 md:p-48 md:pt-128 ">

                        <Typography variant="h6" className="text-center md:w-full mb-48">
                            Acceso de proveedores
                        </Typography>

                        <div className="w-full">
                            <Formsy
                                onValidSubmit={submit}
                                onValid={enableButton}
                                onInvalid={disableButton}
                                ref={formRef}
                                className="flex flex-col justify-center w-full">

                                <TextFieldFormsy
                                    className="mb-16"
                                    type="email"
                                    name="email"
                                    label="Correo electrónico"
                                    validations={{
                                        isEmail: true
                                    }}
                                    validationErrors={{
                                        isEmail: 'Ingrese un correo'
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Icon className="text-20" color="action">email</Icon>
                                            </InputAdornment>
                                        )
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                    required/>

                                <TextFieldFormsy
                                    className="mb-16"
                                    type="password"
                                    name="password"
                                    label="Contraseña"
                                    validations={{
                                        minLength: 4
                                    }}
                                    validationErrors={{
                                        minLength: 'Min character length is 4'
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Icon className="text-20" color="action">vpn_key</Icon>
                                            </InputAdornment>
                                        )
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                    required/>

                                <div>
                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        sitekey="6Ld6qkEaAAAAAFVEW651C0cMaX-mWCNJfniuQ-oa"
                                        onChange={setTokenCaptcha}/>
                                </div>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    className="w-full mx-auto mt-16 normal-case"
                                    disabled={!isFormValid || !tokenCaptcha}
                                    value="legacy">
                                    INGRESAR <Icon>chevron_right</Icon>
                                </Button>

                            </Formsy>

                        </div>

                        <div className="flex flex-col items-center justify-center pt-32">
                            <Link className="font-medium" to="/recover">¿Perdió su contraseña?</Link>
                        </div>

                    </CardContent>
                </Card>
            </FuseAnimate>

            {stg.debug === true && <div className="debug-mode"/>}

        </div>
    )
}