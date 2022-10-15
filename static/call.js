let localVideo = document.getElementById("local-video")
let remoteVideo = document.getElementById("remote-video")

localVideo.style.opacity = 0
remoteVideo.style.opacity = 0

localVideo.onplaying = () => { localVideo.style.opacity = 1 }
remoteVideo.onplaying = () => { remoteVideo.style.opacity = 1 }

let peer
function init(userId) {
    peer = new Peer(userId)
    
    peer.on('open', () => {
        Android.onPeerConnected()
    })

    listen()
}

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
let localStream
function listen() {
    peer.on('call', (call) => {
        navigator.getUserMedia({
            audio: true,
            video: false,
            audioConstraints: audioConstraints
        }, (stream) => {
            if(!localStream) localStream = stream
            
            call.answer()
            call.on('stream', (remoteStream) => {
                const userType = call.metadata.type;
                const time = call.metadata.time;
                console.log(`listen userType: ${userType}`);
                console.log(`timediff: ${Date.now() - time}`)
                console.log(remoteStream);
                if(userType == 'HOST'){
                    localVideo.srcObject = remoteStream
                }
                else if (userType == 'SPEAKER'){
                    remoteVideo.srcObject = remoteStream
                }
            }, err => {

            })

        })

    })
}

function startCall(otherUserId, userType) {
    console.log(`startCall userType is: ${userType}`);
    navigator.getUserMedia({
        audio: true,
        video: false,
        audioConstraints: audioConstraints
    }, (stream) => {
        if(!localStream) localStream = stream

        const call = peer.call(otherUserId, localStream, {
            metadata: {
                "type": userType,
                "time": Date.now()
            }
        })
    })
}

function handlePeerDisconnect() {
    // manually close the peer connections
    for (let conns in peer.connections) {
        peer.connections[conns].forEach((conn, index, array) => {
        console.log(`closing ${conn.connectionId} peerConnection (${index + 1}/${array.length})`, conn.peerConnection);
        conn.peerConnection.close();
  
        // close it using peerjs methods
        if (conn.close)
          conn.close();
        });
    }
}

function disableStreams(){
    var videoElements = [localVideo, remoteVideo]
    videoElements.forEach(function(videoElement){
        const stream = videoElement.srcObject;
        if(stream != null){
            const tracks = stream.getTracks();
        
            tracks.forEach(function(track) {
                track.stop();
            });
        
            videoElement.srcObject = null;        
        }        
    })
}

function toggleVideo(b) {
    if (b == "true") {
        localStream.getVideoTracks()[0].enabled = true
    } else {
        localStream.getVideoTracks()[0].enabled = false
    }
} 

function toggleAudio(b) {
    console.log(JSON.stringify(localStream))
    if (b == "true") {
        localStream.getAudioTracks().forEach(track => track.enabled = true);
    } else {
        localStream.getAudioTracks().forEach(track => track.enabled = false);
    }
}