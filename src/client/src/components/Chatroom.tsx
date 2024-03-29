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
import useVideoConnection from "../libs/useVideoConnection";

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
    & > div{
        position: relative;
        width: 45%;
        aspect-ratio: 4 / 3;
        & > video{
            width: 100%;
            height: 100%;
        }
        & > span{
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 0.4em 0;
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            font-size: 0.75em;
            text-align: center;
        }
    }
`;
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
interface IEventFlag {
    join: boolean,
    offer: RTCSessionDescriptionInit | null,
    answer: RTCSessionDescriptionInit | null,
    ice: RTCIceCandidate | null
}
interface IStreamState {
    isVolumnOn: boolean,
    isCamOn: boolean
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
    const [peer, setPeer] = useState<IUserInfo>({ id: '', nickname: '', avatarNum: 0 });
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [eventState, setEventState] = useState<IEventFlag>({ join: false, offer: null, answer: null, ice: null });

    // Videocall
    const [streamState, setStreamState] = useState<IStreamState>({ isVolumnOn: true, isCamOn: true });
    const myFace = useRef<HTMLVideoElement>(null);
    const peerFace = useRef<HTMLVideoElement>(null);
    const { handleMuteClick, handleCameraOnClick, makeConnection, peerFunctionState, myStream, peerStream } = useVideoConnection({ room });
    const onMuteClick = () => {
        setStreamState({ ...streamState, isVolumnOn: !streamState.isVolumnOn });
        handleMuteClick();
    };
    const onCameraOnClick = () => {
        setStreamState({ ...streamState, isCamOn: !streamState.isCamOn });
        handleCameraOnClick();
    }
    const { register, handleSubmit, reset } = useForm<IMessageForm>();
    const chatbox = useRef<HTMLDivElement>(null);
    const form = useRef<HTMLFormElement>(null);
    const handleMessageEntered = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
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
    }, []);
    useEffect(() => {
        if (!socket) return;
        socket.on(socketEvent.JOIN_ROOM, async (userInfo: IUserInfo) => {
            const data: IMessage = { type: "Join", content: { text: `${userInfo.nickname} joined this room`, sender: { ...userInfo } } };
            setMessages(prev => [...prev, data]);
            setEventState(prev => ({ ...prev, join: true }));
        });
        socket.on(socketEvent.LEAVE_ROOM, (userInfo: IUserInfo) => {
            const data: IMessage = { type: "Leave", content: { text: `${userInfo.nickname} left this room`, sender: { ...userInfo } } };
            setMessages(prev => [...prev, data]);
            setPeer(prev => ({ ...prev, id: '', nickname: '', avatarNum: 0 }));
            if (peerFace.current) peerFace.current.srcObject = null;
            makeConnection();
        });
        socket.on(socketEvent.OFFER, ({ offer, peer }: { offer: RTCSessionDescriptionInit, peer: IUserInfo }) => {
            setPeer(prev => ({ ...prev, ...peer }));
            setEventState(prev => ({ ...prev, offer }));
        });
        socket.on(socketEvent.ANSWER, ({ answer, peer }: { answer: RTCSessionDescriptionInit, peer: IUserInfo }) => {
            setPeer(prev => ({ ...prev, ...peer }));
            setEventState(prev => ({ ...prev, answer }))
        });
        socket.on(socketEvent.ICE, (ice: RTCIceCandidate) => setEventState(prev => ({ ...prev, ice })));
        socket.on(socketEvent.SEND_MESSAGE, ({ senderInfo, message }) => {
            const data: IMessage = { type: "Chat", content: { text: message, sender: { ...senderInfo } } };
            setMessages(prev => [...prev, data]);
        })
    }, [socket]);
    useEffect(() => {
        if (!peerFunctionState) return;
        if (!(eventState.join || eventState.answer || eventState.offer || eventState.ice)) return;

        if (eventState.join) peerFunctionState?.sendOffer({ peer: socket.id, room });
        if (eventState.offer) peerFunctionState?.sendAnswer({ peer: socket.id, offer: eventState.offer, room });
        if (eventState.answer) peerFunctionState?.receiveAnswer(eventState.answer);
        if (eventState.ice) peerFunctionState?.receiveIce(eventState.ice);

        setEventState(prev => ({ ...prev, join: false, offer: null, answer: null, ice: null }));
    }, [eventState, peerFunctionState]);
    useEffect(() => chatbox?.current?.scrollTo({ top: chatbox?.current?.scrollHeight }), [messages]);
    useEffect(() => { if (myStream && myFace.current) myFace.current.srcObject = myStream }, [myFace, myStream]);
    useEffect(() => { if (peerStream && peerFace?.current) peerFace.current.srcObject = peerStream }, [peer, peerStream]);
    return (
        <Container>
            <VideoContainer>
                <Videos>
                    <div>
                        <video autoPlay={true} playsInline={true} ref={myFace} />
                        <span>{myNickname}</span>
                    </div>
                    <div>
                        <video autoPlay={true} playsInline={true} ref={peerFace} />
                        {peer && <span>{peer.nickname}</span>}
                    </div>
                </Videos>
                <Settings>
                    <CameraSettings>
                        <MuteButton onClick={onMuteClick}>
                            {!streamState.isVolumnOn && <NoVolume><FontAwesomeIcon icon={faX} /></NoVolume>}
                            <FontAwesomeIcon icon={faVolumeUp} />
                        </MuteButton>
                        <CamToggleButton onClick={onCameraOnClick}>
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