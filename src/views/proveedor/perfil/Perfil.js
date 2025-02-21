import {useState} from 'react';
import {renderRoutes} from "react-router-config";

export default function (props) {
    const [id] = useState(props.match.params.id);
    return renderRoutes(props.route.routes, {id});
}