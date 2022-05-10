import React, { useState } from "react"
import { useNavigate } from 'react-router-dom'
export default () => {
    const navigate = useNavigate();
    const [avatarNum, setAvatarNum] = useState(1);
    const [nickname, setNickname] = useState('');
    const onChangeAvatar = () => setAvatarNum(prev => prev + 1);
    const onChangeNickname = (event: React.ChangeEvent<HTMLInputElement>) => setNickname(event.target.value);
    const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate('/chatroom', { state: { nickname, avatarNum } });
    }
    return (
        <form onSubmit={onFormSubmit}>
            <button type="button" onClick={onChangeAvatar}>
                {/* Selecting an avatar icon will be added. */}
                <div></div>
            </button>
            <input onChange={onChangeNickname} placeholder="Enter nickname" required />
            <button type="submit">➡️</button>
        </form>
    )
}