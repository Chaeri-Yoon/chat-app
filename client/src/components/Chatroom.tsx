import React, { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { IEnterForm } from '../interface';


export default () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { nickname, avatarNum } = useLocation()?.state as IEnterForm || { nickname: '', avatarNum: '' };
    useEffect(() => { if (nickname === '' || avatarNum.toString() === '') navigate('/'); }, [location]);

    return (
        <div>Chatroom</div>
    )
}