const express = require('express');
const app = express();
const PORT = 5555;
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);
const path = require('path')
const formatMessage = require('./utils/messages');
const {userJoined,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users')

// set static folder

app.use(express.static(path.join(__dirname, "public")))

const bot = "chatBot";

// run when client connects

io.on("connection", (socket)=>{
    socket.on('joinRoom', ({username, room})=>{
        const user = userJoined(socket.id, username, room);
        
        socket.join(user.room)


        // welcome current user

        socket.emit('message', formatMessage(bot, "Welcome to chat room"));
        
        // brodcast when a user connects

        socket.broadcast.to(user.room).emit('message', formatMessage(bot, `${user.username} has joined the chat room`))

        // send users and room info

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    // listen for chat messages

    socket.on('chatMessage', (msg)=>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("message", formatMessage(user.username, msg))
        
    })

    // runs when client disconnects

    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message', formatMessage(bot, `${user.username} has left the chat room`))

        // send users and room info

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
        }



        
    })
})

server.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})

