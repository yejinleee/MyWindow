const todoForm = document.querySelector("#todo_form");
const todoList = document.querySelector("#todo_list")
const todoInput = document.querySelector("#todo_form input")
const todoTagInput = document.querySelector("#tag_select");
const progress = document.querySelector("#progress");

let todos = [];
const TODOS_KEY = "todos"
function saveTodos(){
  localStorage.setItem(TODOS_KEY,JSON.stringify(todos));
  // JSON.stringify : object나array나 어떤코드든 stirng 형으로 바꿔줌
  // JSON.parse : string을 object 로 (Ex)JSON.parse(["1,2,3]")  -->> [1,2,3]

}

// function 필터함수(item){T/F로 반환할 조건과 return}
// 적용할Array.filter(필터함수)

function howMuchDone(){
  let cnt=0;
  todos.forEach((eachTodo) => {
    if (eachTodo.done ===1){
      cnt=cnt +1;
    }
  })
  return cnt;
}

function changeProgress(){
  progress.value = (howMuchDone()/todos.length)*100;
  const progressPercent = document.querySelector("#progressPercent");
  progressPercent.innerText = `${Math.ceil(progress.value)}% 달성!`;
}
function deleteTodo(e){
  // console.log(e.target.parentNode);
  const li = e.target.parentNode;
  console.dir(e.target.parentNode.firstChild);

  todos = todos.filter(eachTodo => {return eachTodo.id!==parseInt(li.id)});
  saveTodos();
  li.remove();
  console.log(howMuchDone(),todos.length);
  // progress.value = (howMuchDone()/todos.length)*100;
  changeProgress();
}


function drawLineDone(e){
  const li = e.target.parentNode;
  if (li.style.textDecoration === "line-through"){ //완료눌러있던 투두면
    li.style.textDecoration = "";
    // console.dir(li);
    // console.log(todos,'zxzx');
    todos.forEach((eachTodo) => {
      if (eachTodo.id ===parseInt(li.id)){
        eachTodo.done = 0;
      }
    })
    localStorage.setItem(TODOS_KEY,JSON.stringify(todos));
    // progress.value = progress.value - (1/todos.length)*100;
    changeProgress();
  }
  else{ //완료하려는 투두면
    li.style.textDecoration = "line-through";
    // console.dir(li);
    todos.forEach((eachTodo) => {
      if (eachTodo.id ===parseInt(li.id)){
        eachTodo.done = 1;
      }
    })
    localStorage.setItem(TODOS_KEY,JSON.stringify(todos));
    // progress.value = progress.value + (1/todos.length)*100;
    changeProgress();
  }
}
function todoChange(event){
  todos.forEach((eachTodo) => {
    if (eachTodo.id ===parseInt(event.target.parentNode.id)){
      eachTodo.text = event.target.children.editInput.value;
      console.log("?");
      localStorage.setItem(TODOS_KEY,JSON.stringify(todos));
      return false;
    }
  })
}

function editTodo(e){
  const form = e.target.parentNode.children[2];
  const span = e.target.parentNode.children[1];
  const editInput = form.querySelector("#editInput");
  form.className = "";
  span.classList.add("hidden");
  form.style.display = "inline-block";
  console.log(form);
  console.log(editInput);
  form.addEventListener("submit",todoChange);
  // editTodo는 크레용누르면 input 뜨게하는거
  // change() 모이런함수만들어두고 "submit"으로 호출
  // 이함수 : 그리팅에서 onLoginSubmit처럼
}

function paintTodo(newTodo){
  const li = document.createElement("li");
  const progress = document.querySelector("#progress");
  li.id = newTodo.id;
  if(newTodo.done){
    li.style.textDecoration = "line-through";
    progress.value = progress.value+((1/todos.length)*100);
  }
  const span_tag = document.createElement("span");
  const span_text = document.createElement("span");
  const button_check = document.createElement("button");
  button_check.innerText="✅";
  button_check.className="todoButton";
  button_check.addEventListener("click",drawLineDone);
  const button_delete = document.createElement("button");
  button_delete.innerText="❎";
  button_delete.className = "todoButton";
  button_delete.addEventListener("click",deleteTodo);
  const button_edit = document.createElement("button");
  button_edit.innerText="🖍️";
  button_edit.className = "todoButton";
  button_edit.id = "buttonEdit";
  button_edit.addEventListener("click",editTodo);
  const input_form = document.createElement("form");
  input_form.id="editForm";
  input_form.classList.add("hidden");

  const input_edit = document.createElement("input");
  input_edit.id="editInput";

  input_form.append(input_edit);

  span_text.innerText = newTodo.text;
  span_tag.innerText = newTodo.tag;
  li.append(span_tag," - ",span_text,input_form,button_check,button_edit,button_delete);
  //각각 .appendChild로 추가할 수 도 있음. appendChild는 DOM 함수
  // append는 JS함수. 노드뿐아니라 문자열도 추가 가능.
  todoList.appendChild(li);
  progress.value = (howMuchDone()/todos.length)*100;
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
if (savedTodos !==null){
  const parsedTodos = JSON.parse(savedTodos); //object

  todos = parsedTodos;
  parsedTodos.forEach(paintTodo);
}

changeProgress();