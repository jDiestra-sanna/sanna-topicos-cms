import React from 'react';
import ModalForm from "../../../widgets/ModalForm";
import Form from "../../../widgets/fields/Form";
import FText from "../../../widgets/fields/FText";
import FPassword from "../../../widgets/fields/FPassword";
import FSelect from "../../../widgets/fields/FSelect";
import FCheck from "../../../widgets/fields/FCheck";

export default class M extends ModalForm {

    constructor(props) {
        super(props, {
            state     : {
                item: {
                    id        : '',
                    id_role   : '',
                    name      : '',
                    surname   : '',
                    email     : '',
                    password  : '',
                    document  : '',
                    phone     : '',
                    sin_acceso: '',
                },
            },
            endpoint  : '/../proveedor/usuarios',
            title     : 'usuario',
            use_errors: true,
        });
    }

    add = () => this.edit(0);

    content() {
        const {item} = this.state;
        return super.content(
            <Form error={this.state.error} errors={this.state.errors} disabled={this.state.loading}>

                <FSelect
                    sm={6}
                    label="Perfil"
                    name="id_role"
                    value={item.id_role}
                    items={this.state.roles}
                    onChange={this.changed}
                    required/>

                <FText
                    sm={6}
                    label="Nombre"
                    name="name"
                    value={item.name}
                    onChange={this.changed}
                    required/>

                <FText
                    sm={6}
                    label="Apellido"
                    name="surname"
                    value={item.surname}
                    onChange={this.changed}
                    required/>

                <FText
                    sm={6}
                    label="Email"
                    name="email"
                    value={item.email}
                    onChange={this.changed}
                    type="email"
                    required/>

                {item.sin_acceso !== '1' && (
                    <FPassword
                        sm={6}
                        label="Contraseña"
                        name="password"
                        value={item.password}
                        onChange={this.changed}
                        required/>
                )}

                <FText
                    sm={6}
                    label="DNI"
                    name="document"
                    value={item.document}
                    onChange={this.changed}
                    required/>

                <FText
                    sm={6}
                    label="Teléfono"
                    name="phone"
                    value={item.phone}
                    onChange={this.changed}
                    required/>

                <FCheck
                    sm={6}
                    label="Sin acceso al sistema"
                    name="sin_acceso"
                    value={item.sin_acceso}
                    onChange={this.changed}/>

            </Form>
        )
    };
}