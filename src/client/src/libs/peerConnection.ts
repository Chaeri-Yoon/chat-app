import socket from "../utils/client";

export default async ({ room, myFace, peerFace }: { room: string, myFace: HTMLVideoElement, peerFace: HTMLVideoElement }) => {
    let myStream: MediaStream;
    let peerConnection: RTCPeerConnection;

    const handleMuteClick = () => myStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    const handleCameraOnClick = () => myStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    const handleIce = (iceData: RTCPeerConnectionIceEvent) => socket.emit('ice', iceData.candidate, room);
    const handleTrack = (trackData: RTCTrackEvent) => peerFace.srcObject = trackData.streams[0];
    const makeConnection = () => {
        peerConnection = new RTCPeerConnection({
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
        // Track 추가
        myStream?.getTracks().forEach(track => peerConnection.addTrack(track, myStream!));
        peerConnection.addEventListener('icecandidate', handleIce);
        peerConnection.addEventListener('track', handleTrack);
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
            myStream = await navigator.mediaDevices.getUserMedia(constraint);
            console.log(myStream.getAudioTracks())
            myFace.srcObject = myStream;
        } catch (e) {
            console.log(e);
        }
    }
    const initConnection = async () => {
        await getMedia();
        makeConnection();
    }
    await initConnection();
    return { handleMuteClick, handleCameraOnClick }
};