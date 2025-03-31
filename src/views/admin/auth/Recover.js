import React, { useEffect, useRef, useState } from 'react';
import { Box, Card, CardContent, InputAdornment, Typography } from '@material-ui/core';
import Button from 'widgets/sanna/Button';
import { makeStyles } from '@material-ui/styles';
import FuseAnimate from '@fuse/core/FuseAnimate';
import Api from '../../../inc/Apiv2';
import Icon from '@material-ui/core/Icon';
import { Link } from 'react-router-dom';
import Formsy from 'formsy-react';
import TextFieldFormsy from '@fuse/core/formsy/TextFieldFormsy';
import { useSelector } from 'react-redux';
import Alert from '../../../inc/Alert';
import picRecover from './recover.png';
import picRecoverSent from './recoverSent.png';
import clsx from 'clsx';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const useStyles = makeStyles(theme => ({
	root: {
		backgroundColor: theme.palette.primary.main
	},
	card: {
		borderRadius: 16
	}
}));

export function _Recover(props) {
	const classes = useStyles();
	const { executeRecaptcha } = useGoogleReCaptcha();

	const login = useSelector(({ auth }) => auth.login);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [email, setEmail] = useState('');

	const [isFormValid, setIsFormValid] = useState(false);
	const formRef = useRef(null);

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

	async function submit(model) {
		if (!executeRecaptcha) {
			return;
		}

		const token = await executeRecaptcha('recover');

		const response = await Api.post('/auth/reset-password', { username: model.email, token_recaptcha: token });
		
		if (response.ok) {
			setIsSubmitted(true);
			setEmail(model.email);
		} else {
			Alert.error(response.message);
		}
		
	}

	return (
		<div className={clsx(classes.root, 'flex flex-col flex-auto flex-shrink-0 items-center justify-center p-24')}>
			<div className="flex flex-col items-center justify-center w-full">
				<FuseAnimate animation="transition.expandIn">
					<Card className={classes.card}>
						<CardContent className="flex flex-col items-center justify-center p-24">
							{isSubmitted ? (
								<>
									<Box className="mb-24">
										<img src={picRecoverSent} />
									</Box>

									<Typography variant="h6" style={{ marginBottom: '1rem' }}>
										Correo enviado
									</Typography>

									<Typography variant="body2" align="center">
										Si tu usuario se encuentra registrado, te enviaremos las instrucciones para reestablecer tu contraseña a
									</Typography>

									<div className="mb-24">
										<span
											style={{
												color: '#5D59EF',
												fontWeight: 'bold',
												textDecoration: 'underline'
											}}
										>
											{email}
										</span>
									</div>

									<Button
										type="submit"
										disabled={!isFormValid}
										onClick={_ => props.history.replace({ pathname: './login' })}
										fullWidth
									>
										Aceptar
									</Button>
								</>
							) : (
								<>
									<Box className="mb-24">
										<img src={picRecover} />
									</Box>

									<Typography variant="h6" style={{ marginBottom: '1rem' }}>
										Restablecer contraseña
									</Typography>

									<Typography variant="body2" style={{ marginBottom: '2rem' }} align="center">
										Ingresa el correo vinculado a tu cuenta para cambiar tu contraseña
									</Typography>

									<div className="w-full">
										<Formsy
											onValidSubmit={submit}
											onValid={enableButton}
											onInvalid={disableButton}
											ref={formRef}
											className="flex flex-col justify-center w-full"
										>
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
															<Icon className="text-20" color="action">
																email
															</Icon>
														</InputAdornment>
													)
												}}
												InputLabelProps={{
													shrink: true
												}}
												variant="outlined"
												required
											/>

											<Button type="submit" disabled={!isFormValid} fullWidth>
												Enviar correo
											</Button>
										</Formsy>
									</div>

									<div className="pt-24 text-right">
										<Link className="font-medium" to="./login">
											<span
												style={{
													color: '#5D59EF',
													fontWeight: 'bold',
													textDecoration: 'underline'
												}}
											>
												Volver al inicio de sesión
											</span>
										</Link>
									</div>
								</>
							)}
						</CardContent>
					</Card>
				</FuseAnimate>
			</div>
		</div>
	);
}

export default function Recover(props) {
	return (
		// Prod
		<GoogleReCaptchaProvider reCaptchaKey='6Lex2OUqAAAAABUM_l4JxkkQhlAnqwMZMpfQ1_5W' scriptProps={{async: true}}>

			{/* Dev */}
		{/* <GoogleReCaptchaProvider reCaptchaKey='6LeGUukqAAAAABNJHJmXwQvM9xoeqvdC12gHe5Ow' scriptProps={{async: true}}> */}
			<_Recover {...props} />
		</GoogleReCaptchaProvider>
	)
}