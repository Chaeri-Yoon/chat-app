import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import styles from "../styles/styles";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import AvatarContainer from "./AvatarContainer";
import { socketEvent } from "../types";
import socket from "../utils/client";
import { useForm } from 'react-hook-form';

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
    background-color: ${styles.darkGrey};
    color: white;
    padding: 8px;
    &:disabled{
        background-color: ${styles.lightGrey};
    }
`;
const NicknameContainer = styled.div`
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Nickname = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    & input{
        width: 100%;
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
const ErrorMessage = styled.span`
    color: red;
    font-size: x-small;
`;
const SelectRoom = styled.select`
    color: ${styles.lightGrey};
    border: 1px ${styles.lightGrey} solid;
`;
const RoomOption = styled.option`
    &:disabled{
        background-color: rgba(255, 0, 0, 0.3);
        color: red;
    }
`;
interface IJoinForm {
    nickname: string;
    room: string;
}
export default () => {
    const navigate = useNavigate();
    const { register, handleSubmit, reset, setValue, getValues, formState: { errors, isValid } } = useForm<IJoinForm>({ mode: "onChange" });
    const [avatarNum, setAvatarNum] = useState(0);
    const [roomList, setRoomList] = useState<{ name: string, size: number }[]>([]);
    const [roomJoinMode, setRoomJoinMode] = useState<'Create' | 'Select'>('Select');
    useEffect(() => {
        socket.on(socketEvent.UPDATE_ROOMLIST, ({ rooms }) => setRoomList(rooms));
    }, [socket]);
    useEffect(() => setValue("room", roomJoinMode === 'Create' ? "" : "default"), [roomJoinMode]);
    const handleChangeAvatar = () => setAvatarNum(prev => (prev + 1) % 3);
    const handleChangeChatroomMode = (event: React.ChangeEvent<HTMLSelectElement> | React.MouseEvent<HTMLButtonElement>) => {
        if (roomJoinMode === 'Select') {
            const { value } = event.target as HTMLSelectElement;
            if (value === 'create') setRoomJoinMode('Create');
        }
        else if (roomJoinMode === 'Create') setRoomJoinMode('Select');
    }
    const isRoomnameValid = () => getValues("room") !== (roomJoinMode === 'Create' ? "" : "default") ? true : "Please select an existing room or create one.";
    const isRoomnameDuplicated = () => roomList?.findIndex(room => room.name == getValues("room")) > -1 ? "This room already exists." : true;
    const onSubmit = (form: IJoinForm) => {
        const { nickname, room } = form;
        socket.emit(socketEvent.JOIN_ROOM, { nickname, avatarNum, room }, () => {
            reset();
            navigate('/chatroom', { state: { nickname, room } });
        });
    }
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <InputContainer>
                <NicknameContainer>
                    <AvatarContainer index={avatarNum} clickHandler={handleChangeAvatar} />
                    <Nickname>
                        <input {...register("nickname", { required: "Please enter nickname" })} placeholder="Enter nickname" />
                        {errors?.nickname && <ErrorMessage>{errors?.nickname?.message}</ErrorMessage>}
                    </Nickname>
                </NicknameContainer>
                <Room>
                    {roomJoinMode === 'Select' ? (
                        <SelectRoom {...register("room", { onChange: handleChangeChatroomMode, validate: isRoomnameValid })} defaultValue='default'>
                            <option value="default" disabled>--Select Room--</option>
                            {roomList?.map(room => <option key={room.name} value={room.name} disabled={room.size == 2}>{room.name} ( {room.size} / 2 )</option>)}
                            <option value="create">Create Room</option>
                        </SelectRoom>
                    ) : (
                        <CreateRoom>
                            <CreateRoomInputs>
                                <input {...register("room", { validate: { isRoomnameValid, isRoomnameDuplicated } })} placeholder="Enter room name" type="text" />
                                <button type="button" onClick={handleChangeChatroomMode}><FontAwesomeIcon icon={faCaretDown} /></button>
                            </CreateRoomInputs>
                            {errors?.room && <ErrorMessage>{isRoomnameDuplicated()}</ErrorMessage>}
                        </CreateRoom>
                    )}
                    {errors?.room && <ErrorMessage>{isRoomnameValid()}</ErrorMessage>}
                </Room>
            </InputContainer>
            <Button disabled={!isValid} type="submit">Join</Button>
        </Form>
    )
}