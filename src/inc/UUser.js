import Alert from "./Alert";
import Api from "./Api";
import jwtService from "../app/services/jwtService/jwtService";
import history from "../@history";

export default class UUser {

    static loginAs(o) {
        Alert.confirm('Estás a punto de iniciar sesión como ' + o.name + ' ' + o.surname + '.', () => {
            Api.post('/users/loginAs', {id: o.id}, rsp => {
                if (rsp.ok) {
                    jwtService.logout();
                    jwtService.setSession(rsp.token);
                    jwtService.emitOnAutoLogin();
                    history.push('/');
                } else {
                    Alert.error(rsp.msg);
                }
            }, 'Iniciando sesión...');
        });
    }

}