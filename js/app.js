"use strict";
function getHTML(s) {
  return document.querySelector(s);
}
const formCreate = getHTML("#form-create");
const formEdit = getHTML("#form-edit");
const listGroupTodo = getHTML("#list-group-todo");
const messageCreate = getHTML("#message-create");
const time = getHTML("#time");
const modal = getHTML("#modal");
const overlay = getHTML("#overlay");
const editClose = getHTML("#close");

// ... time

let editItemId;

// localStoragedan ma'lumot olish
let todos = JSON.parse(localStorage.getItem("list"))
  ? JSON.parse(localStorage.getItem("list"))
  : [];

//   Time
function getTime() {
  const now = new Date();

  //kun
  const date = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();

  // oy
  const month =
    now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;

  // yil
  const year = now.getFullYear();

  //  second
  const second =
    now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();

  // minut
  const minute =
    now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();

  //soat
  const hour = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();

  return `${date}.${month}.${year} ${hour}:${minute}:${second}`;
}

setInterval(() => {
  getTime();
}, 1000);

// Malumotlarni o'qish => Read
function showTodos() {
  const todos = JSON.parse(localStorage.getItem("list"));
  listGroupTodo.innerHTML = "";
  todos.map((item, index) => {
    listGroupTodo.innerHTML += `
        <li 
            ondblclick=(setComplated(${index})) 
            class="list-group-item d-flex justify-content-between ${
              item.complated ? "complated" : ""
            }">
          ${item.text}
          <div class="todo-icons">
            <span class="opacity-50 me-2">${item.time}</span>
            <img onclick=(editTodo(${index})) src="img/edit.svg" alt="edit icon" width="25" height="25" />
            <img onclick=(deleteTodo(${index})) src="img/delete.svg" alt="delete icon" width="25" height="25" />
          </div>
        </li>
      `;
  });
}

//Error message
function showError(where, message) {
  document.getElementById(where).textContent = message;

  setTimeout(() => {
    document.getElementById(where).textContent = "";
  }, 2500);
}

// Ma''lumot yaratish => Create
formCreate.addEventListener("submit", (e) => {
  e.preventDefault();

  const todoText = formCreate["input-create"].value.trim();
  formCreate.reset();

  if (todoText.length) {
    todos.push({ text: todoText, time: getTime(), complated: false });

    setTodos();
    showTodos();
  } else {
    showError("message-create", "Iltimos ma'lumot kiriting");
  }
});
showTodos();

// Malumotlarni saqlash
function setTodos() {
  localStorage.setItem("list", JSON.stringify(todos));
}

function setComplated(id) {
  const complatedTodos = todos.map((item, index) => {
    if (index === id) {
      return { ...item, complated: item.complated ? false : true };
    } else {
      return { ...item };
    }
  });

  todos = complatedTodos;

  setTodos();
  showTodos();
}

// Ma'lumotlarni
function deleteTodo(id) {
  const filterTodos = todos.filter((item, index) => {
    return index !== id;
  });

  todos = filterTodos;
  setTodos();
  showTodos();
}

// update  ma'lumotlarni taxrirlash
function editTodo(id) {
  editItemId = id;

  formEdit["input-edit"].value = todos[id].text;

  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function close() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

editClose.addEventListener("click", close);

window.addEventListener("keydown", (e) => {
  if (e.keyCode === 27) {
    close();
  }
});

formEdit.addEventListener("submit", (e) => {
  e.preventDefault();

  const editText = formEdit["input-edit"].value;

  if (editText.length) {
    todos.splice(editItemId, 1, {
      text: editText,
      time: getTime(),
      complated: false,
    });

    setTodos();
    showTodos();

    close();
  } else {
    showError("message-edit", "Iltimos ma'lumot kiriting");
  }
});
