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
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var database = firebase.database();
const peer = (window.peer = new Peer({
  key: window.__SKYWAY_KEY__,
  debug: 3,
}));
var intervalId;
var activePeers;
peer.once('open',() =>{
    //listActivePeer -> listDatabase -> inactivepeer=null
    alert("opened");
    intervalId = window.setInterval( () => {
        peer.listAllPeers((peers) => {
                activePeers = peers;
            });
        database.ref('/peers').once('value').then((snapshot) => {
            alert(JSON.stringify(snapshot));
//            for key in snapshot.key():
//                for activePeer in activePeers:
//                    if(key!==activePeer){
//                        snapshot[key]=null;
//                        }
//            database.ref('/peers').update(snapshot);
            });
        },10000);
});

