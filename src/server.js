import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import 'dotenv/config';
import { socketEvent } from './types';

const app = express();
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('/', (_, res) => res.sendFile(path.join(__dirname, '/client/build/index.html')));
const httpServer = createServer(app);
const server = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});
const getPublicRooms = () => {
    const { sockets: { adapter: { sids, rooms } } } = server;
    const publicRooms = [];
    rooms.forEach((_, key) => sids.get(key) === undefined && publicRooms.push({ name: key, size: rooms.get(key).size }));
    return publicRooms;
}
const getUserInfo = id => {
    const { sockets: { sockets } } = server;
    return sockets.get(id).userInfo;
}
server.on("connection", socket => {
    server.sockets.emit(socketEvent.UPDATE_ROOMLIST, { rooms: getPublicRooms() });
    console.log(`${socket.id} is connected`);
    socket.on(socketEvent.JOIN_ROOM, ({ nickname, avatarNum, room }, done) => {
        socket['userInfo'] = { id: socket.id, nickname, avatarNum };
        socket.join(room);
        socket.to(room).emit(socketEvent.JOIN_ROOM, { id: socket.id, nickname, avatarNum });
        server.sockets.emit(socketEvent.UPDATE_ROOMLIST, { rooms: getPublicRooms() });
        done();
    });
    socket.on(socketEvent.SEND_MESSAGE, ({ message, room }) => {
        socket.to(room).emit(socketEvent.SEND_MESSAGE, { senderInfo: socket.userInfo, message });
    });
    socket.on(socketEvent.OFFER, ({ offer, room, peer: peerId }) => {
        const peer = getUserInfo(peerId);
        socket.to(room).emit('offer', { offer, peer });
    });
    socket.on(socketEvent.ANSWER, ({ answer, room, peer: peerId }) => {
        const peer = getUserInfo(peerId);
        socket.to(room).emit('answer', { answer, peer });
    });
    socket.on(socketEvent.ICE, (iceData, room) => {
        socket.to(room).emit('ice', iceData);
    })
    socket.on('disconnecting', () => {
        console.log(`${socket.id} is disconnecting`);
        socket.rooms.forEach(room => {
            socket.to(room).emit(socketEvent.LEAVE_ROOM, { id: socket.id, nickname: socket.userInfo?.nickname });
            socket.leave(room);
            server.sockets.emit(socketEvent.UPDATE_ROOMLIST, { rooms: getPublicRooms() });
        })
    })
})

httpServer.listen(process.env.SERVER_PORT, () => console.log(`Server is running on Port ${process.env.SERVER_PORT}`));