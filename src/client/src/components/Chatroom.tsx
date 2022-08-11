import React, { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../utils/client";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/styles";
import { IMessage, IUserInfo, socketEvent } from '../types';
import Chat from "./Chat";
import { useForm } from "react-hook-form";

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
    height: 85%;
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
interface IMessageForm {
    message: string
}
interface IMyInfo {
    nickname?: string,
    room?: string
}
export default () => {
    const navigate = useNavigate();
    const userState = useLocation()?.state as IMyInfo;
    // setMyNickname: For future function - change user's nickname
    const [myNickname, setMyNickname] = useState("");
    const [room, setRoom] = useState("");
    const [messages, setMessages] = useState<IMessage[]>([]);
    const { register, handleSubmit, reset } = useForm<IMessageForm>();
    const chatbox = useRef<HTMLDivElement>(null);
    const form = useRef<HTMLFormElement>(null);
    const onMessageEntered = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            console.log(form.current)
            form.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    }
    const onMessageSubmit = ({ message }: IMessageForm) => {
        reset();
        const data: IMessage = { type: "MyChat", content: { text: message } };
        socket.emit(socketEvent.SEND_MESSAGE, { message, room }, setMessages(prev => [...prev, data]));
    };
    useEffect(() => {
        if (!userState) {
            navigate('/');
            return;
        }
        else {
            setMyNickname(userState.nickname || "");
            setRoom(userState.room || "");
        }
        socket.on(socketEvent.JOIN_ROOM, (userInfo: IUserInfo) => {
            const data: IMessage = { type: "Join", content: { text: `${userInfo.nickname} joined this room`, sender: { ...userInfo } } };
            setMessages(prev => [...prev, data]);
        });
        socket.on(socketEvent.LEAVE_ROOM, (userInfo: IUserInfo) => {
            const data: IMessage = { type: "Leave", content: { text: `${userInfo.nickname} left this room`, sender: { ...userInfo } } };
            setMessages(prev => [...prev, data]);
        })
        socket.on(socketEvent.SEND_MESSAGE, ({ senderInfo, message }) => {
            const data: IMessage = { type: "Chat", content: { text: message, sender: { ...senderInfo } } };
            setMessages(prev => [...prev, data]);
        })
    }, [socket]);
    useEffect(() => chatbox?.current?.scrollTo({ top: chatbox?.current?.scrollHeight }), [messages])
    return (
        <Container>
            <Chats ref={chatbox}>
                <JoinLeftRoomMessage>{`${myNickname} joined this room.`}</JoinLeftRoomMessage>
                <Messages>
                    {messages?.length > 0 && messages.map((message: IMessage, i: number) => (
                        (message.type === 'Chat' || message.type === 'MyChat')
                            ? <Chat key={i} {...message} />
                            : <JoinLeftRoomMessage key={i}>{message?.content?.text}</JoinLeftRoomMessage>
                    ))}
                </Messages>
            </Chats>
            <Form onSubmit={handleSubmit(onMessageSubmit)} ref={form}>
                <EnterChat>
                    <TextArea onKeyDown={onMessageEntered} {...register("message", { required: true })} placeholder="Enter your message" />
                </EnterChat>
                <SendMessageButton><FontAwesomeIcon icon={faPaperPlane} /></SendMessageButton>
            </Form>
        </Container>
    )
}