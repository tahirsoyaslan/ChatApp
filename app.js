
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const {
    addUser,
    removeUser,
    getUsersInRoom,
    getCurrentUser
} = require('./worker/users');

app.use(express.static(path.join(__dirname, 'frontend')));

io.on('connection', socket => {
    console.log(`Server is running on port`);
    socket.on('joinRoom', ({ username, room }) => {
        const user = addUser(socket.id, username, room);
        socket.join(user.room);
        const temp2 = {username: "ChatBot", text: `${user.username} has joined the chat`};
        
        socket.broadcast.to(user.room).emit('message', temp2);

        io.to(room).emit('roomData', {
            room: room,
            users: getUsersInRoom(room)
        });
    });
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
      console.log(user);
        const temp = { username: user.username, text: msg };
        io.to(user.room).emit('message', temp);
      });
      socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
          io.to(user.room).emit('message', `${user.username} has left the room`);
          io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
          });
        }
      }
    );
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);