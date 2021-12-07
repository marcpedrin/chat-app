const users = [];

// join user to chat

function userJoined(id, username, room){
    const user = {id, username, room};
    users.push(user);
    return user
}



// get current user

function getCurrentUser(id){
    // return users.find((user)=> {user.id === id});
    return users.find(eachUser=> eachUser.id === id)
}

// user leaves chat

function userLeave(id){
    
    const index = users.findIndex(eachUser=> eachUser.id === id)
    return users.splice(index, 1);
}

// get room users

function getRoomUsers(room){
    return users.filter(eachUser=> eachUser.room === room)
}

module.exports = {
    userJoined,
    getCurrentUser,
    userLeave,
    getRoomUsers
}