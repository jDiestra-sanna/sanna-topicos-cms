import React from 'react';
import {Dialog, DialogContent} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import LogLine from './widgets/LogLine';
import Datable from '../../../widgets/datable/Datable';

export default class M extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            fil : {
                id_user  : '',
                target   : '',
                id_target: ''
            }
        };
    }

    show = (target, id_target) => {
        this.setState({
            open: true,
            fil : {...this.state.fil, target, id_target}
        });
    };

    byUser = (id_user) => {
        this.setState({
            open: true,
            fil : {...this.state.fil, id_user}
        });
    };

    close = () => {
        this.setState({
            open: false
        });
    };

    render() {
        return (
            <Dialog open={this.state.open}
                    onClose={this.close}
                    scroll="body"
                    fullWidth
                    maxWidth="sm">

                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" style={{flexGrow: 1}}>
                            Actividad
                        </Typography>

                        <IconButton
                            onClick={this.close}
                            color="inherit">
                            <Icon>close</Icon>
                        </IconButton>

                    </Toolbar>
                </AppBar>

                <DialogContent className="p-0">

                    <Datable
                        endpoint="/logs"
                        fil={() => ({...this.state.fil})}
                        defaultPageLimit={20}
                        notLoading
                        columns={{
                            tl_icon: {
                                width: '1%', sort: false, row: o => o.tl_icon ? (
                                    <IconButton
                                        size="small"
                                        color="default"
                                        style={{cursor: 'default', background: 'none', color: o.tl_color}}>
                                        <Icon fontSize="small">{o.tl_icon}</Icon>
                                    </IconButton>
                                ) : ''
                            },
                            text   : {sort: false, row: o => <LogLine log={o} noUser={this.state.fil.id_user > 0}/>},
                        }}/>

                </DialogContent>

            </Dialog>
        );
    };
}