import React, { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../utils/client";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/styles";
import { IMessage, IUserInfo, socketEvent } from '../types';
import Chat from "./Chat";

const Container = styled.div`
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
`;
const JoinLeftRoomMessage = styled.span`
    align-self: center;
    font-size: small;
`;
const Chats = styled.div`
    padding: 8px;
    width: 100%;
    height: calc(100vh - 50px);
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: scroll;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    & > ${JoinLeftRoomMessage}{
        margin-bottom: 8px;
    }
    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar{
        display: none;
    }
`;
const Messages = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  list-style-type: none;
  & > *{
      margin-bottom: 8px;
  }
`;
const Form = styled.form`
    padding: 8px 15px;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 15%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    background-color: ${styles.lightGrey};
    @media only screen and (max-width: 1024px) {
        height: 10%;
    }
`;
const EnterChat = styled.div`
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
`;
const SelectChatType = styled.select`
    width: 10%;
    padding: 8px;
`;
const TextArea = styled.textarea`
    height: 100%;
    flex: 1;
    margin: 0 8px;
    overflow-wrap: break-word;
`;
const SendMessageButton = styled.button`
    width: 34px;
    padding: 8px 0;
    aspect-ratio: 1 / 1;
    background-color: ${styles.darkGrey};
    color: white;
`;
export default () => {
    const navigate = useNavigate();
    const { nickname, avatarNum } = useLocation()?.state as IUserInfo || { nickname: '', avatarNum: '' };
    const [joinChat, setJoinChat] = useState('');
    const [messages, setMessages] = useState<IMessage[]>([]);
    const chatbox = useRef<HTMLDivElement>(null);
    const form = useRef<HTMLFormElement>(null);
    useEffect(() => {
        if (nickname === '' || avatarNum.toString() === '') {
            navigate('/');
            return;
        }
        socket.open();
        socket.on('connect', () => {
            socket.emit(socketEvent.join_room, { nickname, avatarNum });
            socket.on(socketEvent.receive_message, (data: IMessage) => setMessages(prev => [...prev, data]));
            socket.on(socketEvent.exit_room, (data: IMessage) => setMessages(prev => [...prev, data]));
            socket.on(socketEvent.join_room, (data: IMessage) => setMessages(prev => [...prev, data]));
        });
    }, []);
    useEffect(() => chatbox?.current?.scrollTo({ top: chatbox?.current?.scrollHeight }), [messages])
    const onChangeJoinChat = (event: React.ChangeEvent<HTMLTextAreaElement>) => setJoinChat(event.target.value);
    const onTextareaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    }
    const sendMessage = () => {
        if (joinChat === '') return;
        socket.emit(socketEvent.send_message, { text: joinChat });
        setMessages(prev => [...prev, { type: "myChat", content: { text: joinChat } }]);
        setJoinChat('');
    }
    return (
        <Container>
            <Chats ref={chatbox}>
                {nickname && (nickname !== '') && <JoinLeftRoomMessage>{`${nickname} joined this room.`}</JoinLeftRoomMessage>}
                <Messages>
                    {messages?.length > 0 && messages.map((message: IMessage, i: number) => (
                        (message.type === 'chat' || message.type === 'myChat')
                            ? <Chat key={i} {...message} />
                            : <JoinLeftRoomMessage key={i}>{message?.content?.text}</JoinLeftRoomMessage>
                    ))}
                </Messages>
            </Chats>
            <Form onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                sendMessage();
            }} ref={form}>
                <EnterChat>
                    <TextArea onChange={onChangeJoinChat} onKeyDown={onTextareaKeyDown} value={joinChat} placeholder="Message" />
                </EnterChat>
                <SendMessageButton><FontAwesomeIcon icon={faPaperPlane} /></SendMessageButton>
            </Form>
        </Container>
    )
}