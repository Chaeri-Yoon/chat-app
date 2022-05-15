import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from "styled-components";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/styles";

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
const AvatarContainer = styled.div`
    background-color: ${styles.darkGrey};
    margin: 10px;
    aspect-ratio: 1 / 1;
    border-radius: 10px;
`;

const Avatar = styled.img<{ index: number }>`
    width: 100%;
    aspect-ratio: 1 / 1;
    background-image: url(/avatars/avatar_${props => props.index}.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    border-radius: 10px;
`;
const Nickname = styled.input`
    width: 50%;
    padding: 8px 15px;
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
            <Button type="button" onClick={onChangeAvatar}>
                <AvatarContainer>
                    <Avatar index={avatarNum} />
                </AvatarContainer>
            </Button>
            <Nickname onChange={onChangeNickname} placeholder="Enter nickname" required />
            <Button type="submit"><FontAwesomeIcon icon={faArrowRight} /></Button>
        </Form>
    )
}