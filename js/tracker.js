const tracker_div = document.querySelector(".div_tracker");
const routineForm = document.querySelector("#routineForm");
const routineInput = routineForm.querySelector("input");

let routines =[];
const ROUTINES_KEY = "routines";

function saveRoutines(){
    localStorage.setItem(ROUTINES_KEY,JSON.stringify(routines));
}

function clickCircle(e,index){
    const svgs = e.target.parentNode.parentNode.childNodes; //NodeList: <svg>들
    for (let i=0;i<svgs.length;i++){
        if(svgs[i] === e.target.parentNode){
            if(routines[index].doing[i]===0){
                routines[index].doing[i]=1;
            }
            else{
                routines[index].doing[i]=0;
            }
            saveRoutines();
        }
    }

    const circle = e.target;
    if (circle.classList.contains("unfilledCircle")){
        circle.classList.add("filledCircle");
        circle.classList.remove("unfilledCircle");
    }
    else{
        circle.classList.remove("filledCircle");
        circle.classList.add("unfilledCircle");
    }
}

function makeCircle(circlesSpan,index){
    routines[index].doing.push(0);
    saveRoutines();
    makeUnfilled(circlesSpan,index);
}
function makeUnfilled(circlesSpan,index){
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("height","16");
    svg.setAttribute("width","16");
    svg.style.marginRight="5px";
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx","8");
    circle.setAttribute("cy","8");
    circle.setAttribute("r","7");
    circle.setAttribute("fill","white");
    circle.setAttribute("stroke","black");
    circle.classList.add("unfilledCircle");
    circle.addEventListener("click",function(e){
        clickCircle(e,index)})
    svg.append(circle);
    circlesSpan.append(svg);
}

function makeFilled(circlesSpan,index){
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("height","16");
    svg.setAttribute("width","16");
    svg.style.marginRight="5px";
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx","8");
    circle.setAttribute("cy","8");
    circle.setAttribute("r","7");
    circle.setAttribute("fill","white");
    circle.setAttribute("stroke","black");
    circle.classList.add("filledCircle");
    circle.addEventListener("click",function(e){
        clickCircle(e,index)})
    svg.append(circle);
    circlesSpan.append(svg);
}
function deleteRoutine(e){
    const routineDiv = e.target.parentNode;
    routines = routines.filter((each)=>{
        return each.id !== parseInt(routineDiv.id);
    })
    saveRoutines();
    routineDiv.remove();
}
function makeRoutine(newRoutine){
    const routine_div = document.createElement("div");
    routine_div.className="routine_div";
    routine_div.id=newRoutine.id;
    const span = document.createElement("span");
    span.innerText=newRoutine.text;
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "❌";
    deleteButton.className ="deleteRoutineButton";
    const plusButton = document.createElement("button");
    plusButton.innerText = "➕";
    plusButton.className = "plusCircleButton";

    const circlesSpan = document.createElement("circlesSpan");


    let index;
    for (let i=0;i< routines.length;i++) {
        if (routines[i].id === newRoutine.id) {
            index = i;
            break;
        }
    }
    for (let i=0; i<newRoutine.doing.length;i++){
        if (newRoutine.doing[i]===0)
        {
            makeUnfilled(circlesSpan,index);
        }else{
            makeFilled(circlesSpan,index);
        }
    }
    routine_div.append(span,deleteButton,plusButton,circlesSpan);

    plusButton.addEventListener("click",function(){makeCircle(circlesSpan,index);});
    deleteButton.addEventListener("click",deleteRoutine);

    tracker_div.append(routine_div);
}
function handleRoutineSubmit(event){
    event.preventDefault();
    const newRoutine = routineInput.value;
    routineInput.value="";
    let newRoutineObject = {
        id : Date.now(),
        text : newRoutine,
        doing :[],
    }
    routines.push(newRoutineObject);
    saveRoutines();
    makeRoutine(newRoutineObject);
}
routineForm.addEventListener("submit",handleRoutineSubmit);

const savedRoutines = localStorage.getItem(ROUTINES_KEY); //string
if (savedRoutines !==null){
    const parsedRoutines = JSON.parse(savedRoutines); //object
    routines = parsedRoutines;
    parsedRoutines.forEach(makeRoutine);
}