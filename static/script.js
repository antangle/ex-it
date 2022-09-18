var localVideo = document.getElementById('local-video');
var remoteVideo = document.getElementById('remote-video');

//init socket & peer
let HOST = devmode == 'dev' ? 'localhost' : 'ex-it.app';
let url = `https://${HOST}:${websocketPort}`;
let socket = io(url, {transports:['websocket', 'polling']});
let peer;


let audioConstraints;
if (window.chrome) {
    audioConstraints = {
        mandatory: {
            echoCancellation: true
        }
    }
} else {
    audioConstraints = {
        echoCancellation: true
    }
}

//prevent race condition of getUserMedia and peerjs with async-await
const initStream = async () => {
    let mediaStream;
    
    try {
        mediaStream = await navigator.mediaDevices
            .getUserMedia({
            audioConstraints: audioConstraints,
            video: true, 
            audio: true
        });
    } catch(err) {
        console.log(err);
    }
    //to prevent feedback sounds
    const noAudioStream = new MediaStream(mediaStream.getVideoTracks());
    const myVideo = document.createElement('video');
    addVideoStream(myVideo, noAudioStream, localVideo);

    peer = new Peer();

    peer.on('open', peerId => {
        console.log(`peer open with id: ${peerId}`);
        const data = {
            roomname: roomname,
            peerId: peerId,
            nickname: 'mynickname'
        }
        socket.emit('join-room', data);
    });

    //if new user connects to socket with roomname, new user's peerId is given. call other peers with that id with mediaStream
    socket.on('peer-connected', (data) => {
        const destPeerId = data.peerId;
        const destNickname = data.nickname;
        console.log(`peer-connected! : ${destNickname}`, destPeerId);
        const video = document.createElement('video');
        
        //if new user connects, call that user with peerjs with userId.
        const dataConnection = peer.call(destPeerId, mediaStream);
        //when newUser answers with newUserVideoStream, add that video. 
        dataConnection.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream, remoteVideo);
        });
    });
    
    //peerjs answering call from origin user
    peer.on('call', dataConnection => {
        dataConnection.answer(mediaStream);
        const video = document.createElement('video');
        
        dataConnection.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream, remoteVideo);
        });
    });
} 

initStream();

//peerjs setting userid when connection opens

//functions
const connectToNewUser = (newUserId, stream) => {
    console.log('connectToNewUser');

    const dataConnection = peer.call(newUserId, stream);
    const video = document.createElement('video');

    dataConnection.on('stream', userVideoStream => {
        console.log('here!!');
        addVideoStream(video, userVideoStream, remoteVideo);
    });
}
function muteCam(b) {
    localStream.getVideoTracks().forEach(track => track.enabled = b);
  }
const addVideoStream = (video, stream, position) => {

    let audio = new Audio();
    audio.muted = true;
    audio.srcObject = stream;
    audio.addEventListener('canplaythrough', () => {
        audio = null;
    });

    console.log(stream);
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    position.append(video);
}


//chat
let msg = $('input');

$('html').keydown((e) => {
    if(e.which == 13 && msg.val().length !== 0) {
        const data = {
            roomId: roomId,
            msg: msg.val()
        }
        socket.emit('message', data);
        msg.val('');
    }
})

socket.on('createMessage', message => {
    console.log('message coming from server', message);
});