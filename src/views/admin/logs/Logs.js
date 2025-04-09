import React, { useRef, useState } from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Util, { getModuleByPath } from '../../../inc/Utils';
import Datable from '../../../widgets/datable/DatableV2';
import Dahead, { Fil } from '../../../widgets/datable/DaheadV2';
import LogLine from './widgets/LogLine';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import ReactJson from 'react-json-view';
import StateIcon from '../../../widgets/StateIcon';

export default function (props) {
	const [module] = useState(() => getModuleByPath(props.route.path));

	const dahead = useRef(null);
	const datable = useRef(null);

	return (
		<FusePageCarded
			header={
				<Dahead
					{...props}
					ref={dahead}
					datable={datable}
					module={module}
					notQuery
					fields={
						[
							Fil.ajax('user_id', 'Usuario', '/users'),
							Fil.local('log_type_id', 'Acción', '/log-types').setWidth(150),
							Fil.local('log_target_id', 'Objetivo', '/log-targets'),
							Fil.text('target_row_id', 'id target').setWidth(90)
						]
					}
				/>
			}
			content={
				<Datable
					{...props}
					ref={datable}
					fil={() => dahead.current.fil()}
					defaultPageLimit={15}
					columns={{
						log_type_icon: {
							value: '',
							width: '1%',
							row: o =>
								o.log_type ? (
									<IconButton
										size="small"
										color="default"
										style={{ cursor: 'default', background: 'none', color: o.log_type.color }}
									>
										<Icon fontSize="small">{o.log_type.icon}</Icon>
									</IconButton>
								) : (
									''
								)
						},
						text: { value: 'Detalle', row: o => <LogLine log={o} /> },
						// _menu: {
						// 	value: '',
						// 	width: '1%',
						// 	row: o =>
						// 		Util.isJSON(o.data) ? (
						// 			<StateIcon state={{ icon: 'code', name: 'Contenido JSON' }} />
						// 		) : o.data ? (
						// 			<StateIcon state={{ icon: 'note', name: 'Datos' }} />
						// 		) : (
						// 			''
						// 		)
						// },
						date_created: { detail: true, value: 'Fecha de registro', row: 'datetime' },
						log_type_type: {
							detail: true,
							value: 'Tipo',
							row: o => (o.log_type ? `${o.log_type.prefix} ${o.log_type.name} ${o.log_type.suffix}` : '')
						},
						// target: { detail: true, value: 'target', row: o => o.target_label || o.target_name },
						target_row_id: { detail: true, value: 'Objeto accedido' },
						// parent_row_id: { detail: true, value: 'parent_id' },
						user: { detail: true, value: 'Entidad', row: o => o.user.email},
						origin: {detail: true, value: 'Origen', row: o => o?.ip}
						// parent: { detail: true, value: 'parent', row: o => o.parent_name_mask || o.parent_name },
						// data: {
						// 	detail: true,
						// 	value: 'Datos',
						// 	row: o =>
						// 		Util.isJSON(o.data) ? (
						// 			<ReactJson
						// 				src={JSON.parse(o.data)}
						// 				name={null}
						// 				enableClipboard={false}
						// 				displayObjectSize={false}
						// 				displayDataTypes={false}
						// 			/>
						// 		) : (
						// 			<div>{o.data}</div>
						// 		)
						// }
					}}
				/>
			}
		/>
	);
}
