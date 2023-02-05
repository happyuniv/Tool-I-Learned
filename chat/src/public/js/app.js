const socket = io()

const chat = document.querySelector('.chat ul')
const chat_form = document.querySelector('.chat form')

const weekday = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

socket.on('initial_enter_room', () => {
  const time = document.createElement('div')
  time.className = 'time'
  const date = new Date(Date.now())
  time.textContent = `${date.getFullYear()}.${
    date.getMonth() + 1
  }.${date.getDate()} ${weekday[date.getDay()]}`

  chat.appendChild(time)
})
socket.on('enter_room', (nickName) => {
  const inform = document.createElement('div')
  inform.className = 'inform'
  inform.textContent = `${nickName} entered the room`

  chat.appendChild(inform)
})

socket.on('receive_message', (msg) => {
  const message = document.createElement('li')
  message.classList.add('message', 'other')
  message.textContent = msg

  chat.appendChild(message)
  chat.scrollTo(0, chat.scrollHeight)
})

socket.on('leave_room', (nickName) => {
  const inform = document.createElement('div')
  inform.className = 'inform'
  inform.textContent = `${nickName} leaved the room`

  chat.appendChild(inform)
})

chat_form.addEventListener('submit', (e) => {
  e.preventDefault()

  const input = document.querySelector('.chat input')
  socket.emit('send_message', input.value)

  const message = document.createElement('li')
  message.classList.add('message', 'me')
  message.textContent = input.value
  input.value = ''

  chat.appendChild(message)
  chat.scrollTo(0, chat.scrollHeight)
})
