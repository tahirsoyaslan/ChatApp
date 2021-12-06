const  users = [];

function addUser(id, username, room){
    const user = {  id,username,room};
    users.push(user);
    return user;
}

function getUsersInRoom(room){
    return users.filter(user => user.room === room);
}

function removeUser(id){
    const index = users.findIndex(user => user.id === id);
    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

function getCurrentUser(id){
    return users.find(user => user.id === id);
}

module.exports = {
    addUser,
    getUsersInRoom,
    removeUser,
    getCurrentUser
};