import React, { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../utils/client";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faPaperPlane, faVolumeUp, faX } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/styles";
import { IMessage, IUserInfo, socketEvent } from '../types';
import Chat from "./Chat";
import { useForm } from "react-hook-form";
import peerConnection from "../libs/peerConnection";

const Container = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const VideoContainer = styled.div`
    position: relative;
    flex: 1;
    height: 100%;
    background-color: black;
`;
const Videos = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 1em;
    & > video{
        width: 45%;
        aspect-ratio: 4 / 3;
        background-color: #757575;
    }
`;
const MyFace = styled.video``;
const PeerFace = styled.video``;
const Settings = styled.div`
    position: absolute;
    padding: 0 1em;
    width: 100%;
    height: 3em;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #757575;
`;
const CameraSettings = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;
const MuteButton = styled.button`
    position: relative;
    height: 100%;
    aspect-ratio: 1 / 1;
    font-size: x-large;
`;
const NoStream = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    & path{
        color: red;
    }
`;
const NoVolume = styled(NoStream)``;
const CamToggleButton = styled(MuteButton)``;
const NoCam = styled(NoStream)``;
const ExitButton = styled.button`
    padding: 0 0.7em;
    aspect-ratio: 2 / 1;
    background-color: red;
    color: white;
    font-size: 1em;
    font-weight: 600;
`;
const ChatContainer = styled.div`
    position: relative;
    width: 30%;
    height: 100%;
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
    right: 0;
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
    width: 100%;
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
interface IStreamState {
    isVolumnOn: boolean,
    isCamOn: boolean
}
interface IRtcConnection {
    handleMuteClick: () => void,
    handleCameraOnClick: () => void
}
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

    // Videocall
    const [rtcState, setRtcState] = useState<IRtcConnection>();
    const [streamState, setStreamState] = useState<IStreamState>({ isVolumnOn: true, isCamOn: true });
    const myFace = useRef<HTMLVideoElement>(null);
    const peerFace = useRef<HTMLVideoElement>(null);
    const handleMuteClick = () => {
        setStreamState({ ...streamState, isVolumnOn: !streamState.isVolumnOn });
        rtcState?.handleMuteClick();
    };
    const handleCameraOnClick = () => {
        setStreamState({ ...streamState, isCamOn: !streamState.isCamOn });
        rtcState?.handleCameraOnClick();
    }
    //
    const { register, handleSubmit, reset } = useForm<IMessageForm>();
    const chatbox = useRef<HTMLDivElement>(null);
    const form = useRef<HTMLFormElement>(null);
    const handleMessageEntered = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            console.log(form.current)
            form.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    }
    const handleMessageSubmit = ({ message }: IMessageForm) => {
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
    useEffect(() => chatbox?.current?.scrollTo({ top: chatbox?.current?.scrollHeight }), [messages]);
    useEffect(() => {
        if (room !== "") {
            (async () => {
                const result = await peerConnection({ room, myFace: myFace.current!, peerFace: peerFace.current! });
                setRtcState(result);
            })();
        }
    }, [room])
    return (
        <Container>
            <VideoContainer>
                <Videos>
                    <MyFace autoPlay={true} playsInline={true} ref={myFace} />
                    <PeerFace autoPlay={true} playsInline={true} ref={peerFace} />
                </Videos>
                <Settings>
                    <CameraSettings>
                        <MuteButton onClick={handleMuteClick}>
                            {!streamState.isVolumnOn && <NoVolume><FontAwesomeIcon icon={faX} /></NoVolume>}
                            <FontAwesomeIcon icon={faVolumeUp} />
                        </MuteButton>
                        <CamToggleButton onClick={handleCameraOnClick}>
                            {!streamState.isCamOn && <NoCam><FontAwesomeIcon icon={faX} /></NoCam>}
                            <FontAwesomeIcon icon={faCamera} />
                        </CamToggleButton>
                    </CameraSettings>
                    <ExitButton>Exit</ExitButton>
                </Settings>
            </VideoContainer>
            <ChatContainer>
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
                <Form onSubmit={handleSubmit(handleMessageSubmit)} ref={form}>
                    <EnterChat>
                        <TextArea onKeyDown={handleMessageEntered} {...register("message", { required: true })} placeholder="Enter your message" />
                    </EnterChat>
                    <SendMessageButton><FontAwesomeIcon icon={faPaperPlane} /></SendMessageButton>
                </Form>
            </ChatContainer>
        </Container>
    )
}