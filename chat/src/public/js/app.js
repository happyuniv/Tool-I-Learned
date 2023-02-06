const socket = io()

const nameContainer = document.querySelector('.name')
const nameForm = document.querySelector('.name form')

const chatContainer = document.querySelector('.chat')
const chat = document.querySelector('.chat ul')
const chatForm = document.querySelector('.chat form')

const weekday = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const currentTime = () => {
  const date = new Date(Date.now())
  const hour = date.getHours()
  const minute = date.getMinutes()

  return `${hour < 10 ? `0${hour}` : hour}:${
    minute < 10 ? `0${minute}` : minute
  }`
}

socket.on('initial_enter_room', () => {
  const chatBlock = document.createElement('li')
  const time = document.createElement('div')
  time.className = 'time'

  const date = new Date(Date.now())
  time.textContent = `${date.getFullYear()}.${
    date.getMonth() + 1
  }.${date.getDate()} ${weekday[date.getDay()]}`

  chatBlock.appendChild(time)
  chat.appendChild(chatBlock)
})

socket.on('enter_room', (name) => {
  const wrapper = document.createElement('li')
  const inform = document.createElement('div')
  inform.className = 'inform'
  inform.textContent = `${name} entered the room`

  wrapper.appendChild(inform)
  chat.appendChild(wrapper)
  chat.scrollTo(0, chat.scrollHeight)
})

socket.on('receive_message', (msg, name) => {
  const chatBlock = document.createElement('li')
  const chatName = document.createElement('div')
  const wrapper = document.createElement('div')
  const message = document.createElement('span')
  const timeStamp = document.createElement('span')

  chatBlock.classList.add('other')
  wrapper.classList.add('wrapper')
  chatName.classList.add('chatName')
  message.classList.add('message')
  timeStamp.classList.add('timestamp')

  chatName.textContent = name
  message.textContent = msg
  timeStamp.textContent = currentTime()

  wrapper.append(message, timeStamp)
  chatBlock.append(chatName, wrapper)
  chat.appendChild(chatBlock)
  chat.scrollTo(0, chat.scrollHeight)
})

socket.on('leave_room', (name) => {
  const chatBlock = document.createElement('li')
  const inform = document.createElement('div')
  inform.className = 'inform'
  inform.textContent = `${name} leaved the room`

  chatBlock.appendChild(inform)
  chat.appendChild(chatBlock)
  chat.scrollTo(0, chat.scrollHeight)
})

nameForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const input = document.querySelector('.name input')
  socket.emit('name', input.value)
  socket.emit('enter_room')
  nameContainer.hidden = true
  chatContainer.hidden = false
})

chatForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const input = document.querySelector('.chat input')
  socket.emit('send_message', input.value)

  const chatBlock = document.createElement('li')
  const message = document.createElement('span')
  const timeStamp = document.createElement('span')

  chatBlock.classList.add('me')
  message.classList.add('message')
  timeStamp.classList.add('timestamp')

  message.textContent = input.value
  timeStamp.textContent = currentTime()

  chatBlock.append(timeStamp, message)
  chat.appendChild(chatBlock)
  chat.scrollTo(0, chat.scrollHeight)

  input.value = ''
})
