import axios from 'axios';
import Util, { getUser } from './Utils';
import Pref from './Pref';
import Alert from './Alert';
import jwtService from '../app/services/jwtService/jwtService';
import history from '@history/@history';
import platform from 'platform'

function onTokenExpired() {
	Pref.sessionUsers = Pref.sessionUsers.filter(o => o.id !== getUser().data?.id);
	jwtService.logout();

	setTimeout(() => {
		if (history.location.pathname !== '/login') {
			Alert.error('La sesión ha expirado');
			history.push('/login');
		}
	}, 1000);
}

export default class Api {
	static DOMAIN = ['localhost', '127.0.0.1'].includes(window.location.hostname)
		? 'localhost'
		: window.location.hostname;

	static PORT = platform.name === 'windows' ? ':8203' : '';

	static PROTOCOL = ['localhost', '127.0.0.1'].includes(window.location.hostname)
		? 'http:'
		: window.location.protocol;

	static URL_BASE = Api.PROTOCOL + '//' + Api.DOMAIN + Api.PORT +'/api/v1';

	static async get(url, data = {}, loading = true) {
		Util.loading(loading);

		try {

            // 200
			const response = await Api.axios().get(url, { params: data });

			Util.loading(false);

			return {... response.data, ok: true};

		} catch (error) {

            // error 300,400,500

            Util.loading(false);

			if (error.response) {
				console.error('Respuesta de error:', error.response);

				if (error.response.status == 401 && getUser().data) {
					onTokenExpired()
				}

			} else if (error.request) {
				// 'La solicitud fue realizada pero no se recibió respuesta del servidor';
				console.error('Error de solicitud:', error.request);

			} else {
				//  'Algo sucedió en la configuración de la solicitud que desencadenó un error';
				console.error('Error:', error.message);
			}

            let message = 'Ups, ocurrio un error en el servidor';

            if (Array.isArray(error.response?.data?.message) && error.response?.data?.message) {
                message = error.response?.data?.message[0];
            }
            
			if (typeof error.response?.data?.message === 'string' && error.response?.data?.message) {
                message = error.response?.data?.message;
            }

            return {...error.response?.data || {}, ok: false, message: message}
		}
	}

    static async post(url, data, loading = true) {
        Util.loading(loading);

        try {
            // 200
            const response = await Api.axios().post(url, data)

			Util.loading(false);

			return {... response.data, ok: true};

		} catch (error) {

            // error 300,400,500

            Util.loading(false);

			if (error.response) {
				console.error('Respuesta AJAX:', error.response);

				if (error.response.status == 401 && getUser().data) {
					onTokenExpired()
				}

			} else if (error.request) {
				// 'La solicitud fue realizada pero no se recibió respuesta del servidor';
				console.error('Error de solicitud:', error.request);

			} else {
				//  'Algo sucedió en la configuración de la solicitud que desencadenó un error';
				console.error('Error:', error.message);
			}

            let message = 'Ups, ocurrio un error en el servidor';

            if (Array.isArray(error.response?.data?.message) && error.response?.data?.message) {
                message = error.response?.data?.message[0];
            }

			if (typeof error.response?.data?.message === 'string' && error.response?.data?.message) {
                message = error.response?.data?.message;
            }
            
            return {...error.response?.data || {}, ok: false, message: message}
		}
    }

    static async patch(url, data = {}, loading = true) {
        Util.loading(loading);

        try {

            // 200
            const response = await Api.axios().patch(url, data)

			Util.loading(false);

			return {... response.data, ok: true};

		} catch (error) {

            // error 300,400,500

            Util.loading(false);

			if (error.response) {
				console.error('Respuesta AJAX:', error.response);

				if (error.response.status == 401 && getUser().data) {
					onTokenExpired()
				}

			} else if (error.request) {
				// 'La solicitud fue realizada pero no se recibió respuesta del servidor';
				console.error('Error de solicitud:', error.request);

			} else {
				//  'Algo sucedió en la configuración de la solicitud que desencadenó un error';
				console.error('Error:', error.message);
			}

            let message = 'Ups, ocurrio un error en el servidor';

            if (Array.isArray(error.response?.data?.message) && error.response?.data?.message) {
                message = error.response?.data?.message[0];
            }

			if (typeof error.response?.data?.message === 'string' && error.response?.data?.message) {
                message = error.response?.data?.message;
            }
            
            return {...error.response?.data || {}, ok: false, message: message}
		}
    }

