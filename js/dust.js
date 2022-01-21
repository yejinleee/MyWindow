// // 위도 latitude 북남
// // 경도 longitude

// 좌표번환 accessToken 발급
const API_AUTH = "https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json";
const SERVICE_ID = "88e8869f18a648cfb882";
const SECURITY_KEY = "13c71c9a61e741dd8ef3";
function fetchAuth(latitude,longitude){
    const url = `${API_AUTH}?consumer_key=${SERVICE_ID}&consumer_secret=${SECURITY_KEY}`;
    fetch(url)
        .then(response => response.json())
        .then(data =>{
            console.log('fetchAuth 성공');
            let accessToken = data.result.accessToken;
            fetchCrdTms(accessToken,latitude,longitude);
        })
        .catch(error =>{
            console.log("error :", error);
        })
}

// 위도경도 -> tm 좌표
const API_TRAD = "https://sgisapi.kostat.go.kr/OpenAPI3/transformation/transcoord.json"; //TM전환Api
const WGS84 = 4326;
const GRS80 = 5181;
function fetchCrdTms(accessToken,latitude,longitude) {
    const url = `${API_TRAD}?accessToken=${accessToken}&src=${WGS84}&dst=${GRS80}&posX=${longitude}&posY=${latitude}`;
    fetch(url)
        .then(res => res.json())
        .then(json => {
            console.log("fetchCrdTms fetch 내부")
            console.log('tm좌표변환Api',json.result);
            const tmX = json.result.posX;
            const tmY = json.result.posY;
            getStationName(tmX,tmY);
        })
}

// 측정소명 찾기
const stationURL = "http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList";
const serviceKey = "suqfuud%2FdvIUrDJaYWFbsvbnB92sU%2BPo%2FYIxjmafqyyWlq4bB1dV2ekrT%2FGoBfBq6O9DmKmS607w3J7xneZo3Q%3D%3D";
function getStationName(tmX,tmY){
    const url = `https://cors-anywhere.herokuapp.com/${stationURL}?tmX=${tmX}&tmY=${tmY}&returnType=json&serviceKey=${serviceKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data =>{
            let stationName = data.response.body.items[0].stationName;
            console.log('getStationName fetch내부');
            console.log('stationName', stationName);
            getAirCondition(stationName);
        })
        .catch(error=>{
            console.log("error ",error);
        })
}

// 대기상태
const airApiURL= 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=';
function getAirCondition(stationName){
    const url = `https://cors-anywhere.herokuapp.com/${airApiURL}${stationName}&dataTerm=month&pageNo=1&numOfRows=100&returnType=json&serviceKey=${serviceKey}`;
    const dust = document.querySelector("#dust");
    fetch(url)
        .then(response => response.json())
        .then(data =>{
            console.log('getAirCondition fetch 내부')
            const airNow = data.response.body.items[0];
            console.log('오늘 미먼10농도:',airNow.pm10Value);
            //pm10Value 미먼10농도 pm25Value
            //pm10Grade 미먼10 24시간등급 pm25Grade
            dust.innerText = `오늘의 미먼 농도 : ${airNow.pm10Value}`;
        })
}



//위치
const API_KEY = "f46786747f1df8b62a2a094619d604a4";
function onGeoOk(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    console.log("you live in",lat,"",lon);
    fetchAuth(lat,lon);
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    fetch(url)
        .then((response) => response.json())
        .then ((data) => {
            console.log('onGeoOk fetch 내부')
            console.log(data.name, data.weather[0].main)
        });
}
function onGeoError(){
    alert("Can't find you")
}

navigator.geolocation.getCurrentPosition(onGeoOk,onGeoError);



//////////////////////////////////////////////////////////////////


// function getAuth(){
//     const url = `${API_AUTH}?consumer_key=${SERVICE_ID}&consumer_secret=${SECURITY_KEY}`;
//     const response = fetch(url);
//     return response.then(res => res.json());
// }
// async function fetchAuth(latitude,longitude) {
//     var data;
//     try {
//         data = await getAuth();
//         console.log('fetchAuth 성공');
//         console.log(data.result.accessToken);
//         // fetchCrdTms(accessToken,latitude,longitude);
//     }
//     catch(error){console.log("error",error);}
// }
//
//
// // 위도경도 -> tm 좌표
// function getTM(){
//     const url = `${API_TRAD}?accessToken=${accessToken}&src=${WGS84}&dst=${GRS80}&posX=${longitude}&posY=${latitude}`;
//     const response = fetch(url);
//     return response.then(res => res.json());
// }
//
// async function fetchCrdTms(accessToken,latitude,longitude) {
//     let data;
//     try{
//         const latitude = position.coords.latitude;
//         const longitude = position.coords.longitude;
//         console.log("you live in",latitude,"",longitude);
//         data = await getGeo(latitude,longitude);
//         console.log(data.name, data.weather[0].main);
//         fetchAuth(latitude,longitude);
//     }
//     catch(error){console.log("error",error);}
//     const url = `${API_TRAD}?accessToken=${accessToken}&src=${WGS84}&dst=${GRS80}&posX=${longitude}&posY=${latitude}`;
//     fetchAuth(latitude,longitude);
//     fetch(url)
//         .then(res => res.json())
//         .then(json => {
//             console.log("fetchCrdTms fetch() 내부")
//             console.log('tm좌표변환Api',json.result);
//             const tmX = json.result.posX;
//             const tmY = json.result.posY;
//             // getStationName(tmX,tmY);
//         })
//     console.log("fetchCrdTms fetch 외부")
// }
//
//
//
//
//
// function getGeo(latitude,longitude) {
//     const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
//     const response = fetch(url);
//     return response.then(res => res.json());
// }
// async function onGeoOk(position){
//     let data;
//     try{
//         const latitude = position.coords.latitude;
//         const longitude = position.coords.longitude;
//         console.log("you live in",latitude,"",longitude);
//         data = await getGeo(latitude,longitude);
//         console.log(data.name, data.weather[0].main);
//         fetchAuth(latitude,longitude);
//     }
//     catch(error){console.log("error",error);}
// }
// async function onGeoError() {
//     alert("Can't find you");
// }
// navigator.geolocation.getCurrentPosition(onGeoOk,onGeoError);