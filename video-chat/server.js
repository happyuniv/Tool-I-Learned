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

server.listen('3000', () => {
  console.log('server running')
})
