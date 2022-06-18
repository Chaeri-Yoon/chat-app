import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import styles from "../styles/styles";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import AvatarContainer from "./AvatarContainer";
import { IDataState, socketEvent } from "../types";
import socket from "../utils/client";

const Form = styled.form`
    width: 80%;
    height: 100%;
    max-width: 400px;
    min-width: 300px;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & > *{
        width: 100%;
    }
`;
const InputContainer = styled.div`
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    & > *{
        width: 100%;
    }
`;
const Button = styled.button`
    background-color: ${styles.lightGrey};
    padding: 8px;
`;
const Nickname = styled.div`
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    & input{
        flex: 1;
        border: 1px ${styles.lightGrey} solid;
    }
`;
const Room = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    & > *{
        width: 100%;
    }
`;
const CreateRoom = styled.div`
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;
const CreateRoomInputs = styled.div`
    width: 100%;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    & button{
        position: absolute;
        right: 8px;
    }
    & input{
        margin-bottom: 5px;
        width: 100%;
        border: 1px ${styles.lightGrey} solid;
    }
`;
const MessageRoomExist = styled.span`
    color: red;
    font-size: x-small;
`;
const SelectRoom = styled.select`
    color: ${styles.lightGrey};
    border: 1px ${styles.lightGrey} solid;
`;
export default () => {
    const navigate = useNavigate();
    const [dataState, setDataState] = useState<IDataState>({
        user: {
            avatarNum: 0,
            nickname: '',
        },
        room: '',
        roomList: [],
        chatroomMode: 'Select'
    });
    useEffect(() => {
        socket.on(socketEvent.UPDATE_ROOMLIST, ({ rooms }) => setDataState(prev => ({ ...prev, roomList: [...rooms] })));
    }, [socket]);
    const handleChangeAvatar = () => {
        setDataState(prev => {
            const user = { ...prev.user, avatarNum: (prev.user.avatarNum + 1) % 3 };
            return { ...prev, user };
        })
    }
    const handleChangeNickname = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDataState(prev => {
            const user = { ...prev.user, nickname: event?.target.value };
            return { ...prev, user };
        })
    }
    const handleWriteRoomName = (event: React.ChangeEvent<HTMLInputElement>) => setDataState(prev => ({ ...prev, room: event?.target.value }));
    const handleChangeChatroomMode = (event: React.ChangeEvent<HTMLSelectElement> | React.MouseEvent<HTMLButtonElement>) => {
        if (dataState.chatroomMode === 'Select') {
            const { value } = event.target as HTMLSelectElement;
            if (value === 'create') setDataState(prev => ({ ...prev, chatroomMode: 'Create' }));
            else setDataState(prev => ({ ...prev, room: value }));
        }
        else if (dataState.chatroomMode === 'Create') setDataState(prev => ({ ...prev, chatroomMode: 'Select' }));
    }
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { user: { nickname, avatarNum }, room } = dataState;
        socket.emit(socketEvent.JOIN_ROOM, { nickname, avatarNum, room }, () => navigate('/chatroom', { state: { nickname, avatarNum, room } }));
    }
    return (
        <Form onSubmit={handleSubmit}>
            <InputContainer>
                <Nickname>
                    <AvatarContainer index={dataState.user.avatarNum} clickHandler={handleChangeAvatar} />
                    <input onChange={handleChangeNickname} placeholder="Enter nickname" required />
                </Nickname>
                <Room>
                    {dataState?.chatroomMode === 'Select' ? (
                        <SelectRoom onChange={handleChangeChatroomMode} defaultValue='default'>
                            <option value="default" disabled>--Select Room--</option>
                            {dataState?.roomList?.map(room => <option value={room}>{room}</option>)}
                            <option value="create">Create Room</option>
                        </SelectRoom>
                    ) : (
                        <CreateRoom>
                            <CreateRoomInputs>
                                <input onChange={handleWriteRoomName} placeholder="Enter room name" type="text" />
                                <button type="button" onClick={handleChangeChatroomMode}><FontAwesomeIcon icon={faCaretDown} /></button>
                            </CreateRoomInputs>
                            <MessageRoomExist>Default</MessageRoomExist>
                        </CreateRoom>
                    )}
                </Room>
            </InputContainer>
            <Button type="submit">Join</Button>
        </Form>
    )
}