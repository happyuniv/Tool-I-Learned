const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('name', (name) => {
    socket.name = name
  })

  socket.on('enter_room', (streamId,user) => {
    socket.join('room')
    socket.to('room').emit('enter_room',streamId,user)
  })

  socket.on('send_info', (streamId, user) => {
    io.to('room').emit('update_users', streamId, user)
  })

  socket.on('offer', (offer) => {
    socket.to('room').emit('offer', offer)
  })

  socket.on('answer', (answer) => {
    socket.to('room').emit('answer', answer)
  })

  socket.on('ice', (candidate) => {
    socket.to('room').emit('ice', candidate)
  })
})

server.listen('3000')
