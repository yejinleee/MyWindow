const todoForm = document.querySelector("#todo_form");
const todoList = document.querySelector("#todo_list")
const todoInput = document.querySelector("#todo_form input")
const todoTagInput = document.querySelector("#tag_select")
let todos = [];
const TODOS_KEY = "todos"

function submitTodo(){


}
function saveTodos(){
  localStorage.setItem(TODOS_KEY,JSON.stringify(todos));
  // JSON.stringify : object나array나 어떤코드든 stirng 형으로 바꿔줌
  // JSON.parse : string을 object 로 (Ex)JSON.parse(["1,2,3]")  -->> [1,2,3]

}

// function 필터함수(item){T/F로 반환할 조건과 return}
// 적용할Array.filter(필터함수)


function deleteTodo(e){
  // console.log(e.target.parentNode);
  const li = e.target.parentNode;
  console.dir(e.target.parentNode.firstChild);

  todos = todos.filter(eachTodo => {return eachTodo.id!==parseInt(li.id)});
  saveTodos();
  li.remove();
}

function drawLineDone(e){
  const li = e.target.parentNode;
  if (li.style.textDecoration === "line-through"){
    li.style.textDecoration = "";
    console.dir(li);
    console.log(todos,'zxzx');
    todos.forEach((eachTodo) => {
      if (eachTodo.id ===parseInt(li.id)){
        eachTodo.done = 0;
      }
    })
    localStorage.setItem(TODOS_KEY,JSON.stringify(todos));
  }
  else{
    li.style.textDecoration = "line-through";
    console.dir(li);
    todos.forEach((eachTodo) => {
      if (eachTodo.id ===parseInt(li.id)){
        eachTodo.done = 1;
      }
    })
    localStorage.setItem(TODOS_KEY,JSON.stringify(todos));
  }
}
function paintTodo(newTodo){
  const li = document.createElement("li");
  li.id = newTodo.id;
  if(newTodo.done){
    li.style.textDecoration = "line-through";
  }
  const span_tag = document.createElement("span");
  const span_text = document.createElement("span");
  const button_check = document.createElement("button");
  button_check.innerText="✅";
  button_check.className="todoButton";
  button_check.addEventListener("click",drawLineDone);
  const button_delete = document.createElement("button");
  button_delete.innerText="❎";
  button_delete.addEventListener("click",deleteTodo);
  button_delete.className = "todoButton";
  span_text.innerText = newTodo.text;
  span_tag.innerText = newTodo.tag;
  li.append(span_tag," - ",span_text,button_check,button_delete);
  //각각 .appendChild로 추가할 수 도 있음. appendChild는 DOM 함수
  // append는 JS함수. 노드뿐아니라 문자열도 추가 가능.
  todoList.appendChild(li);
}

function handleTodoSubmit(event){
  event.preventDefault();
  const newTodo = todoInput.value;
  const newTodoTag = todoTagInput.value;
  todoInput.value = "";
  todoTagInput.value="";
  // todos.push(newTodo); //text로 저장. object형으로 저장하고싶다면?
  let newTodoObject = {
    id : Date.now(),
    text : newTodo,
    tag : newTodoTag,
    done : 0,
  }
  todos.push(newTodoObject);
  paintTodo(newTodoObject);
  saveTodos();


}
todoForm.addEventListener("submit",handleTodoSubmit);

const savedTodos = localStorage.getItem(TODOS_KEY); //string
// console.log(savedTodos, typeof(savedTodos))
if (savedTodos !==null){
  const parsedTodos = JSON.parse(savedTodos); //object
  // console.log(parsedTodos, typeof(parsedTodos))

  todos = parsedTodos;
  // parsedTodos.forEach((e)=>{console.log("this is the turn of ",e);}));
  parsedTodos.forEach(paintTodo);
}




//
