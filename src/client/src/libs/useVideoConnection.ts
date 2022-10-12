import { useState, useEffect } from "react"
import socket from "../utils/client";
import { socketEvent } from "../types";

export interface IPeerFunctionState {
    sendOffer: ({ peer, room }: { peer: string, room: string }) => Promise<void>,
    sendAnswer: ({ peer, offer, room }: { peer: string, offer: RTCSessionDescriptionInit, room: string }) => Promise<void>,
    receiveAnswer: (answer: RTCSessionDescriptionInit) => void,
    receiveIce: (ice: RTCIceCandidate) => void,
}
export default ({ room }: { room: string }) => {
    const [myStream, setMyStream] = useState<MediaStream>();
    const [peerStream, setPeerStream] = useState<MediaStream>();
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>();
    const [peerFunctionState, setPeerFunctionState] = useState<IPeerFunctionState>();

    const sendOffer = async ({ peer, room }: { peer: string, room: string }) => {
        const offer = await peerConnection?.createOffer();
        peerConnection?.setLocalDescription(offer);
        socket.emit(socketEvent.OFFER, { offer, room, peer })
    }
    const sendAnswer = async ({ peer, offer, room }: { peer: string, offer: RTCSessionDescriptionInit, room: string }) => {
        peerConnection?.setRemoteDescription(offer);
        const answer = await peerConnection?.createAnswer();
        peerConnection?.setLocalDescription(answer);
        socket.emit(socketEvent.ANSWER, { answer, room, peer });
    }
    const receiveAnswer = (answer: RTCSessionDescriptionInit) => peerConnection?.setRemoteDescription(answer)
    const receiveIce = (ice: RTCIceCandidate) => peerConnection?.addIceCandidate(ice);
    const handleMuteClick = () => myStream?.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    const handleCameraOnClick = () => myStream?.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    const handleIce = (iceData: RTCPeerConnectionIceEvent) => socket.emit('ice', iceData.candidate, room);
    const handleTrack = (trackData: RTCTrackEvent) => setPeerStream(trackData.streams[0]);
    const makeConnection = () => {
        const peerConnection = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:stun1.l.google.com:19302",
                        "stun:stun2.l.google.com:19302",
                        "stun:stun3.l.google.com:19302",
                        "stun:stun4.l.google.com:19302"
                    ]
                }
            ]
        });
        setPeerConnection(peerConnection);
    }
    const getMedia = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');

        const constraint = cameras[0]?.deviceId ? {
            audio: true,
            video: { deviceId: { exact: cameras[0].deviceId } }
        } : {
            audio: true,
            video: true
        }
        try {
            const myStream = await navigator.mediaDevices.getUserMedia(constraint);
            setMyStream(myStream);
        } catch (e) {
            console.log(e);
        }
    }
    const initConnection = async () => {
        await getMedia();
        makeConnection();
    }
    useEffect(() => {
        (async () => {
            await initConnection();
        })();
    }, []);
    useEffect(() => {
        if (peerConnection) {
            myStream?.getTracks().forEach(track => peerConnection?.addTrack(track, myStream!));
            peerConnection.addEventListener('icecandidate', handleIce);
            peerConnection.addEventListener('track', handleTrack);

            setPeerFunctionState({ sendOffer, sendAnswer, receiveAnswer, receiveIce });
        }
    }, [peerConnection]);
    return { handleMuteClick, handleCameraOnClick, makeConnection, peerFunctionState, myStream, peerStream }
};