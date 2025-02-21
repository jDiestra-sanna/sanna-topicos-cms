import React from 'react';
import TextField from "@material-ui/core/TextField";
import ModalForm from "../../../widgets/ModalFormv2";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import {Icon} from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import FSelect from "../../../widgets/fields/FSelect";
import Api from "../../../inc/Apiv2";
import Alert from "../../../inc/Alert";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Form from "../../../widgets/fields/Form";
import FCheck from "../../../widgets/fields/FCheck";

export default class RolesM extends ModalForm {

    constructor(props) {
        super(props, {
            state     : {
                item      : {
                    id            : '',
                    user_type_id  : '',
                    home_module_id: 0,
                    name          : '',
                    menu_collapsed: '0',
                    home_module   : {},
                    perms         : [],
                    protected     : false, // no permite modificar ciertos campos
                },
                modules         : [],
                all_interface   : false,
                all_see         : false,
                all_create      : false,
                all_edit        : false,
                all_delete      : false,
                user_types      : [],
            },
            endpoint  : '/roles',
            title     : 'perfil',
            use_errors: true,
            size      : 'xs',
            props_save: {
                name: true,
                menu_collapsed: true,
                home_module_id: true
            }
        });
    }

    open = async () => {
        const response = await Api.get('/modules', { nested: 0 }, false)

        if (!response.ok) return Alert.error(response.message)

        let modules = response.data;

        this.setState({
            ...this.initialState,
            open: true,
            modules
        });
    };

    getData() {
        let perms = this.state.modules
            .filter(o => o.interface || o.see || o.create || o.edit || o.delete)
            .map(o => ({
                module_id   : o.id,
                interface   : o.interface ? 1 : 0,
                see         : o.see ? 1 : 0,
                create      : o.create ? 1 : 0,
                edit        : o.edit ? 1 : 0,
                delete      : o.delete ? 1 : 0,
            }));

        return {
            ...super.getData(),
            perms,
        };
    }

    async setData(val, callback) {
        const response = await Api.get('/modules', { nested: 0 }, false)

        if (!response.ok) return Alert.error(response.message)

        let modules = response.data;
        let perms = val.data.perms;

        modules.forEach((module, index) => {
            let match = false;

            perms.forEach(perm => {
                if (perm.module.id === module.id) {
                    modules[index].interface = perm.interface > 0;
                    modules[index].see = perm.see > 0;
                    modules[index].create = perm.create > 0;
                    modules[index].edit = perm.edit > 0;
                    modules[index].delete = perm.delete > 0;
                    modules[index].edit = perm.edit > 0;

                    match = true;
                }
            })

            if (!match) {
                modules[index].interface = false;
                modules[index].see = false;
                modules[index].create = false;
                modules[index].edit = false;
                modules[index].delete = false;
            }
        })

        this.setState({
            ...this.initialState,
            open   : true,
            loading: false,
            ...val
        }, () => {
            this.setState({
                modules
            })
        });
    };

    userTypeChanged = () => {
        let user_type_id = this.state.item.user_type_id;
        let id_role = this.state.item.id;
        Api.get('/roles/modules', {user_type_id, id_role}, rsp => {
            if (rsp.ok) {
                this.setState({modules: rsp.items});
            } else {
                Alert.error(rsp.msg);
            }
        }, 'Cargando módulos')
    };

