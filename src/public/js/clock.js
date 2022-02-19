const clock = document.querySelector("#clock")
function getClock(){
  const date = new Date();
  const hours = String(date.getHours()).padStart(2,"0");
  const minutes = String(date.getMinutes()).padStart(2,"0");
  const seconds = String(date.getSeconds()).padStart(2,"0");
  clock.innerText = `${hours} : ${minutes} : ${seconds}`;
}
getClock();
setInterval(getClock,1000);

const date_today = document.querySelector("#date");
function getDate(){
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth()+1).padStart(2,"0");
  const today = String(date.getDate()).padStart(2,"0")
  const day = date.getDay();
  const dayarray = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  date_today.innerText = `${year}년 ${month}월 ${today}일 ${dayarray[day]}`
}
getDate();




//-------------------------------------------------
// Interval : 매번 일어나야 하는 것  -->setInterval(발생할함수,초(ms))
// setInterval(sayHello,5000);

// 일정시간이 지난 후에 함수를 한번만! 실행하고 싶을 때
// setTimeout(sayHello,4000);

// function sayHello(){
//   console.log("Hello");
// }
