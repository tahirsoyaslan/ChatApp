const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
if(username > room){
  newRoom = username+room;
}
else{
  newRoom = room+username;
}
console.log(newRoom);
const socket = io();

socket.emit('joinRoom', { username, newRoom });

socket.on('roomData', ({ newRoom, users }) => {
    outputRoomName(room);
});

socket.on('message', message => {
    console.log("this is socket on : " + message);
    outputMessage(message);
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(e.target.elements.msg.value);
    // Get message text
    let msg = e.target.elements.msg.value;
    //print msg to console
    msg = msg.trim();
  
    if (!msg) {
      return false;
    }
  
    // Emit message to server
    socket.emit('chatMessage', msg);
  
    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
  });

  function outputMessage(message) {
    console.log("this one : " + message.text);
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username + ' : ';
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
  }

function outputRoomName(room) {
    roomName.innerText = room;
}

