const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'frontend')));

io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
        const socketid  = socket.id;
        const user = { socketid, username, room };
        addUser(user);
        socket.join(room);
        socket.emit('message', `${username} has joined the room`);
        socket.broadcast.to(room).emit('message', `${username} has joined the room`);

        io.to(room).emit('roomData', {
            room: room,
            users: getUsersInRoom(room)
        });
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);