import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import styles from "../styles/styles";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import AvatarContainer from "./AvatarContainer";

const Form = styled.form`
    width: 80%;
    max-width: 550px;
    min-width: 300px;
    height: 50%;
    transform: translateY(50%);
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Button = styled.button`
    width: 10%;
`;
const Nickname = styled.input`
    width: 50%;
    border: 1px ${styles.lightGrey} solid;
`;

export default () => {
    const navigate = useNavigate();
    const [avatarNum, setAvatarNum] = useState(0);
    const [nickname, setNickname] = useState('');
    const onChangeAvatar = () => setAvatarNum(prev => (prev + 1) % 3);
    const onChangeNickname = (event: React.ChangeEvent<HTMLInputElement>) => setNickname(event.target.value);
    const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate('/chatroom', { state: { nickname, avatarNum } });
    }
    return (
        <Form onSubmit={onFormSubmit}>
            <AvatarContainer index={avatarNum} clickHandler={onChangeAvatar} />
            <Nickname onChange={onChangeNickname} placeholder="Enter nickname" required />
            <Button type="submit"><FontAwesomeIcon icon={faArrowRight} /></Button>
        </Form>
    )
}