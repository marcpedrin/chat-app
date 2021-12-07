const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// get username and room from url

const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});
const socket = io();

// join chatroom

socket.emit('joinRoom', {
    username, room
})

// get room and users

socket.on('roomUsers', (room, users)=>{
    outputRoomName(room);
    outputUsers(users);
})

// message from server 

socket.on('message', (message)=>{
    console.log(message);
    outputMessage(message)

    // scroll down

    chatMessages.scrollTop = chatMessages.scrollHeight ;


})

// message submit

chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    // get message text

    let msg = e.target.elements.msg.value
    msg = msg.trim()

    if(!msg){
        return false
    }

    // emit msg to server

    socket.emit('chatMessage', msg);

    // clearing input box

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus() 
})
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p')
    p.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    chatMessages.appendChild(div)
}

function outputRoomName (room){
    roomName.innerText = `${room}`
}

function outputUsers(users){
    userList.innerHTML = '';
    users.forEach((user)=>{
        const li = document.createElement('li')
        li.innerText = user.username;
        userList.appendChild(li)
    })
}

document.getElementById('leave-btn').addEventListener('click', ()=>{
    const leaveRoom = confirm('Are you sure you want to leave the Chat Room?')
    if(leaveRoom){
        window.location = '../index.html'
    }

    else{
        
    }
})