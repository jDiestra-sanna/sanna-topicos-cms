import { AuthUser } from 'models/user';
import { Card, CardContent, InputAdornment, Icon, Box, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import Api from 'inc/Apiv2';
import axios from 'axios';
import Button from 'widgets/sanna/Button';
import clsx from 'clsx';
import Colors from 'inc/Colors';
import Form from 'widgets/fields/Form';
import FText from 'widgets/fields/FText';
import FuseAnimate from '@fuse/core/FuseAnimate';
import googleAuthenticator from './google-authenticator.svg';
import history from '@history';
import jwtService from '../../../app/services/jwtService/jwtService';
import picLogin from './login.png';
import picLoginText from './loginText.png';
import Pref from 'inc/Pref';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import useAuthUser from 'hooks/auth-user';
import Util, { InputUtils, stg } from 'inc/Utils';
import Alert from 'inc/Alert';
import Roles from 'models/roles';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: '1.15rem',
    width: '100%',
    minHeight: '100%',
  },
  googleAuthItem: {
    fontFamily: 'Stag Sans',
    width: 300,
    marginBottom: 24,
    '& .title': {
      fontWeight: 500,
      fontSize: 16,
    },
    '& .body': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    '& .code': {
      color: '#1A73E8',
      fontSize: 20,
    },
    '& .loader': {
      width: 16,
      height: 16,
      borderRadius: '50%',
      position: 'relative',
      transform: 'rotate(45deg)',
      background: '#fff',
      '&::before': {
        content: '""',
        boxSizing: 'border-box',
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        border: '8px solid #1A73E8',
        animation: '$prixClipFix 15s infinite linear',
      },
    },
  },
  '@keyframes prixClipFix': {
    '0%': { clipPath: 'polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0)' },
    '25%': { clipPath: 'polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0)' },
    '50%': { clipPath: 'polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%)' },
    '75%': { clipPath: 'polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%)' },
    '100%': { clipPath: 'polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0)' },
  },
  card: {
    borderRadius: '1rem',
    height: '100%',
  },
  picLogin: {
    height: '108px',
    '& img': {
      display: 'block',
      height: '100%',
    },
  },
  '@media (max-height: 600px)': {
    root: {
      minHeight: 'auto',
    },
  },
  [theme.breakpoints.up('md')]: {
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      width: '500px',
      height: 'auto',
    },
    picLogin: {
      height: '168px',
    },
  },
}));

const AUTH_STEP = {
  LOGIN: 1,
  OTP_REGISTER: 2,
  OTP_VALIDATE: 3,
};

