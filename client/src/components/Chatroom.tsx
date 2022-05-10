import React from "react"
import { useLocation } from "react-router-dom";
import { IEnterForm } from '../interface';

export default () => {
    const location = useLocation();
    const { nickname, avatarNum } = location.state as IEnterForm;

    return (
        <div>Chatroom</div>
    )
}