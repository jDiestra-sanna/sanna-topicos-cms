import React from 'react'
import {Redirect} from "react-router-dom";
import {useSelector} from "react-redux";

export default function () {
    const user = useSelector(({auth}) => auth.user);
    return <Redirect to={user.url_home}/>
}