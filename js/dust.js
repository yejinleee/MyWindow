// 위도경도 -> tm 좌표

const API_TRAD = "https://sgisapi.kostat.go.kr/OpenAPI3/transformation/transcoord.json";
const WGS84 = 4326;
const GRS80 = 5181;

let posX;
let posY;
const something = document.querySelector("#something");

const accessToken ='fd1cc5e3-eb7e-4be8-8d24-0aadf45957f8';
const latitude ='36.343492';
const longitude = '127.392925';

function fetchCrdTms(callback) {
    let url = `${API_TRAD}?accessToken=${accessToken}&src=${WGS84}&dst=${GRS80}&posX=${longitude}&posY=${latitude}`;
    fetch(url)
        .then(res => res.json())
        .then(json => {
            console.log(json);
            posX = json.result.posX;
            posY = json.result.posY;
            printit(posX,posY);
            console.log("3")
            console.log("4posX", posX);
        })
    console.log("1")

}

function callbackFunc(data){


}
fetchCrdTms(callbackFunc);
console.log('2',posX);

/////
// function getTitle(callback){
//     var text = "";
//     fetch("https://jsonplaceholder.typicode.com/posts")
//         .then(res => res.json())
//         .then(json => callback(json));
// }
//
// function callBackFunc(data){
//     text = data;
//     console.log(text);
// }
//
// getTitle(callBackFunc);

function printit(x,y){
    console.log("x",x);
    console.log("y",y);
}


// function fetchCrdTms() {
//     let url = `${API_TRAD}?accessToken=${accessToken}&src=${WGS84}&dst=${GRS80}&posX=${longitude}&posY=${latitude}`;
//     fetch(url)
//         .then(response => response.json())
//         .then(data =>{
//             console.log("fetch Result");
//             console.log(data.result);
//             posX = data.result.posX;
//             console.log("posX", posX);
//
//             something.innerText = posX;
//         })
//         .catch(error=>{
//             console.log("error ",error);
//             posY = data.result.posY;
//         })
// }
// fetchCrdTms('16350853-7195-48cb-9cf9-57b2be885c63','36.343492','127.392925');

let stationName ;
// 측정소명 찾기
const stationURL = "http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList";
const tmX = '127.392925' ;
const tmY =  '127.392925' ;
// console.log(posX,posY,'d');
const serviceKey = "suqfuud%2FdvIUrDJaYWFbsvbnB92sU%2BPo%2FYIxjmafqyyWlq4bB1dV2ekrT%2FGoBfBq6O9DmKmS607w3J7xneZo3Q%3D%3D";
function getStationName(tmX,tmY){
    let url = `https://cors-anywhere.herokuapp.com/${stationURL}?tmX=${tmX}&tmY=${tmY}&returnType=json&serviceKey=${serviceKey}`;
    console.log(url);
    fetch(url)
        .then(response => response.json())
        .then(data =>{
            console.log("Result");
            console.log(data.response.body.items[0].stationName);
            stationName = data.response.body.items[0].stationName;
            getAirCondition(stationName);
        })
        .catch(error=>{
            console.log("error ",error);
        })
}
getStationName(tmX,tmY);

const airApiURL= 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=';
function getAirCondition(stationName){
    let url = `https://cors-anywhere.herokuapp.com/${airApiURL}${stationName}&dataTerm=month&pageNo=1&numOfRows=100&returnType=json&serviceKey=${serviceKey}`;

    console.log(url);
    fetch(url)
        .then(response => response.json())
        .then(data =>{
            const airNow = data.response.body.items[0];
            console.log(data.response.body.items)
            console.log('오늘 미먼10농도:',airNow.pm10Value);
            //pm10Value 미먼10농도 pm25Value
            //pm10Grade 미먼10 24시간등급 pm25Grade
        })
}



//위치
const API_KEY = "f46786747f1df8b62a2a094619d604a4";
function onGeoOk(position) {
    console.log("성공",position);
}
function onGeoError(){
    alert("Can't find you")
}

navigator.geolocation.watchPosition(onGeoOk('a'),onGeoError);
