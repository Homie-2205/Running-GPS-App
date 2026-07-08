const socket=io();let pc=new RTCPeerConnection();let stream;
document.getElementById('start').onclick=async()=>{
stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
localVideo.srcObject=stream;stream.getTracks().forEach(t=>pc.addTrack(t,stream));
pc.ontrack=e=>remoteVideo.srcObject=e.streams[0];
pc.onicecandidate=e=>e.candidate&&socket.emit('candidate',e.candidate);
const offer=await pc.createOffer();await pc.setLocalDescription(offer);socket.emit('offer',offer);
};
socket.on('offer',async o=>{if(stream)return;stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
localVideo.srcObject=stream;stream.getTracks().forEach(t=>pc.addTrack(t,stream));
pc.ontrack=e=>remoteVideo.srcObject=e.streams[0];
await pc.setRemoteDescription(o);const ans=await pc.createAnswer();await pc.setLocalDescription(ans);socket.emit('answer',ans);});
socket.on('answer',a=>pc.setRemoteDescription(a));
socket.on('candidate',c=>pc.addIceCandidate(c));