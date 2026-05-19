const todoForm = document.querySelector("#todoForm");
const todoInput = document.querySelector("#todoInput");
const todoList = document.querySelector("#todoList");
const todoCount = document.querySelector("#todoCount");

let todos = [];

function updateTodoCount() {
  todoCount.textContent = `${todos.length}개 항목 남음`;
}

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = "todo-item";

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", `${todo.text} 삭제`);
    deleteButton.addEventListener("click", () => {
      todos = todos.filter((savedTodo) => savedTodo.id !== todo.id);
      renderTodos();
    });

    item.append(text, deleteButton);
    todoList.append(item);
  });

  updateTodoCount();
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const todoText = todoInput.value.trim();

  if (todoText === "") {
    todoInput.focus();
    return;
  }

  todos.push({
    id: Date.now(),
    text: todoText,
  });

  todoInput.value = "";
  todoInput.focus();
  renderTodos();
});

updateTodoCount();
