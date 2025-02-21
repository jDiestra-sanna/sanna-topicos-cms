import React, {useEffect, useRef, useState} from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Util, {getModuleByPath} from '../../../inc/Utils';
import ModulesM from './ModulesM';
import FuseAnimate from '@fuse/core/FuseAnimate';
import Typography from '@material-ui/core/Typography';
import {Icon} from '@material-ui/core';
import Api from '../../../inc/Apiv2';
import Alert from '../../../inc/Alert';
import Nestable from 'react-nestable';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import {red} from '@material-ui/core/colors';
import jwtService from '../../../app/services/jwtService/jwtService';

import Menu, {MenuItems} from '../../../widgets/Menu';
import WError from '../../../widgets/WError';
import WLoading from '../../../widgets/WLoading';
import WBool from '../../../widgets/WBool';
import Box from '@material-ui/core/Box';
import FSelectLocal from "../../../widgets/fields/FSelectLocal";

export default function (props) {

    const [module] = useState(() => getModuleByPath(props.route.path));

    const [data, setData] = useState(null);
    const [userTypeId, setUserTypeId] = useState('1');
    const modal = useRef(null);
    const counterOrderingModulesRef = useRef(0)

    useEffect(() => {
        loadData()
    }, [userTypeId]);

    async function loadData() {
        setData(null);

        const response = await Api.get('/modules', {user_type_id: userTypeId, nested: 1}, false);

        setData(response)
    }

    const orderModules = ( orderedModules, parent_id = 0, level = 0) => {
        let newList = [];

        orderedModules.forEach((orderedModule) => {
            counterOrderingModulesRef.current++;

          if (orderedModule.children.length) {
            newList.push({...orderedModule, sort: counterOrderingModulesRef.current, parent_id, level });

            const _newList = orderModules(orderedModule.children, orderedModule.id, level + 1)

            newList = [...newList, ..._newList]
          } else {
            newList.push({...orderedModule, sort: counterOrderingModulesRef.current, parent_id, level });
          }
        });

        return newList;
    }

    const itemsChanged = async items => {
        const orderedModules = orderModules(items);

        counterOrderingModulesRef.current = 0;
        
        Util.loading(true);

        orderedModules.forEach(async orderedModule => {
            const response = await Api.patch(`/modules/${orderedModule.id}`, {
                parent_id: orderedModule.parent_id,
                sort: orderedModule.sort,
                level: orderedModule.level,
            });

            if (!response.ok) Alert.error(response.message)
        })

        jwtService.emitOnAutoLogin();

        Util.loading(false);
    };

    function tapEnable(item) {
        modal.current.enable(item.id, () => {
            loadData();
            jwtService.emitOnAutoLogin();
        });
    }

    function tapDisable(item) {
        modal.current.disable(item.id, () => {
            loadData();
            jwtService.emitOnAutoLogin();
        });
    }

    return <>
        <FusePageCarded
            classes={{
                toolbar    : 'max-w-640',
                header     : 'max-w-640',
                contentCard: 'max-w-640'
            }}
            header={
                <div className="flex flex-1 w-full items-center justify-between">
                    <div className="flex flex-1 items-center">
                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                            <Typography className="hidden sm:flex" variant="h6">
                                {module.title}
                            </Typography>
                        </FuseAnimate>
                    </div>

                    <div className="flex flex items-center justify-center ml-8">

                        {/* <Typography component="div" style={{minWidth: 200}} color="textPrimary">
                            <FSelectLocal
                                value={userTypeId}
                                endpoint="/fil_datas/user_types"
                                onChange={e => setUserTypeId(e.target.value)}/>
                        </Typography> */}

                    </div>

                </div>
            }
            content={data == null ? (
                <WLoading/>
            ) : !data.ok ? (
                <WError error={data.message} onRetry={loadData}/>
            ) : (
                <div className="py-24">
                    <Nestable
                        items={data.data}
                        renderItem={({item}) => (
                            <div className="w-full" style={module.edit ? {} : {cursor: 'default'}}>
                                <Box display="flex"
                                     px={1}
                                     mt="2px">
                                    <Box pt="5px">
                                        <Icon fontSize="small">
                                            {module.edit ? 'drag_indicator' : 'chevron_right'}
                                        </Icon>
                                    </Box>
                                    <Box pt="5px" pl={1} flexGrow={1}>
                                        <Typography color={item.section == '1' ? 'textSecondary' : 'textPrimary'}>
                                            {item.name}
                                        </Typography>
                                    </Box>
                                    <Box pt="5px" pr={1}>
                                        <Typography variant="caption" color="textSecondary">{item.url}</Typography>
                                    </Box>
                                    <Box>
                                        {item.state != '1' && (
                                            <IconButton size="small">
                                                <Tooltip title="Inactivo">
                                                    <Icon fontSize="small"
                                                          style={{color: red[500]}}>error</Icon>
                                                </Tooltip>
                                            </IconButton>
                                        )}
                                    </Box>
                                    <Box>
                                        <WBool
                                            value={item.root}
                                            title="Solo acceso root"
                                            icon="lock"
                                            icon_off="lock_open"/>
                                    </Box>
                                    <Box>
                                        {module.edit && (
                                            <Menu items={() => {
                                                let menu = new MenuItems();

                                                menu.item('Editar', () => modal.current.edit(item.id)).setIcon('edit');

                                                if (item.state == '1') {
                                                    menu.item('Desactivar', () => tapDisable(item)).setIcon('block');
                                                } else {
                                                    menu.item('Activar', () => tapEnable(item)).setIcon('check_circle');
                                                }

                                                return menu;
                                            }}/>
                                        )}
                                    </Box>
                                </Box>
                            </div>
                        )}
                        onChange={itemsChanged}
                        />
                </div>
            )}/>
        <ModulesM ref={modal} onSaved={() => {
            loadData();
            jwtService.emitOnAutoLogin();
        }}/>
    </>;
}