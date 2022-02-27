import express from "express";
import http from "http"; //node.js에 내장되어있어서 설치필요X 
// import {WebSocketServer} from "ws";
import {Server} from "socket.io";
// import {instrument} from "@socket.io/admin-ui";

const app = express();
const handleListen = ()=>console.log(`Listening on http://localhost:3000`)

const PORT = process.env.PORT
app.listen(PORT)


////

app.set('view engine',"pug");
app.set("views",__dirname + "/src/views");
app.use("/public", express.static(__dirname+ "/src/public"));
app.get("/",(req,res)=> res.render("home"));

////


//http 서버 
const server = http.createServer(app); //app.listen안해도 서버에 접근할 수 있게 서버 만듦.
// //ws서버
// const wss = new WebSocketServer({server }); 
// socketIO
const wsServer = new Server(server,{
    cors: {
      origin: ["https://admin.socket.io"],
      credentials: true
    }
  });
//   instrument(wsServer, {
//     auth: false
//   });
  
function publicRooms(){
    const {
        sockets: {
            adapter : {sids, rooms},
        },
    } = wsServer;

    const publicRooms = [];
    rooms.forEach((_,key) =>{
        if (sids.get(key) === undefined){
            publicRooms.push(key);
        }
    })
    return publicRooms;
}

function countRoom(roomName){
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) =>{
    socket["nickname"] = 'Annonymous';
    socket.onAny((event)=>{
        console.log('발생한 Socket Event : ',event);
    })
    wsServer.sockets.emit("room_change",publicRooms()); //방들어가기전부터 방명단 알도록

    socket.on("enter_room", (roomName,username,done) =>{
        socket["nickname"] = username;
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName)); 
        socket.emit("participants",countRoom(roomName));////모든방에보내려고그냥emit
        console.log(wsServer.sockets.adapter.rooms);
        wsServer.sockets.emit("room_change",publicRooms());
    })
    socket.on("disconnecting", ()=>{ //disconnecting : 서버와 연결이 끊어지기 직전에 발생시킴
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname, countRoom(room)-1 ));
        // 연결한 모든 방에 대해 bye라는  이벤트 보내는거
    })
    socket.on("disconnect", ()=>{ //연결 끊긴 후 발생
        wsServer.sockets.emit("room_change",publicRooms());
    })
    socket.on("new_message", ( msg, room, done)=>{
        socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`,'you'); //여기 new_message는 바로위 new_message랑 다른 지칭인데. 이렇게 같은 단어여도 된다는것
        done(); //실행은 프론트!
    })
    socket.on("nicknameSave", (nickname) => {
        socket["nickname"]=nickname;
    });
})

server.listen(3000,handleListen);