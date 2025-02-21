import React from 'react';
import PropTypes from 'prop-types';
import Icon from "@material-ui/core/Icon";
import Pic from "../../inc/Pic";
import Toast from "../../inc/Toast";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import FFile from "./FFile";
import TableBody from "@material-ui/core/TableBody";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import Alert from "../../inc/Alert";
import Api from "../../inc/Api";

function W(props) {

    function remove(o, i) {
        if (o.file) {
            goChanged(props.value.filter((o2, i2) => i2 !== i));
        } else {
            Alert.confirm(() => {
                Api.post('/archivos/remove', {id: o.id}, rsp => {
                    if (rsp.ok) {
                        Toast.success('Eliminado');
                        goChanged(props.value.filter((o2, i2) => i2 !== i));
                    } else {
                        Alert.error(rsp.msg);
                    }
                }, 'Eliminando...');
            });
        }
    }

    function changed(e) {
        const file = e.target.files[0];
        if (file) {
            props.value.push({file});
            goChanged(props.value);
        }
    }

    function goChanged(files) {
        props.onChange({
            target: {
                name : props.name,
                value: files,
            },
        });
    }

    return (
        <div className=" border-1" style={{borderRadius: 5}}>
            <Table className="datable">
                <TableHead>
                    <TableRow>
                        <TableCell>{props.label + (props.required ? ' *' : '')}</TableCell>
                        <TableCell style={{width: 220}}>
                            <FFile
                                label=""
                                onChange={changed}
                                disabled={props.max > 0 && props.value.length >= props.max}/>
                        </TableCell>
                        <TableCell className="w1"/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.value.map((o, i) => (
                        <TableRow key={i} selected={!!o.file}>
                            <TableCell colSpan={2}>
                                {o.file ? (
                                    <div>{o.file.name}</div>
                                ) : (
                                    <a href={Pic.url(o.pic)} target="_blank">{o.nombre}</a>
                                )}
                            </TableCell>
                            <TableCell>
                                <IconButton
                                    size="small"
                                    onClick={() => remove(o, i)}>
                                    <Icon fontSize="small">delete</Icon>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </div>
    );
}

W.propTypes = {
    label   : PropTypes.string,
    name    : PropTypes.string,
    value   : PropTypes.array,
    onChange: PropTypes.func.isRequired,
    max     : PropTypes.number,
    required: PropTypes.bool,
};

W.defaultProps = {};

export default W;