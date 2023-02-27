const socket = io()

const nameContainer = document.querySelector('.name')
const nameForm = document.querySelector('.name form')

const videoChat = document.querySelector('.video-chat')
const myFace = document.querySelector('.video-chat .my-face')
const peerFace = document.querySelector('.video-chat .peer-face')

const videoBtn = document.querySelector('.video-chat .video-icon')
const micBtn = document.querySelector('.video-chat .mic-icon')

const configuration = {
  iceServers: [
    {
      urls: [
        'stun:stun2.l.google.com:19302',
        'stun:stun3.l.google.com:19302',
        'stun:stun4.l.google.com:19302',
      ],
    },
  ],
}
const peerConnection = new RTCPeerConnection(configuration)
const mediaNameSet = {}
let user
let streamId
let myStream
let peerStream
let videoOff = false
let mute = false

nameForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  const input = document.querySelector('.name input')
  user = input.value
  const myName = document.querySelector('.me h1')
  myName.textContent = user
  socket.emit('name', input.value)

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })
    myStream = stream
    streamId = stream.id
    myFace.srcObject = stream
    mediaNameSet[stream.id] = input.value
    const tracks = stream.getTracks()
    tracks.map((track) => {
      peerConnection.addTrack(track, stream)
    })
    socket.emit('enter_room', streamId, user)
    nameContainer.hidden = true
  } catch (error) {
    console.error('Error accessing media devices.', error)
  }
})

socket.on('enter_room', async (_streamId, _user) => {
  mediaNameSet[_streamId] = _user
  socket.emit('send_info', streamId, user)

  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
  socket.emit('offer', offer)
  console.log('send offer!')
})

socket.on('update_users', (_streamId, _user) => {
  mediaNameSet[_streamId] = _user
})

socket.on('offer', async (offer) => {
  const remoteDesc = new RTCSessionDescription(offer)
  await peerConnection.setRemoteDescription(remoteDesc)
  const answer = await peerConnection.createAnswer()
  await peerConnection.setLocalDescription(answer)
  socket.emit('answer', answer)
  console.log('got offer and send answer!')
})

socket.on('answer', async (answer) => {
  const remoteDesc = new RTCSessionDescription(answer)
  await peerConnection.setRemoteDescription(remoteDesc)
  console.log('got answer!')
})

peerConnection.addEventListener('icecandidate', (event) => {
  if (event.candidate) {
    socket.emit('ice', event.candidate)
    console.log('send icecandidate')
  }
})

socket.on('ice', async (candidate) => {
  if (candidate) {
    try {
      await peerConnection.addIceCandidate(candidate)
      console.log('got ice')
    } catch (e) {
      console.error('Error adding received ice candidate', e)
    }
  }
})

peerConnection.addEventListener('connectionstatechange', (event) => {
  if (peerConnection.connectionState === 'connected') {
    // Peers connected!
    const peerName = document.querySelector('.peer h1')
    peerName.textContent = mediaNameSet[peerStream.id]
    peerFace.srcObject = peerStream
    videoChat.hidden = false
    console.log('connectionstatechange!', event)
  }
})

peerConnection.addEventListener('track', async (event) => {
  peerStream = event.streams[0]
})

videoBtn.addEventListener('click', () => {
  videoOff = !videoOff

  videoBtn.textContent = videoOff ? 'videocam_off' : 'videocam'
  myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled))
})

micBtn.addEventListener('click', () => {
  mute = !mute

  micBtn.textContent = mute ? 'mic_off' : 'mic'
  myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled))
})
