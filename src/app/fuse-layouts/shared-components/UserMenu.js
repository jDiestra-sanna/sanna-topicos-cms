import React, {useState} from 'react';
import {Avatar, Button, Icon, ListItemIcon, ListItemText, Popover, MenuItem, Typography} from '@material-ui/core';
import {useDispatch} from 'react-redux';
import * as authActions from 'app/auth/store/actions';
import Api from '../../../inc/Apiv2';
import {pic} from '../../../inc/Utils';
import jwtService from '../../services/jwtService/jwtService';
import Pref from '../../../inc/Pref';
import history from '../../../@history/@history';
import Divider from "@material-ui/core/Divider";
import Alert from 'inc/Alert';
import useAuthUser from 'hooks/auth-user';
import useLocalStorage, { Keys } from 'hooks/useLocalStorage';

function UserMenu(props) {
    const [attendance, setAttendance] = useLocalStorage(Keys.ATTENDANCE);
    const dispatch = useDispatch();
    const [campus, setCampus] = useState([]);
    const [userMenu, setUserMenu] = useState(null);
    const [sessionUsers] = useState(() => Pref.sessionUsers);
    const user = useAuthUser();

    React.useEffect(() => {
        getCampus();
    }, []);

    const userMenuClick = event => {
        if (!user.isHealthTeam()) return;
        setUserMenu(event.currentTarget);
    };

    const userMenuClose = () => {
        setUserMenu(null);
    };

    const getCampus = async () => {
        if (!user.isHealthTeam()) return;
    
        const response = await Api.get('/dropdown-options/scheduled-campuses', { user_id: user.data?.id });
        if (!response.ok) return Alert.error(response.message);

        setCampus(response.data);
    };

    async function logout() {
        const response = await Api.delete('/auth/logout', {}, false);
        if (!response.ok) return Alert.error(response.message);
        userMenuClose();

        // eliminar el usuario actual de la lista
        Pref.sessionUsers = Pref.sessionUsers.filter(o => o.id !== user.data.id);
        dispatch(authActions.logoutUser());
        Pref.urlApiBase = '';
        jwtService.emitOnSetup();
    }

    return (
        <React.Fragment>

            <Button 
                className="h-64" 
                onClick={userMenuClick}
            >
                <Avatar src={pic(user.data.pic)}>
                    <Icon>person</Icon>
                </Avatar>

                <div className="hidden md:flex flex-col ml-12 items-start">
                    <Typography component="span" className="normal-case font-600 flex">
                        {user.data.displayName}
                    </Typography>
                    <Typography className="text-11 capitalize" color="textSecondary">
                        {user.data.co_name
                            ? user.data.co_name
                            : user.data.role_name} {user.isHealthTeam() ? `— ${attendance?.campus?.name ?? ''}` : ''}
                    </Typography>
                </div>

                <Icon className="text-16 ml-12 hidden sm:flex" variant="action">keyboard_arrow_down</Icon>
            </Button>

            <Popover
                open={Boolean(userMenu)}
                anchorEl={userMenu}
                onClose={userMenuClose}
                anchorOrigin={{
                    vertical  : 'bottom',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical  : 'top',
                    horizontal: 'center'
                }}
                classes={{
                    paper: 'py-8'
                }}>

                {sessionUsers.length > 0 && <>
                    {sessionUsers.map((o, i) => {
                        let selected = o.id === user.data.id;
                        return (
                            <MenuItem
                                key={o.id}
                                onClick={() => {
                                    jwtService.setUser(null);
                                    jwtService.setSession(o.token);
                                    jwtService.emitOnAutoLogin();
                                    history.push('/');
                                }}
                                ContainerComponent="div"
                                disabled={selected}
                                className="py-4"
                                dense>
                                <ListItemIcon className="min-w-40">
                                    <Avatar
                                        style={{
                                            width     : 28,
                                            height    : 28,
                                            background: /*o.color ||*/ '#555555',
                                            fontSize  : 16,
                                        }}>{i + 1}</Avatar>
                                </ListItemIcon>
                                <ListItemText
                                    className="pl-0"
                                    primary={o.name + ' ' + o.surname}/>
                            </MenuItem>
                        );
                    })}
                    <Divider className="my-8"/>
                </>}

                {campus.map(o => (
                    <MenuItem
                        key={o.id}
                        disabled={o.id === (attendance ? attendance.campus.id : '')}
                        onClick={() => {
                            if (attendance) {
                                setAttendance({
                                    ...attendance,
                                    campus: o,
                                });
                            }
                            userMenuClose();
                        }}
                    >
                        <ListItemIcon className="min-w-40">
                            <Icon>school</Icon>
                        </ListItemIcon>
                        <ListItemText className="pl-0" primary={o.name}/>
                    </MenuItem>
                ))}

                {/* <MenuItem onClick={() => {
                    userMenuClose();
                    history.push('/perfil');
                }}>
                    <ListItemIcon className="min-w-40">
                        <Icon>edit</Icon>
                    </ListItemIcon>
                    <ListItemText className="pl-0" primary="Editar perfil"/>
                </MenuItem>

                <MenuItem onClick={() => history.push('/login/add_account')}>
                    <ListItemIcon className="min-w-40">
                        <Icon>person_add</Icon>
                    </ListItemIcon>
                    <ListItemText className="pl-0" primary="Agregar cuenta"/>
                </MenuItem>

                <MenuItem onClick={logout}>
                    <ListItemIcon className="min-w-40">
                        <Icon>exit_to_app</Icon>
                    </ListItemIcon>
                    <ListItemText className="pl-0" primary="Cerrar sesión"/>
                </MenuItem> */}
            </Popover>
        </React.Fragment>
    );
}

export default UserMenu;