	static async put(url, data = {}, loading = true) {
        Util.loading(loading);

        try {

            // 200
            const response = await Api.axios().put(url, data)

			Util.loading(false);

			return {... response.data, ok: true};

		} catch (error) {

            // error 300,400,500

            Util.loading(false);

			if (error.response) {
				console.error('Respuesta AJAX:', error.response);

				if (error.response.status == 401 && getUser().data) {
					onTokenExpired()
				}

			} else if (error.request) {
				// 'La solicitud fue realizada pero no se recibió respuesta del servidor';
				console.error('Error de solicitud:', error.request);

			} else {
				//  'Algo sucedió en la configuración de la solicitud que desencadenó un error';
				console.error('Error:', error.message);
			}

            let message = 'Ups, ocurrio un error en el servidor';

            if (Array.isArray(error.response?.data?.message) && error.response?.data?.message) {
                message = error.response?.data?.message[0];
            }

			if (typeof error.response?.data?.message === 'string' && error.response?.data?.message) {
                message = error.response?.data?.message;
            }
            
            return {...error.response?.data || {}, ok: false, message: message}
		}
    }

    static async delete(url, data = {}, loading = true) {
        Util.loading(loading);

        try {

            // 200
            const response = await Api.axios().delete(url, data)

			Util.loading(false);

			return {... response.data, ok: true};

		} catch (error) {

            // error 300,400,500

            Util.loading(false);

			if (error.response) {
				console.error('Respuesta AJAX:', error.response);

				if (error.response.status == 401 && getUser().data) {
					onTokenExpired()
				}

			} else if (error.request) {
				// 'La solicitud fue realizada pero no se recibió respuesta del servidor';
				console.error('Error de solicitud:', error.request);

			} else {
				//  'Algo sucedió en la configuración de la solicitud que desencadenó un error';
				console.error('Error:', error.message);
			}

            let message = 'Ups, ocurrió un error en el servidor, vuelva a intentarlo.';

            if (Array.isArray(error.response?.data?.message) && error.response?.data?.message) {
                message = error.response?.data?.message[0];
            }

			if (typeof error.response?.data?.message === 'string' && error.response?.data?.message) {
                message = error.response?.data?.message;
            }
            
            return {...error.response?.data || {}, ok: false, message: message}
		}
    }

	static download(endpoint, fil = {}, loading = 'Descargando...') {
		Util.loading(loading);

		Api.axios().get(endpoint, {
			params: fil,
			responseType: 'blob'
		  })
			.then(response => {
				const headerLine = response.headers['content-disposition'];
				const startFileNameIndex = headerLine.indexOf('"') + 1
        		const endFileNameIndex = headerLine.lastIndexOf('"');
        		const filename = headerLine.substring(startFileNameIndex, endFileNameIndex);

			  	// Crear una URL para el objeto Blob
			  	const url = window.URL.createObjectURL(new Blob([response.data]));
			  	// Crear un enlace <a> temporal
			  	const a = document.createElement('a');
			  	a.href = url;
			  	// Especificar el nombre del archivo para descargar
			  	a.download = filename;
			  	// Simular un clic en el enlace para iniciar la descarga
			  	a.click();
			  	// Liberar la URL del objeto Blob
			  	window.URL.revokeObjectURL(url);
			  	Util.loading(false);
			})
			.catch(error => {
			  console.error('Error:', error);
			  Util.loading(false);
			});
	}

	static axios() {
		return axios.create({
			baseURL: Api.URL_BASE
			//headers: {'Authorization': 'Bearer ' + token},
		});
	}
}
