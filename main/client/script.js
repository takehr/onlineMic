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
var roomId=null;
var localStream;
let userPermission=true;
//const btnMute = document.getElementById('btn-mute');
//btnMute.onclick = () => {
//    localStream.getAudioTracks().forEach((track) => track.enabled=(!track.enabled) );
//};

$(function() {
  $('#toggle-mute').change(function() {
      localStream.getAudioTracks().forEach((track) => track.enabled=(!track.enabled) );
  })
})

$("#exampleModalCenter").modal({
    keyboard:false,
    backdrop:'static',
    show:true
});

function geoFindMe(){
    alert("asdf");
    function success(position) {
        if(userPermission)$("#exampleModalCenter").modal("hide");
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        database.ref('/peers').once('value').then((snapshot) => {
            snapshot=snapshot.val();
            if(snapshot){
            Object.keys(snapshot).forEach(key => {
                const squareDistance = (snapshot[key].x-longitude)**2+(snapshot[key].y-latitude)**2;
//                if(squareDistance<=0.00000025)roomId=snapshot[key].roomId;
// test したい　誤差
                if(squareDistance<=100.00000025)roomId=snapshot[key].roomId;
            });
            }
        }).then(() => {
                localStream.getAudioTracks().forEach((track) => track.enabled=(!track.enabled) );
                if(!roomId){
                    roomId=window.peer.id;
                    database.ref("peers/"+window.peer.id).set({
                        y: latitude,
                        x: longitude,
                        roomId: roomId
                    });
                } else {
                    database.ref("peers/"+window.peer.id).set({
                        y: latitude,
                        x: longitude,
                        roomId: roomId
                    });
                }
                const room = peer.joinRoom(roomId, {
                  mode: 'sfu',
                  stream: localStream,
                });
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
  localStream = await navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: false,
    })//.then(()=>userPermission=true)
  .catch(()=>{
      console.error;
      userPermission=false;
  });
  const peer = (window.peer = new Peer({
    key: window.__SKYWAY_KEY__,
    debug: 3,
  }));

  peer.on('open',() =>{
    geoFindMe();
  });
  peer.on('error', console.error);
})();
