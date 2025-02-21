import React from "react";
import ModalForm from "widgets/ModalFormv2";
import FText from "widgets/fields/FText";
import Form from "widgets/fields/Form";
import FSelectLocal from "widgets/fields/FSelectLocal";
import DiagnosisType from "models/diagnosis-type";
import Proffesion from "models/proffesion";

class M extends ModalForm {
    constructor(props) {
        super(props, {
            state     : {
                item : {
                    id                  : '',
                    name                : '',
                    code                : '',
                    diagnosis_type_id   : '',
                    proffesion_id       : '',
                }
            },
            endpoint  : '/diagnoses',
            title     : 'Diagnósticos',
            use_errors: true,
            props_save: {
                name                : true,
                code                : true,
                diagnosis_type_id   : true,
                proffesion_id       : true,
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
                    inputProps={{ maxLength: 6 }}
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
                    label='Tipo'
                    name='diagnosis_type_id' 
                    value={item.diagnosis_type_id}
                    endpoint='/dropdown-options/diagnosis-types'
                    onChange={e => {
                        this.changed(e, () => {
                            let proffesion_id = '';

                            if (this.state.item.diagnosis_type_id === DiagnosisType.CIE10_ID) {
                                proffesion_id = Proffesion.GENERAL_PHYSICIAN_ID;
                            }
                            
                            if (this.state.item.diagnosis_type_id === DiagnosisType.NANDA_ID) {
                                proffesion_id = Proffesion.DEGREE_IN_NURSING_ID 
                            }

                            this.setState({ 
                                item: { 
                                    ...this.state.item, 
                                    proffesion_id
                                }
                            });
                        });
                    }}
                    required />

                <FSelectLocal
                    sm={6}
                    label='Profesión'
                    name='proffesion_id' 
                    value={item.proffesion_id}
                    endpoint='/dropdown-options/proffesions'
                    onChange={this.changed}
                    disabled
                    required />
            </Form>
        )
    };
}

export default M;
