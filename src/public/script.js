var localVideo = document.getElementById('local-video');
var remoteVideo = document.getElementById('remote-video');

//init socket & peer
let HOST = devmode == 'DEVELOPMENT' ? 'localhost' : 'antangle.tk';
let PORT = 3001;
let url = `https://${HOST}:${PORT}`;
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
const initStream = async () => {
    let mediaStream 
    
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
    const videoOnlyStream = new MediaStream(mediaStream.getVideoTracks());

    const myVideo = document.createElement('video');
    addVideoStream(myVideo, videoOnlyStream, localVideo);
    
    peer = new Peer();
    
    peer.on('open', userId => {
        console.log('peer open');
        const data = {
            roomId: roomId,
            userId: userId
        }
        socket.emit('join-room', data);
    });
    
    //after join-room, server responses with 'user-connected'
    socket.on('user-connected', (newUserId) => {
        console.log('user-connected!', newUserId);
        const video = document.createElement('video');
        
        //if new user connects, call that user with peerjs with userId.
        const dataConnection = peer.call(newUserId, mediaStream);
        //when newUser answers with newUserVideoStream, add that video. 
        dataConnection.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream, remoteVideo);
        });
    });
    
    //peerjs answering call from original user
    peer.on('call', dataConnection => {
        console.log('answer');
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