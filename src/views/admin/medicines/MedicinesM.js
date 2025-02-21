import React from "react";
import ModalForm from "widgets/ModalFormv2";
import FText from "widgets/fields/FText";
import Form from "widgets/fields/Form";
import FSelectLocal from "widgets/fields/FSelectLocal";

class M extends ModalForm {
    constructor(props) {
        super(props, {
            state     : {
                item : {
                    id                  : '',
                    name                : '',
                    code                : '',
                    dci                 : '',
                    article_group_id    : '',
                    form_factor_id      : '',
                }
            },
            endpoint  : '/medicines',
            title     : 'Medicina',
            use_errors: true,
            props_save: {
                name                : true,
                code                : true,
                dci                 : true,
                article_group_id    : true,
                form_factor_id      : true,
            }
        });
    }

    content() {
        const {item} = this.state;

        return super.content(
            <Form error={this.state.error} errors={this.state.errors} disabled={this.state.loading}>
                <FText
                    sm={6}
                    label="Código"
                    name="code"
                    value={item.code}
                    onChange={this.changed}
                    inputProps={{ maxLength: 15 }}
                    required/>

                <FText
                    sm={6}
                    label="Nombre"
                    name="name"
                    value={item.name}
                    onChange={this.changed}
                    required/>

                <FSelectLocal
                    sm={6}
                    label='Grupo Artículo'
                    name='article_group_id' 
                    value={item.article_group_id}
                    endpoint='/dropdown-options/article-groups'
                    onChange={this.changed}
                    required />

                <FSelectLocal
                    sm={6}
                    label='Presentación'
                    name='form_factor_id' 
                    value={item.form_factor_id}
                    endpoint='/dropdown-options/form-factors'
                    onChange={this.changed}
                    required />

                <FText
                    sm={6}
                    label="DCI"
                    name="dci"
                    value={item.dci}
                    onChange={this.changed}/>
            </Form>
        )
    };
}

export default M;
