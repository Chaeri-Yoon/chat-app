import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import 'dotenv/config';

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
server.on("connection", socket => {
    console.log(`${socket.id} is connected`);
})

httpServer.listen(process.env.SERVER_PORT | 4000, () => console.log(`Server is running on Port ${process.env.SERVER_PORT | 4000}`));