export function Loginn(props) {
  const [authStep, setAuthStep] = useState(AUTH_STEP.LOGIN);
  const authUser = useAuthUser();
  const {executeRecaptcha} = useGoogleReCaptcha();
  const classes = useStyles();
  const qrBase64Ref = useRef();
  const [otpCode, setOtpCode] = useState('');
  const recaptchaRef = useRef();
  const [tokenCaptcha, setTokenCaptcha] = useState('');
  const [item, setItem] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  function changed(e) {
    setItem({
      ...item,
      [e.target.name]: e.target.value,
    });
  }

  async function askOpenNewSession() {
    return await new Promise((resolve) => {
      Alert.confirm(
        'Ya tiene una sesión abierta, desea cerrar la sesión anterior y abrir otra aquí', 
        'Confirmar', 
        () => resolve(true),
        () => resolve(false)
      )
    });
  }

  async function goLogin(isPre = false) {
    if (!executeRecaptcha) {
      return
    }

    const token = await executeRecaptcha('login');
    setTokenCaptcha(token);

    let data = {
      ...Util.dataSession(),
      ...item,
      token_recaptcha: token,
      totp_code: otpCode,
    };

    setLoading(true);
    setError(null);
    setErrors(null);

    if (isPre) {
      const responseStatusLoggedIn = await Api.post('/auth/status-logged-in', { email: item.username },'Validando...');
      
      if (!responseStatusLoggedIn.ok) {
        return setError(responseStatusLoggedIn.message);
      }

      if (responseStatusLoggedIn.data.isLoggedIn) {
        const hasAccepted = await askOpenNewSession();

        if (!hasAccepted) return setLoading(false);
      }
    }

    delete axios.defaults.headers.common['Authorization'];
    let response;

    if (isPre) {
      response = await Api.post('/auth/pre-login', data, 'Validando...');
    } else {
      response = await Api.post('/auth/login', data, 'Validando...');
    }

    setLoading(false);

    if (!response.ok) {
      setTokenCaptcha('');
      if (recaptchaRef.current) recaptchaRef.current.reset();
      setError(response.message);
      return setErrors(response.errors);
    }

    if (response.data?.role_id === Roles.ROOT_ID) {
      return startSession(response.data);
    }

    if (isPre) {
      qrBase64Ref.current = response.data;

      if (qrBase64Ref.current) {
        setAuthStep(AUTH_STEP.OTP_REGISTER);
      } else {
        setAuthStep(AUTH_STEP.OTP_VALIDATE);
      }
    } else {
      startSession(response.data);
    }
  }

  async function addLocalSession({ id, name, surname, pic, access_token, role_name }) {
    if (props.match.params.action !== 'add_account') return;

    let sessionUsers = Pref.sessionUsers;

    let newSessionUser = {
      color: Colors.randMaterialColor(),
      id: id,
      name: name,
      surname: surname,
      pic: pic,
      token: access_token,
      role_name: role_name,
    };

    let indexSessionUser = sessionUsers.findIndex(o => o.id === id);

    if (indexSessionUser === -1) {
      sessionUsers.push(newSessionUser);
    } else {
      sessionUsers[indexSessionUser] = newSessionUser;
    }

    Pref.sessionUsers = sessionUsers;
  }

  function goHome(access_token) {
    jwtService.setUser(null);
    jwtService.setSession(access_token);
    jwtService.emitOnAutoLogin();
    history.push('/');
  }

  function startSession(userSession) {
    goHome(userSession.access_token);
    addLocalSession(userSession);
  }

  return (
    <div className={clsx(classes.root)}>
      <FuseAnimate animation={{ translateY: [0, '100%'] }}>
        <Card
          className={clsx(classes.card)}
          square
        >
          <CardContent className="flex flex-col items-center justify-center">
            {authStep === AUTH_STEP.LOGIN ? (
              <>
                <Box className={clsx(classes.picLogin, 'mb-24')}>
                  <img src={picLogin} />
                </Box>

                <Box className="mb-24">
                  <img src={picLoginText} />
                </Box>

                <Form
                  onSubmit={() => goLogin(true)}
                  error={error}
                  errors={errors}
                  disabled={loading}
                  style={{ width: '100%' }}
                >
                  <FText
                    name="username"
                    value={item.username}
                    onChange={changed}
                    label="Correo electrónico"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icon
                            className="text-20"
                            color="action"
                          >
                            email
                          </Icon>
                        </InputAdornment>
                      ),
                    }}
                    margin="normal"
                    shrink
                  />

                  <FText
                    name="password"
                    value={item.password}
                    onChange={changed}
                    label="Contraseña"
                    type="password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icon
                            className="text-20"
                            color="action"
                          >
                            vpn_key
                          </Icon>
                        </InputAdornment>
                      ),
                    }}
                    margin="normal"
                    shrink
                  />

                  <div className="pt-8 text-right">
                    <Link
                      className="font-medium"
                      to="/recover"
                    >
                      <span
                        style={{
                          color: '#5D59EF',
                          fontWeight: 'bold',
                          textDecoration: 'underline',
                        }}
                      >
                        ¿Olvidaste tu contraseña?
                      </span>
                    </Link>
                  </div>

                  {/* {!authUser.settings.debug && (
                    <div>
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey="6LeTV3UpAAAAALrycjhLKI2C2O5JP1eD9MRcCZdC"
                        onChange={setTokenCaptcha}
                      />
                    </div>
                  )} */}

                  <Button
                    type="submit"
                    disabled={
                      authUser.settings.debug
                        ? !item.username || !item.password
                        : !item.username || !item.password //|| !tokenCaptcha
                    }
                    fullWidth
                  >
                    Iniciar sesión
                  </Button>
                </Form>
              </>
            ) : authStep === AUTH_STEP.OTP_REGISTER ? (
              <>
                <Typography
                  variant="h6"
                  className="mb-12"
                >
                  Google Authenticator
                </Typography>
                <img
                  className="mb-16"
                  src={qrBase64Ref.current}
                />
                <Typography
                  className="font-stagsans mb-16"
                  align="center"
                >
                  Instale la aplicación <span className="font-medium">Google Authenticator</span> para habilitar la
                  autenticación de segundo paso, <span className="font-medium">presione el botón</span>{' '}
                  <span className="material-icons-outlined text-16">add_circle_outline</span> y luego{' '}
                  <span className="font-medium">Escanear un código QR</span>{' '}
                  <span className="material-icons-outlined text-16">photo_camera</span>. <br />
                  Si lo hiciste correctamente deberás ver algo como:
                </Typography>
                <div className={classes.googleAuthItem}>
                  <div className="title">Sanna:{item.username}</div>
                  <div className="body">
                    <div className="code">123 456</div>
                    <div className="loader" />
                  </div>
                </div>
                <Button onClick={() => setAuthStep(AUTH_STEP.OTP_VALIDATE)}>Pulsa aquí para continuar</Button>
              </>
            ) : (
              <>
                <img
                  height={40}
                  width={40}
                  src={googleAuthenticator}
                  className="mb-16"
                />
                <Typography
                  variant="h6"
                  className="mb-20 text-16"
                >
                  Google Authenticator
                </Typography>

                <Form
                  onSubmit={() => goLogin()}
                  error={error}
                  errors={errors}
                  disabled={loading}
                  style={{ width: '100%' }}
                >
                  <div>
                    <Typography
                      component="div"
                      className="font-stagsans mb-4 w-full font-medium"
                      align="left"
                    >
                      Ingresa el código de verificación
                    </Typography>

                    <FText
                      type="tel"
                      name="code-otp"
                      onChange={e => setOtpCode(e.target.value)}
                      onKeyPress={e => InputUtils.onlyNumbers(e)}
                      inputProps={{
                        maxLength: 6,
                      }}
                      value={otpCode}
                    />

                    <Typography
                      component="div"
                      className="font-stagsans mt-4 mb-24 w-full text-grey-600 mt-4 mb-20 tracking-wider"
                      align="left"
                      style={{ padding: 0 }}
                    >
                      Abra Google Authenticator, ubique SANNA e ingrese el código de su aplicación de autenticación de
                      dos factores.
                    </Typography>

                    <div className="w-full">
                      <Button
                        type="submit"
                        disabled={otpCode.length !== 6}
                        fullWidth
                      >
                        Verificar código
                      </Button>
                    </div>
                  </div>
                </Form>
              </>
            )}
          </CardContent>
        </Card>
      </FuseAnimate>

      {stg.debug === true && <div className="debug-mode" />}
    </div>
  );
}

export default function Login(props) {
  return (
    <GoogleReCaptchaProvider reCaptchaKey='6Lex2OUqAAAAABUM_l4JxkkQhlAnqwMZMpfQ1_5W' scriptProps={{async: true}}>
      <Loginn {...props} />
    </GoogleReCaptchaProvider>
  )
}
