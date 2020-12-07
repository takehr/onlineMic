const Peer = window.Peer;
window.__SKYWAY_KEY__ = '72be30ae-eee3-402e-a9a5-ee2dfbf5754a';

var firebaseConfig = {
  apiKey: "AIzaSyAr3bmBnVtDU23LujaK3st-lQ9y0g1JZ1w",
  authDomain: "onlinemicrophone.firebaseapp.com",
  databaseURL: "https://onlinemicrophone-default-rtdb.firebaseio.com",
  projectId: "onlinemicrophone",
  storageBucket: "onlinemicrophone.appspot.com",
  messagingSenderId: "160994145249",
  appId: "1:160994145249:web:1b13b910034de1a64f18a0",
  measurementId: "G-LLKEX976V6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var database = firebase.database();

//database.ref('/peers').remove();
//database.ref('/').update({peers:{a:"tikuwa",b:"asdf"}});

function geoFindMe(){
    alert("asdf");
    function success(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        database.ref("peers/"+window.peer.id).set({
            y: latitude,
            x: longitude,
            roomId: window.peer.id
        });
        alert(window.peer.id);
        alert(latitude+" "+longitude);
      }
    function error(error){
        alert(error.message);
    }
    if(!navigator.geolocation){
        alert("can't use");
    }else{
        navigator.geolocation.getCurrentPosition(success,error);
    }
}

(async function main() {
  const localVideo = document.getElementById('js-local-stream');
  const localStream = await navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: false,
    })
    .catch(console.error);
  //geoFindMe();
  localVideo.muted = true;
  localVideo.srcObject = localStream;
  localVideo.playsInline = true;
  await localVideo.play().catch(console.error);
  const peer = (window.peer = new Peer({
    key: window.__SKYWAY_KEY__,
    debug: 3,
  }));
  peer.on('open',() =>{
    alert(window.peer.id);
  });
  const room = peer.joinRoom(peer.id, {
    mode: 'sfu',
    stream: localStream,
  });
  peer.on('error', console.error);
})();
