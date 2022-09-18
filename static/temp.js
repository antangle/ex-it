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

let localStream
function listen() {
    peer.on('call', (call) => {
        navigator.getUserMedia({
            audio: true,
            video: false
        }, (stream) => {
            if(!localStream) localStream = stream

            call.answer()
            call.on('stream', (remoteStream) => {
                const video = document.createElement('video');
                video.srcObject = remoteStream

                video.addEventListener('loadedmetadata', () => {
                        video.play();
                    });

                remoteVideo.append(video)

            })

        })

    })
}

function startCall(otherUserId) {
    navigator.getUserMedia({
        audio: true,
        video: false
    }, (stream) => {
        if(!localStream) localStream = stream

        const call = peer.call(otherUserId, localStream)
        call.on('stream', (remoteStream) => {
            const video = document.createElement('video');
            video.srcObject = remoteStream

            video.addEventListener('loadedmetadata', () => {
                    video.play();
                });

            remoteVideo.append(video)
        })

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
    if (b == "true") {
        localStream.getAudioTracks().forEach(track => track.enabled = true);
    } else {
        localStream.getAudioTracks().forEach(track => track.enabled = false);
    }
}