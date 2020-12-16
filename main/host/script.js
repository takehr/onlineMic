// SKYWAY API KEY
window.__SKYWAY_KEY__ = '72be30ae-eee3-402e-a9a5-ee2dfbf5754a';
//FIREBASE SETUP
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
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var database = firebase.database();
$("#exampleModalCenter").modal({
    keyboard:false,
    backdrop:'static',
    show:true
});

var roomId=null;
const btnPlay = document.getElementById('btnPlay');
const remoteVideos = document.getElementById('js-remote-streams');


function geoFindMe(){
    function success(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        database.ref('/peers').once('value').then((snapshot) => {
            snapshot=snapshot.val();
            if(snapshot){
            Object.keys(snapshot).forEach(key => {
                const squareDistance = (snapshot[key].x-longitude)**2+(snapshot[key].y-latitude)**2;
                //radius of 50m or less
                if(squareDistance<=0.00000025)roomId=snapshot[key].roomId;
            });
            }
        }).then(() => {
                $("#exampleModalCenter").modal("hide");
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
                  stream: null,
                });
                const localVideo = document.getElementById('js-local-stream');
                room.on('stream', async stream => {
                  //console.log("stream open");
                  //localVideo.srcObject = stream;
                  //localVideo.playsInline = true;
                  //btnPlay.onclick = () => localVideo.play();
//                  await localVideo.play().catch(() => {
//                      alert("error");
//                      //console.error;
//                  });
                  const newVideo = document.createElement('video');
                  newVideo.srcObject = stream;
                  newVideo.playsInline = true;
                  // mark peerId to find it later at peerLeave event
                  newVideo.setAttribute('data-peer-id', stream.peerId);
                  remoteVideos.append(newVideo);
                  await newVideo.play().catch(console.error);
                  //android-chrome用
                  btnPlay.onclick = () => newVideo.play();
                });
            });
    }
    function error(error){
        alert(error.message);
    }
    if(!navigator.geolocation){
        alert("It seems that geolocation is not available in your browser.");
    }else{
        navigator.geolocation.getCurrentPosition(success,error);
    }
}

(async function main() {
  const peer = (window.peer = new Peer({
    key: window.__SKYWAY_KEY__,
    debug: 3,
  }));

  peer.on('open',() =>{
    geoFindMe();
  });

  peer.on('error', console.error);
})();
