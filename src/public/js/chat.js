const socket = io();

const welcome = document.querySelector("#welcome")
const form = welcome.querySelector("form");
const room = document.querySelector("#room");

room.hidden=true;

let nickname = 'annonymous';
function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li")
    li.innerText = message;
    ul.appendChild(li);
}
function handleNicknameSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#nickname input");
    const value = input.value;
    socket.emit("nicknameSave", value);
    nickname = input.value;
    const nickForm = room.querySelector("#nickname");
    nickForm.hidden = true;
    const h4 = room.querySelector("h4");
    h4.innerText=`Hi! ${nickname}`;
}
function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#message input");
    const value = input.value;
    socket.emit("new_message", value, roomname, ()=>{ //어느방인지도 알려줘야해서 roomName도 보내야함  //백으로 보냄
        addMessage(`${nickname} :  ${value}`)
    });
    input.value="";
}
let roomname;
function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room : ${roomname}`;
    const nicknameForm = room.querySelector("#nickname");
    const messageForm = room.querySelector("#message");
    nicknameForm.addEventListener("submit",handleNicknameSubmit);
    messageForm.addEventListener("submit",handleMessageSubmit);
}
function handleRoomSubmit(event){
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    event.preventDefault();
    console.log(event.value);
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom); 
    roomname = input.value;
    input.value = "";
}
form.addEventListener("submit",handleRoomSubmit);


socket.on("welcome",(user,newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room : ${roomname} (${newCount})`;
    addMessage(`${user} arrived!`)
});
socket.on("bye",(userLeft, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room : ${roomname} (${newCount})`;
    addMessage(`${userLeft} left...`)
});
socket.on("new_message", addMessage);

// socket.on("room_change",console.log); //(msg)=>{console.log(msg)} 랑 같은거
socket.on("room_change", (rooms ) =>{
    // 근데이제 이게 실행됐을때 rooms가 비어있는 값이면 그전 값을 바꾸진 않음
    // 그래서 확인 필요!
    if (rooms.length ===0){
        return
    }
    const roomList = welcome.querySelector("ul");
    roomList.innerText=""; //항상 다 비웠다가 시작
    rooms.forEach( (room) =>{
        const li = document.createElement("ll");
        li.innerText= room;
        roomList.append(li);
    })
});