    content() {
        const {item} = this.state;

        return super.content(
            <Form error={this.state.error} errors={this.state.errors} disabled={this.state.loading}>

                {/* <FSelect
                    xs={12}
                    label="Tipo de persona"
                    name="user_type_id"
                    value={item.user_type_id}
                    items={this.state.user_types}
                    onChange={e => {
                        this.setItem({
                            user_type_id: e.target.value,
                        }, this.userTypeChanged);
                    }}
                    disabled={item.protected}
                    required/> */}

                <TextField
                    xs={12}
                    label="Nombre"
                    name="name"
                    value={item.name}
                    onChange={this.changed}
                    required
                    fullWidth
                    autoFocus
                    margin="dense"
                    className="m-0"
                    variant="outlined"
                    disabled={item.protected}/>

                {/*{item.user_type_id == '1' && (
                    <FCheck
                        sm={5}
                        label="Aprobador"
                        name="aprobador"
                        value={item.aprobador}
                        onChange={this.changed}
                        dense/>
                )}*/}

                <FCheck
                    sm={7}
                    label="Menú lateral minimizado"
                    name="menu_collapsed"
                    value={item.menu_collapsed}
                    onChange={this.changed}
                    dense/>

                <Table sm={12} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell rowSpan={2} padding="none">Modulo</TableCell>
                            <TableCell className="w1 text-center" padding="none">
                                <Icon fontSize="small">web_asset</Icon>
                            </TableCell>
                            <TableCell className="w1 text-center" padding="none">
                                <Icon fontSize="small">remove_red_eye</Icon>
                            </TableCell>
                            <TableCell className="w1 text-center" padding="none">
                                <Icon fontSize="small">add</Icon>
                            </TableCell>
                            <TableCell className="w1 text-center" padding="none">
                                <Icon fontSize="small">edit</Icon>
                            </TableCell>
                            <TableCell className="w1 text-center" padding="none">
                                <Icon fontSize="small">delete</Icon>
                            </TableCell>
                            <TableCell rowSpan={2} className="w1 text-center" padding="none">
                                <Icon fontSize="small">home</Icon>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="w1" padding="none">
                                <Checkbox
                                    className="pdg-5"
                                    checked={this.state.all_interface}
                                    onChange={e => {
                                        let all_interface = e.target.checked;

                                        let modules = this.state.modules;

                                        modules.forEach((module, index) => {
                                            modules[index]['interface'] = all_interface;
                                        });

                                        this.setState({
                                            all_interface: all_interface,
                                            modules: modules
                                        });
                                    }}/>
                            </TableCell>
                            <TableCell className="w1" padding="none">
                                <Checkbox
                                    className="pdg-5"
                                    checked={this.state.all_see}
                                    onChange={e => {
                                        let all_see = e.target.checked;

                                        let modules = this.state.modules;

                                        modules.forEach((module, index) => {
                                            modules[index]['see'] = all_see;
                                        });

                                        this.setState({
                                            all_see: all_see,
                                            modules: modules
                                        });
                                    }}/>
                            </TableCell>
                            <TableCell className="w1" padding="none">
                                <Checkbox
                                    className="pdg-5"
                                    checked={this.state.all_create}
                                    onChange={e => {
                                        let all_create = e.target.checked;

                                        let modules = this.state.modules;

                                        modules.forEach((module, index) => {
                                            modules[index]['create'] = all_create;
                                        });

                                        this.setState({
                                            all_create: all_create,
                                            modules: modules
                                        });
                                    }}/>
                            </TableCell>

                            <TableCell className="w1" padding="none">
                                <Checkbox
                                    className="pdg-5"
                                    checked={this.state.all_edit}
                                    onChange={e => {
                                        let all_edit = e.target.checked;

                                        let modules = this.state.modules;

                                        modules.forEach((module, index) => {
                                            modules[index]['edit'] = all_edit;
                                        });

                                        this.setState({
                                            all_edit: all_edit,
                                            modules: modules
                                        });
                                    }}/>
                            </TableCell>
                            <TableCell className="w1" padding="none">
                                <Checkbox
                                    className="pdg-5"
                                    checked={this.state.all_delete}
                                    onChange={e => {
                                        let all_delete = e.target.checked;

                                        let modules = this.state.modules;

                                        modules.forEach((module, index) => {
                                            modules[index]['delete'] = all_delete;
                                        });

                                        this.setState({
                                            all_delete: all_delete,
                                            modules: modules
                                        });
                                    }}/>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.modules.map((o, i) =>
                            <Tooltip key={i} title={o.url} placement="left">
                                <TableRow>
                                    <TableCell padding="none">
                                        <Typography color={o.section == '1' ? 'textSecondary' : 'textPrimary'}>
                                            {'\u00A0\u00A0\u00A0\u00A0'.repeat(o.level)}
                                            {o.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell padding="none">
                                        <Checkbox
                                            className="pdg-5"
                                            checked={o.interface || false}
                                            onChange={e => {
                                                o.interface = e.target.checked;

                                                if (o.level == '0') {
                                                    this.state.modules.forEach((p) => {
                                                        if (p.parent_id == o.id) {
                                                            p.interface = o.interface;
                                                        }
                                                    });
                                                } else if (o.interface) {
                                                    this.state.modules.forEach((p) => {
                                                        if (p.id == o.parent_id) {
                                                            p.interface = true;
                                                        }
                                                    });
                                                }

                                                this.setState(this.state);
                                            }}/>
                                    </TableCell>
                                    <TableCell padding="none">
                                        <Checkbox
                                            className="pdg-5"
                                            checked={o.see || false}
                                            onChange={e => {
                                                o.see = e.target.checked;

                                                if (o.level == '0') {
                                                    this.state.modules.forEach((p) => {
                                                        if (p.parent_id == o.id) {
                                                            p.see = o.see;
                                                        }
                                                    });
                                                } else if (o.see) {
                                                    this.state.modules.forEach((p) => {
                                                        if (p.id == o.parent_id) {
                                                            p.see = true;
                                                        }
                                                    });
                                                }

                                                this.setState(this.state);
                                            }}/>
                                    </TableCell>
                                    <TableCell padding="none">
                                        <Checkbox
                                            className="pdg-5"
                                            checked={o.create || false}
                                            onChange={e => {
                                                o.create = e.target.checked;

                                                if (o.level == '0') {
                                                    this.state.modules.forEach((p) => {
                                                        if (p.parent_id == o.id) {
                                                            p.create = o.create;
                                                        }
                                                    });
                                                } else if (o.create) {
                                                    this.state.modules.forEach((p) => {
                                                        if (p.id == o.parent_id) {
                                                            p.create = true;
                                                        }
                                                    });
                                                }

                                                this.setState(this.state);
                                            }}/>
                                    </TableCell>
                                    <TableCell padding="none">
                                        <Checkbox
                                            className="pdg-5"
                                            checked={o.edit || false}
                                            onChange={e => {
                                                o.edit = e.target.checked;

                                                if (o.level == '0') {
                                                    this.state.modules.forEach((p) => {
                                                        if (p.parent_id == o.id) {
                                                            p.edit = o.edit;
                                                        }
                                                    });
                                                } else if (o.edit) {
                                                    this.state.modules.forEach((p) => {
                                                        if (p.id == o.parent_id) {
                                                            p.edit = true;
                                                        }
                                                    });
                                                }

                                                this.setState(this.state);
                                            }}/>
                                    </TableCell>
                                    <TableCell padding="none">
                                        <Checkbox
                                            className="pdg-5"
                                            checked={o.delete || false}
                                            onChange={e => {
                                                o.delete = e.target.checked;

                                                if (o.level == '0') {
                                                    this.state.modules.forEach((p) => {
                                                        if (p.parent_id == o.id) {
                                                            p.delete = o.delete;
                                                        }
                                                    });
                                                } else if (o.delete) {
                                                    this.state.modules.forEach((p) => {
                                                        if (p.id == o.parent_id) {
                                                            p.delete = true;
                                                        }
                                                    });
                                                }

                                                this.setState(this.state);
                                            }}/>
                                    </TableCell>
                                    <TableCell padding="none">
                                        <label>
                                            <Radio
                                                className="pdg-5" checked={item.home_module_id === o.id}
                                                hidden={o.url === ''}
                                                onChange={() => {
                                                    this.setState({
                                                        item: {
                                                            ...item,
                                                            home_module_id: o.id,
                                                        }
                                                    });
                                                }}/>
                                        </label>
                                    </TableCell>
                                </TableRow>
                            </Tooltip>
                        )}
                    </TableBody>
                </Table>

            </Form>
        )
    };
}
