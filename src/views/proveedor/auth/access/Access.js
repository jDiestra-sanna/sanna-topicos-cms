import React, {useEffect, useState} from 'react';
import {Button, Card, CardContent, CircularProgress, TextField, Typography} from '@material-ui/core';
import {darken} from '@material-ui/core/styles/colorManipulator';
import {makeStyles} from '@material-ui/styles';
import FuseAnimate from '@fuse/core/FuseAnimate';
import {useForm} from '@fuse/hooks';
import clsx from 'clsx';
import Pic from "../../../../inc/Pic";
import {stg} from "../../../../inc/Utils";
import Api from "../../../../inc/Api";
import Alert from "../../../../inc/Alert";
import Icon from "@material-ui/core/Icon";
import Toast from "../../../../inc/Toast";

const useStyles = makeStyles(theme => ({
    root: {
        background: 'radial-gradient(' + darken(theme.palette.primary.dark, 0.5) + ' 0%, ' + theme.palette.primary.dark + ' 80%)',
        color     : theme.palette.primary.contrastText
    }
}));

export default function (props) {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {form, handleChange, resetForm} = useForm({
        password1: '',
        password2: '',
    });

    useEffect(() => check(), []);

    function check() {
        setLoading(true);
        Api.get('/../proveedor/auth/access', {tk: props.match.params.token}, rsp => {
            setLoading(false);
            if (rsp.ok) {

                if (rsp.token) {
                    props.history.push({pathname: '/login'});
                } else {

                }

            } else {
                Toast.error(rsp.msg);
                props.history.push({pathname: '/login'});
            }
        });
    }

    function save() {
        form.tk = props.match.params.token;

        setLoading(true);
        Api.get('/../proveedor/auth/createPassword', form, rsp => {
            setLoading(false);
            if (rsp.ok) {
                resetForm();
                props.history.push({pathname: '/login'});
                Toast.success('Tu contraseña ha sido creada exitosamente.');
            } else {
                Alert.error(rsp.msg);
            }
        });
    }

    function isFormValid() {
        return form.password1.length > 0 && form.password1 === form.password2;
    }

    function handleSubmit(ev) {
        ev.preventDefault();
        save();
    }

    return (
        <div className={clsx(classes.root, "flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32")}>

            <div className="flex flex-col items-center justify-center w-full">

                <div className="w-128 mb-32">
                    <img src={stg.pic_logo} alt="logo"/>
                </div>

                <FuseAnimate animation="transition.expandIn">


                    <Card className="w-full max-w-384">
                        {error ? (
                            <CardContent className="flex flex-col items-center justify-center p-32">

                                <Icon style={{color: '#E43A45', fontSize: 64}}>error</Icon>

                                <Typography variant="h6" align="center">
                                    {error}
                                </Typography>

                            </CardContent>
                        ) : loading ? (
                            <CardContent className="flex flex-col items-center justify-center p-32">

                                <CircularProgress/>

                            </CardContent>
                        ) : (
                            <CardContent className="flex flex-col items-center justify-center p-32">

                                <Typography variant="h6" className="mb-32">Crear contraseña</Typography>

                                <form
                                    name="recoverForm"
                                    noValidate
                                    className="flex flex-col justify-center w-full"
                                    onSubmit={handleSubmit}
                                >

                                    <TextField
                                        className="mb-16"
                                        label="Nueva contraseña"
                                        autoFocus
                                        type="password"
                                        name="password1"
                                        value={form.password1}
                                        onChange={handleChange}
                                        variant="outlined"
                                        required
                                        fullWidth
                                    />

                                    <TextField
                                        className="mb-16"
                                        label="Repetir contraseña"
                                        type="password"
                                        name="password2"
                                        value={form.password2}
                                        onChange={handleChange}
                                        variant="outlined"
                                        required
                                        fullWidth
                                    />

                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        className="w-224 mx-auto mt-16"
                                        disabled={!isFormValid()}
                                        type="submit">
                                        Guardar
                                    </Button>

                                </form>

                                {/*<div className="flex flex-col items-center justify-center pt-32 pb-24">
                                <Link className="font-medium" to="/pages/auth/login">Go back to login</Link>
                            </div>*/}

                            </CardContent>
                        )}
                    </Card>
                </FuseAnimate>
            </div>
        </div>
    );
}