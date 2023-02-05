import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')

app.use('/public', express.static(__dirname + '/public'))

app.get('/', (req, res) => res.render('home'))

const httpServer = createServer(app)
const io = new Server(httpServer, {
  /* options */
})

io.on('connection', (socket) => {
  console.log('connected')
  socket.nickName = 'anonymous'

  socket.on('name', (name) => {
    socket.nickName = name
  })

  socket.on('enter_room', () => {
    socket.join('room')
    socket.emit('initial_enter_room')
    socket.to('room').emit('enter_room', socket.nickName)
  })

  socket.on('send_message', (msg) => {
    socket.to('room').emit('receive_message', msg)
  })
  socket.on('disconnect', () => {
    socket.to('room').emit('leave_room', socket.nickName)
    console.log('user disconnected')
  })
})

httpServer.listen(3000)
