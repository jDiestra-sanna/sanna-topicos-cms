import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { Typography } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import {makeStyles, ThemeProvider, useTheme} from '@material-ui/core/styles';
import Logo from 'app/fuse-layouts/shared-components/Logo';
import NavbarFoldedToggleButton from 'app/fuse-layouts/shared-components/NavbarFoldedToggleButton';
import NavbarMobileToggleButton from 'app/fuse-layouts/shared-components/NavbarMobileToggleButton';
import Navigation from 'app/fuse-layouts/shared-components/Navigation';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Api from 'inc/Apiv2';
import Pref from 'inc/Pref';
import * as authActions from 'app/auth/store/actions';
import jwtService from '../../../services/jwtService/jwtService';
import Alert from 'inc/Alert';
import { stg } from 'inc/Utils';
import Roles from 'models/roles';
import AttendanceRecordLeavingReason from 'widgets/sanna/AttendanceRecordLeavingReason';

const useStyles = makeStyles({
    content: {
        overflowX                   : 'hidden',
        overflowY                   : 'auto',
        '-webkit-overflow-scrolling': 'touch',
        background                  :
            'linear-gradient(rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0) 30%), linear-gradient(rgba(0, 0, 0, 0.25) 0, rgba(0, 0, 0, 0) 40%)',
        backgroundRepeat            : 'no-repeat',
        backgroundSize              : '100% 40px, 100% 10px',
        backgroundAttachment        : 'local, scroll'
    }
});

function NavbarLayout1(props) {
    const classes = useStyles();
    const mainTheme = useSelector(({ fuse }) => fuse.settings.mainTheme);
    const theme = useTheme();
    const navbar = useSelector(({ fuse }) => fuse.navbar);
    const user = useSelector(({ auth }) => auth.user);
    const dispatch = useDispatch();
    const [openModalLeavingTime, setOpenModalLeavingTime] = useState(false);
    const [isLeavingTimeRegistered, setIsLeavingTimeRegistered] = useState(false);

    async function logout() {
        const response = await Api.delete('/auth/logout', {}, 'Cerrando sesión...');

        if (!response.ok) return Alert.error(response.message);

        Pref.sessionUsers = Pref.sessionUsers.filter(o => o.id !== user.data.id);
        dispatch(authActions.logoutUser());
        Pref.urlApiBase = '';
        jwtService.emitOnSetup();
    }

    return (
        <div className={clsx('flex flex-col overflow-hidden h-full', props.className)}>
            <AppBar
                // color="primary"
                position="static"
                elevation={0}
                className="flex flex-row items-center flex-shrink h-64 min-h-64 px-12 bg-white"
            >
                {!props.foldedAndClosed && (
                    <div className="flex flex-1 mx-8">
                        <Logo/>
                    </div>
                )}

                <Hidden mdDown>
                    <NavbarFoldedToggleButton className="w-40 h-40 p-0" iconButtonColor='primary'/>
                </Hidden>

                <Hidden lgUp>
                    <NavbarMobileToggleButton className="w-40 h-40 p-0" iconButtonColor='primary'>
                        <Icon>{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}"</Icon>
                    </NavbarMobileToggleButton>
                </Hidden>
            </AppBar>

            <FuseScrollbars className={clsx(classes.content)} option={{suppressScrollX: true}}>

                <Navigation layout="vertical"/>
            </FuseScrollbars>

            <div style={{marginTop: 'auto'}}>
                <div style={{padding: '20px 20px 10px', color: '#ff0000', fontFamily: 'Stag Sans', fontWeight: '500', userSelect: 'none'}}>
                    <div className='flex items-center  cursor-pointer' onClick={() => {
                        if (user.data?.role_id === Roles.HEALTH_TEAM_ID && !isLeavingTimeRegistered) {
                            setOpenModalLeavingTime(true);
                        } else {
                            Alert.confirm('¿Está seguro que desea cerrar sesión?', () => logout())
                        }
                    }}>
                        <ExitToAppIcon style={{fontSize: '28px'}}/>
                        <div style={{whiteSpace: 'nowrap', paddingLeft: '16px'}}>Cerrar sesión</div>
                    </div>
                </div>
                
                <Typography 
                    variant='body2' 
                    style={{ 
                        color: '#A0A0A0', 
                        padding: '0px 20px 20px 64px', 
                        whiteSpace: 'nowrap', 
                        visibility: 'visible',
                        fontSize: '12px'
                    }}
                >
                        Una aplicación de SANNA <br /> Versión {stg.cms_version}
                </Typography>
            </div>
            
            <ThemeProvider
                theme={mainTheme}
            >
                <AttendanceRecordLeavingReason
                    onCancel={() => setOpenModalLeavingTime(false)}
                    onClosed={() => {
                        setOpenModalLeavingTime(false)
                        logout();
                    }}
                    open={openModalLeavingTime}
                />
            </ThemeProvider>
        </div>
    );
}

export default React.memo(NavbarLayout1);
