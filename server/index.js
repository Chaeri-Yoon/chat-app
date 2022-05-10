import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

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
    socket.on("disconnect", () => console.log(`${socket.id} is disconnected`));
})

httpServer.listen(process.env.SERVER_PORT | 3000, () => console.log(`Server is running on Port ${process.env.SERVER_PORT | 3000}`));