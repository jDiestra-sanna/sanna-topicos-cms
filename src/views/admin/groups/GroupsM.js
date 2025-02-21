import { InputUtils } from "inc/Utils";
import FFileUploadAuto from "../../../widgets/fields/FFileUploadAuto";
import Form from "../../../widgets/fields/Form";
import FText from "../../../widgets/fields/FText";
import ModalForm from "../../../widgets/ModalFormv2";
import React from "react";

class M extends ModalForm {
    constructor(props) {
        super(props, {
            state     : {
                item : {
                    id      : '',
                    name    : '',
                    contact : '',
                    phone   : '',
                    email   : '',
                    pic     : '',
                }
            },
            endpoint  : '/groups',
            title     : 'Grupo',
            use_errors: true,
            props_save: {
                name    : true,
                contact : true,
                phone   : true,
                email   : true,
                pic     : true,
            }
        });
    }

    content() {
        const {item} = this.state;

        return super.content(
            <Form error={this.state.error} errors={this.state.errors} disabled={this.state.loading}>
                <FText
                    sm={6}
                    label="Nombre"
                    name="name"
                    value={item.name}
                    onChange={this.changed}
                    required/>

                <FText
                    sm={6}
                    label="Contacto"
                    name="contact"
                    value={item.contact}
                    onChange={this.changed}/>

                <FText
                    sm={6}
                    label="Celular"
                    name="phone"
                    inputProps={{ maxLength: 9 }}
                    onKeyPress={e => InputUtils.onlyNumbers(e)}
                    value={item.phone}
                    onChange={this.changed}/>

                <FText
                    sm={6}
                    label="Correo electrónico"
                    name="email"
                    value={item.email}
                    onChange={this.changed}
                    type="email"/>

                <FFileUploadAuto
                    sm={6}
                    label="Logo"
                    name="pic"
                    value={item.pic}
                    onChange={filename => {
                        this.setState({
                            item: {
                                ...this.state.item,
                                pic: filename
                            }
                        });
                    }}
                    image original/>
            </Form>
        )
    };
}

export default M;
