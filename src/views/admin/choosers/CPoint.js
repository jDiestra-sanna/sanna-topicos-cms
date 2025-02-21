import React from 'react';
import GoogleMap from 'google-map-react';
import {stg} from '../../../inc/Utils';
import {Button, Dialog, DialogActions, DialogContent} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

export default class M extends React.Component {

    callback = null;

    constructor(props) {
        super(props);
        this.state = {
            item   : {
                lat: 0,
                lng: 0
            },
            open   : false,
            loading: false
        };
    }

    choose = (lat, lng, callback) => {
        this.callback = callback;

        this.setState({
            item: {
                lat: lat || stg.lat,
                lng: lng || stg.lng
            },
            open: true
        });
    };

    onGoogleApiLoaded = ({map, maps}) => {
        this.map = map;
    };

    getData() {

        let points = [];
        let vertices = this.polygon.getPath();
        for (let i = 0; i < vertices.getLength(); i++) {
            let xy = vertices.getAt(i);
            points.push([xy.lat(), xy.lng()]);
        }

        return {
            ...super.getData(),
            coordinates: JSON.stringify(points)
        };
    }

    done = () => {
        let center = this.map.getCenter();
        this.close();
        this.callback(center.lat(), center.lng());
    };

    close = () => {
        this.setState({
            open   : false,
            loading: false
        });
    };

    render() {
        const {item} = this.state;
        return (
            <Dialog open={this.state.open}
                    onClose={this.close}
                    scroll="body"
                    fullWidth

                    disableEnforceFocus
                    disableAutoFocus

                    maxWidth="sm">

                <AppBar position="static" elevation={0}>
                    <Toolbar>
                        <Typography variant="h6" style={{flexGrow: 1}}>Seleccionar</Typography>

                        <IconButton
                            onClick={this.close}
                            color="inherit">
                            <Icon>close</Icon>
                        </IconButton>

                    </Toolbar>
                </AppBar>

                <DialogContent dividers className="p-0">
                    <div className="h-400" style={{position: 'relative'}}>

                        <GoogleMap
                            bootstrapURLKeys={{
                                key: stg.key_maps
                            }}
                            zoom={16}
                            defaultCenter={[item.lat, item.lng]}
                            onGoogleApiLoaded={this.onGoogleApiLoaded}/>

                        <div style={{
                            position: 'absolute',
                            top     : 'calc(50% - 41px)',
                            left    : 'calc(50% - 18px)'
                        }}>
                            <Icon fontSize="large" color="secondary">location_on</Icon>
                        </div>

                    </div>
                </DialogContent>

                <DialogActions className="py-16">
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={this.done}
                        disabled={this.state.loading}>
                        Elegir
                    </Button>
                </DialogActions>

            </Dialog>
        );
    };
}