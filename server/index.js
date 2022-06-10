import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { messageType, socketEvent } from './type.js';

const app = express();
const httpServer = createServer(app);
const server = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});
server.on("connection", socket => {
    console.log(`${socket.id} is connected`);
    socket.on(socketEvent.ENTER_ROOM, ({ nickname, avatarNum }) => {
        socket.nickname = nickname;
        socket.avatarNum = avatarNum;
        socket.broadcast.emit(socketEvent.ENTER_ROOM, { type: messageType.ENTER, content: { text: `${nickname} entered room.`, sender: { nickname, avatarNum } } });
    });
    socket.on(socketEvent.DISCONNECT, () => socket.broadcast.emit(socketEvent.EXIT_ROOM, { type: messageType.LEAVE, content: { text: `${socket.nickname} left room.` } }));
    socket.on(socketEvent.SEND_MESSAGE,
        ({ text }) => socket.broadcast.emit(socketEvent.RECEIVE_MESSAGE,
            {
                type: messageType.CHAT,
                content: {
                    text,
                    sender: { nickname: socket.nickname, avatarNum: socket.avatarNum }
                }
            }
        ))
})

httpServer.listen(process.env.SERVER_PORT | 4000, () => console.log(`Server is running on Port ${process.env.SERVER_PORT | 4000}`));