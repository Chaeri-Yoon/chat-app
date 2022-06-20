import React, { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../utils/client";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/styles";
import { IMessage, IUserInfo, socketEvent, MessageType } from '../types';
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
    const { nickname } = useLocation()?.state as IUserInfo
    const [myNickname, setMyNickname] = useState(nickname);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const chatbox = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!nickname) {
            navigate('/');
            return;
        }
        socket.on(socketEvent.JOIN_ROOM, (userInfo: IUserInfo) => {
            const data: IMessage = { type: "Join", content: { text: `${userInfo.nickname} joined this room`, sender: { ...userInfo } } };
            setMessages(prev => [...prev, data]);
        });
        socket.on(socketEvent.LEAVE_ROOM, (userInfo: IUserInfo) => {
            const data: IMessage = { type: "Leave", content: { text: `${userInfo.nickname} left this room`, sender: { ...userInfo } } };
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
            <Form>
                <EnterChat>
                    <TextArea placeholder="Message" />
                </EnterChat>
                <SendMessageButton><FontAwesomeIcon icon={faPaperPlane} /></SendMessageButton>
            </Form>
        </Container>
    )
}