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
            snapshot=snapshot.val();
            _snapshot = Object.create(snapshot);
            Object.keys(snapshot).forEach(key => {
                snapshot[key]=null;
//                console.log(key);
            });
            activePeers.forEach(activePeer => {
                snapshot[activePeer]=_snapshot[activePeer];
            });
//                    if(key!=activePeer){
//                        snapshot[key]=null;
//                        }
            
//            console.log(JSON.parse(JSON.stringify(snapshot)));
            database.ref('/peers').update(JSON.parse(JSON.stringfy(snapshot)),error =>{
                console.log(error);
                });
//            database.ref('/peers').update({A3C9hpbQwHutacn6:null});
            });
        },10000);
});

//Uncaught (in promise) Error: Reference.update failed: First argument contains undefined in property 'peers.snapshot.5rzW2qDeTRBC1CWV'












