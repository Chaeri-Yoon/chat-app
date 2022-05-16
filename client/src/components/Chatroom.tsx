import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { IMessage, IUserInfo, socketEvent } from '../type';
import socket from "../utils/client";
import styled from "styled-components";
import styles from "../styles/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
`;
const EnterLeftRoomMessage = styled.span`
    align-self: center;
`;
const Chats = styled.div`
    padding: 8px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    & > ${EnterLeftRoomMessage}{
        margin-bottom: 8px;
    }
`;
const Messages = styled.ul`
  width: 100%;
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-y: scroll;
  list-style-type: none;
`;
const ReceiveMessage = styled.li`
    align-self: flex-start;
`;
const MyMessage = styled.li`
    align-self: flex-end;
`;
const Form = styled.form`
    padding: 8px 15px;
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    background-color: ${styles.lightGrey};
`;
const EnterChat = styled.input`
    flex: 1;
`;
const SendMessageButton = styled.button`
    margin-left: 8px;
    width: 30px;
    aspect-ratio: 1 / 1;
    background-color: ${styles.darkGrey};
    color: white;
`;
export default () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { nickname, avatarNum } = useLocation()?.state as IUserInfo || { nickname: '', avatarNum: '' };
    const [enterChat, setEnterChat] = useState('');
    const [messages, setMessages] = useState<IMessage[]>([]);
    useEffect(() => { if (nickname === '' || avatarNum.toString() === '') navigate('/'); }, [location]);
    useEffect(() => {
        socket.open();
        socket.on('connect', () => {
            socket.emit(socketEvent.enter_room, { nickname, avatarNum });
            socket.on(socketEvent.receive_message, (data: IMessage) => setMessages(prev => [...prev, data]));
            socket.on(socketEvent.exit_room, (data: IMessage) => setMessages(prev => [...prev, data]));
            socket.on(socketEvent.enter_room, (data: IMessage) => setMessages(prev => [...prev, data]));
        });
    }, []);
    const onChangeEnterChat = (event: React.ChangeEvent<HTMLInputElement>) => setEnterChat(event.target.value);
    const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        socket.emit(socketEvent.send_message, { text: enterChat });
        setMessages(prev => [...prev, { type: "myChat", text: enterChat }]);
        setEnterChat('');
    }
    return (
        <Container>
            <Chats>
                {nickname && (nickname !== '') && <EnterLeftRoomMessage>{`${nickname} entered this room.`}</EnterLeftRoomMessage>}
                <Messages>
                    {messages?.length > 0 && messages.map((message: IMessage, i: number) => (
                        message.type === 'chat'
                            ? <ReceiveMessage key={i}>{message.text}</ReceiveMessage>
                            : (
                                message.type === 'myChat'
                                    ? <MyMessage key={i}>{message.text}</MyMessage>
                                    : <EnterLeftRoomMessage key={i}>{message.text}</EnterLeftRoomMessage>
                            )
                    ))}
                </Messages>
            </Chats>
            <Form onSubmit={sendMessage}>
                <EnterChat onChange={onChangeEnterChat} value={enterChat} placeholder="Message" />
                <SendMessageButton><FontAwesomeIcon icon={faPaperPlane} /></SendMessageButton>
            </Form>
        </Container>
    )
}