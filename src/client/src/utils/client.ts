import { io } from 'socket.io-client';
const socket = io(process.env.NODE_ENV === "production" ? process.env.REACT_APP_SERVER_URL! : `http://localhost:${process.env.REACT_APP_SERVER_PORT}`, { transports: ['websocket'] });
export default socket;