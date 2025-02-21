import React, {useEffect, useState} from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Api from "../../../inc/Api";
import Toast from "../../../inc/Toast";
import {getModuleByPath} from "../../../inc/Utils";
import FuseAnimate from "@fuse/core/FuseAnimate";
import {Editor} from "@tinymce/tinymce-react";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
import Alert from '../../../inc/Alert';

const editor_key = '28ur0ba34r096qrolhh7z1zu5n9d0dxpiv5etyy5vu6eskjb';

export default function (props) {
    const [module] = useState(() => getModuleByPath(props.route.path));
    const [item, setItem] = useState({
        legal: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const changed = (name, value) => {
        setItem({
            ...item,
            [name]: value,
        });
    };

    const loadData = () => {
        setLoading(true);
        Api.get('/legal/form', rsp => {
            setLoading(false);
            if (rsp.ok) {
                setItem(rsp.item);
            } else {
                Alert.error(rsp.msg);
            }
        })
    };

    const restore = () => {
        Alert.confirm('Perderá los cambios realizados.', () => {
            setLoading(true);
            Api.post('/legal/restore', item, rsp => {
                setLoading(false);
                if (rsp.ok) {
                    Toast.success('Restaurado correctamente');
                    loadData();
                } else {
                    Alert.error(rsp.msg);
                }
            }, 'Restaurando...');
        });
    };
    const save = () => {
        setLoading(true);
        Api.post('/legal/save', item, rsp => {
            setLoading(false);
            if (rsp.ok) {
                Toast.success('Guardado correctamente');
            } else {
                Alert.error(rsp.msg);
            }
        }, 'Guardando...');
    };

    return (
        <FusePageCarded
            header={
                <div className="flex flex-1 w-full items-center justify-between">

                    <div className="flex flex-1 items-center">
                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                            <Typography className="hidden sm:flex" variant="h6">
                                {module.title}
                            </Typography>
                        </FuseAnimate>
                    </div>

                    {module.edit && (
                        <FuseAnimate animation="transition.slideRightIn" delay={300}>
                            <Tooltip title="Restaurar">
                                <div>
                                    <IconButton
                                        className="mr-16"
                                        size="small"
                                        disabled={loading}
                                        onClick={restore}>
                                        <Icon>refresh</Icon>
                                    </IconButton>
                                </div>
                            </Tooltip>
                        </FuseAnimate>
                    )}

                    {module.edit && (
                        <FuseAnimate animation="transition.slideRightIn" delay={600}>
                            <Button
                                variant="contained"
                                color="secondary"
                                disabled={loading}
                                onClick={save}>
                                Guardar
                            </Button>
                        </FuseAnimate>
                    )}
                </div>
            }
            content={loading ? (
                <div/>
            ) : (
                <div className="p-8">
                    <Editor
                        initialValue={item.legal}
                        init={{
                            height : 600,
                            plugins: [
                                'advlist autolink lists link charmap print preview anchor',
                                'searchreplace visualblocks code fullscreen',
                                'insertdatetime table paste code help wordcount'
                            ],
                        }}
                        apiKey={editor_key}
                        onChange={e => changed('legal', e.target.getContent())}
                    />
                </div>
            )}
            innerScroll
        />
    )
}