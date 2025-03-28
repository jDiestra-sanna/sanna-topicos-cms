import FuseSearch from '@fuse/core/FuseSearch';
import FuseShortcuts from '@fuse/core/FuseShortcuts';
import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import NavbarMobileToggleButton from 'app/fuse-layouts/shared-components/NavbarMobileToggleButton';
import QuickPanelToggleButton from 'app/fuse-layouts/shared-components/quickPanel/QuickPanelToggleButton';
import UserMenu from 'app/fuse-layouts/shared-components/UserMenu';
import React from 'react';
import {useSelector} from 'react-redux';

const useStyles = makeStyles(theme => ({
    separator: {
        width          : 1,
        height         : 64,
        backgroundColor: theme.palette.divider
    }
}));

function ToolbarLayout1(props) {
    const config = useSelector(({fuse}) => fuse.settings.current.layout.config);
    const toolbarTheme = useSelector(({fuse}) => fuse.settings.toolbarTheme);

    const classes = useStyles(props);

    const user = useSelector(({auth}) => auth.user);

    return (
        <ThemeProvider theme={toolbarTheme}>
            <AppBar
                id="fuse-toolbar"
                className="flex relative z-10"
                color="default"
                style={{backgroundColor: toolbarTheme.palette.background.paper}}
            >
                <Toolbar className="p-0">
                    {config.navbar.display && config.navbar.position === 'left' && (
                        <Hidden lgUp>
                            <NavbarMobileToggleButton className="w-64 h-64 p-0"/>
                            <div className={classes.separator}/>
                        </Hidden>
                    )}

                    {/* <div className="flex flex-1">
                        <Hidden mdDown>
                            <FuseShortcuts className="px-16"/>
                        </Hidden>
                    </div> */}

                    <div className="flex w-full">

                        <UserMenu/>

                        {/* <div className={classes.separator}/> */}

                        {/* <FuseSearch/> */}

                        {/* <div className={classes.separator}/> */}

                        <div className='ml-auto'>
                            <QuickPanelToggleButton/>
                        </div>
                    </div>

                    {config.navbar.display && config.navbar.position === 'right' && (
                        <Hidden lgUp>
                            <NavbarMobileToggleButton/>
                        </Hidden>
                    )}
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
}

export default React.memo(ToolbarLayout1);
