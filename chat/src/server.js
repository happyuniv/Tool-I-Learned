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
  // ...
})

httpServer.listen(3000)
