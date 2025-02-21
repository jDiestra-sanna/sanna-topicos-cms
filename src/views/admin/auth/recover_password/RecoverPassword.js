import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CircularProgress, TextField, Typography } from '@material-ui/core';
import Button from 'widgets/sanna/Button';
import { makeStyles } from '@material-ui/styles';
import FuseAnimate from '@fuse/core/FuseAnimate';
import { useForm } from '@fuse/hooks';
import clsx from 'clsx';
import Api from '../../../../inc/Apiv2';
import Icon from '@material-ui/core/Icon';
import Alert from '../../../../inc/Alert';
import picRecover from '../recover.png';
import picRecoverSucces from './recoverSuccess.png';

const useStyles = makeStyles(theme => ({
	root: {
		backgroundColor: theme.palette.primary.main
	},
	card: {
		borderRadius: '16px'
	},
	[theme.breakpoints.up('md')]: {
		card: {
			width: '500px'
		}
	}
}));

export default function (props) {
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState(null);
	const { form, handleChange, resetForm } = useForm({
		password1: '',
		password2: ''
	});

	useEffect(() => {
		check()
	}, []);

	async function check() {
		setLoading(true);
		const response = await Api.get(`/auth/reset-password/${props.match.params.token}`);
		setLoading(false);

		if (!response.ok) {
			setError(response.message || 'Se produjo un error');
		}
	}

	async function save() {
		const token = props.match.params.token;
		const data = {
			password: form.password1,
			repeat_password: form.password2,
		}

		setLoading(true);

		const response = await Api.put(`/auth/reset-password/${token}`, data);

		setLoading(false);

		if (response.ok) {
			setIsSuccess(true);
		} else {
			Alert.error(response.message);
		}		
	}

	function isFormValid() {
		return form.password1.length > 0 && form.password1 === form.password2;
	}

	function handleSubmit(ev) {
		ev.preventDefault();
		save();
	}

	return (
		<div className={clsx(classes.root, 'flex flex-col flex-auto flex-shrink-0 items-center justify-center p-24')}>
			<div className="flex flex-col items-center justify-center w-full">
				<FuseAnimate animation="transition.expandIn">
					<Card className={clsx(classes.card)}>
						{error ? (
							<CardContent className="flex flex-col items-center justify-center p-32">
								<Icon style={{ color: '#E43A45', fontSize: 64 }}>error</Icon>

								<Typography variant="h6" align="center">
									{error}
								</Typography>
							</CardContent>
						) : loading ? (
							<CardContent className="flex flex-col items-center justify-center p-32">
								<CircularProgress />
							</CardContent>
						) : (
							<CardContent className="flex flex-col items-center justify-center p-32">
								{isSuccess ? (
									<>
										<Box className="mb-24">
											<img src={picRecoverSucces} />
										</Box>

										<Typography variant="h6" style={{ marginBottom: '1rem' }}>
											Contraseña restaurada
										</Typography>

										<Typography variant="body2" style={{ marginBottom: '2rem' }} align="center">
											Se ha reestablecido tu contraseña con éxito
										</Typography>

										<Button
											type="submit"
											onClick={_ => props.history.replace({ pathname: '/login' })}
											fullWidth
										>
											Iniciar sesión
										</Button>
									</>
								) : (
									<>
										<Box className="mb-24">
											<img src={picRecover} />
										</Box>

										<Typography variant="h6" style={{ marginBottom: '1rem' }}>
											Crear nueva contraseña
										</Typography>

										<Typography variant="body2" style={{ marginBottom: '2rem' }} align="center">
											Ingresa una nueva contraseña para ingresar a tu cuenta en SANNA tópicos
										</Typography>

										<form
											name="recoverForm"
											noValidate
											className="flex flex-col justify-center w-full"
											onSubmit={handleSubmit}
										>
											<TextField
												className="mb-16"
												label="Ingresa tu nueva contraseña"
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
												label="Ingresa nuevamente tu contraseña"
												type="password"
												name="password2"
												value={form.password2}
												onChange={handleChange}
												variant="outlined"
												required
												fullWidth
											/>

											<Button disabled={!isFormValid()} type="submit" fullWidth>
												Restablecer contraseña
											</Button>
										</form>
									</>
								)}
							</CardContent>
						)}
					</Card>
				</FuseAnimate>
			</div>
		</div>
	);
}
