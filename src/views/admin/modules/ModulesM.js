import React from 'react'
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import FCheck from 'widgets/fields/FCheck';
import ModalForm from '../../../widgets/ModalFormv2';

export default class ModulesM extends ModalForm {

    constructor(props) {
        super(props, {
            state   : {
                item: {
                    id  : '',
                    name: '',
                    icon: '',
                    root: 0
                }
            },
            endpoint: '/modules',
            title   : 'Módulo',
            size    : 'xs',
            props_save: {
                name: true,
                icon: true,
                root: true
            }
        });
    }

    content() {
        const { item } = this.state;
        return super.content(
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Nombre"
                        name="name"
                        value={item.name}
                        variant="outlined"
                        autoFocus
                        margin="dense"
                        onChange={this.changed}
                        fullWidth />

                    <TextField
                        label="Icono"
                        name="icon"
                        value={item.icon}
                        onChange={this.changed}
                        fullWidth
                        margin="dense"
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Icon fontSize="small">{item.icon}</Icon>
                                </InputAdornment>
                            )
                        }}/>
                </Grid>
                <Grid item sm={12}>
                    <FCheck
                        label="Visible solo para perfil root"
                        name="root"
                        value={item.root}
                        onChange={this.changed} />
                </Grid>
            </Grid>
        );
    };
}