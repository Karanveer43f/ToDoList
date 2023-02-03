let tasks = [];
const tasksList = document.getElementById("list");
const addTaskInput = document.getElementById("add");
const tasksCounter = document.getElementById("tasks-counter");
const checkBoxes = document.getElementsByClassName("custom-checkbox");

console.log("Working");

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function fetchToDos() {
  // fetch("https://jsonplaceholder.typicode.com/todos")
  //   .then(function (response) {
  //     // console.log(response);
  //     return response.json();
  //   })
  //   .then(function (data) {
  //     let m = getRndInteger(0, 190);
  //     let n = getRndInteger(m, 199);
  //     tasks = data.slice(m, n);
  //     renderList();
  //   })
  //   .catch(function (error) {
  //     console.log("error" + error);
  //   });
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await response.json();
    let m = getRndInteger(0, 190);
    let n = getRndInteger(m, 199);
    tasks = data.slice(m, n);
    renderList();
  } catch (error) {
    console.lof(error);
  }
}

function addTaskToDOM(task) {
  let li = document.createElement("li");

  li.innerHTML = `
  <input type="checkbox" id= "${task.id}" class="custom-checkbox" ${
    task.completed ? "checked" : ""
  } >
  <label for="${task.id}">${task.title}</label>
  <img src="bin.svg" class="delete" data-id="${task.id}" />
  `;

  tasksList.append(li);
}

function renderList() {
  // 1-> set taskList.innerHtml = ''
  // 2-> A loop that traverses the tasks array and call addTaskToDOM() on every task
  // 3-> update the task counter

  tasksList.innerHTML = "";
  // let n = tasks.length;
  for (let i = 0; i < tasks.length; i++) {
    addTaskToDOM(tasks[i]);
  }

  tasksCounter.innerHTML = tasks.length;
}

function toggleTask(taskId) {
  for (let i of tasks) {
    if (i.id == taskId) {
      i.completed = !i.completed;
      renderList();
      showNotification("Task completion status toggled!");
    }
  }
}

function deleteTask(taskId) {
  if (!taskId) {
    showNotification("Task doesn't exist");
    return;
  }
  let newTasks = [];

  for (let i of tasks) {
    if (i.id != taskId) {
      newTasks.push(i);
    }
  }

  tasks = newTasks;

  renderList();
  // showNotification("Task deleted!");
}

function addTask(task) {
  if (!task) {
    showNotification("Task could not be added");
  }

  tasks.push(task);
  renderList();
  showNotification("Task added!");
  return;
}

function showNotification(title) {
  window.alert(title);
}

function handleInputKeypress(e) {
  if (e.key == "Enter") {
    const title = e.target.value;

    if (!title) {
      showNotification("The task can not be empty");
    }

    const task = {
      title: title,
      completed: false,
      id: Date.now().toString(),
    };

    e.target.value = "";

    addTask(task);
  }
}

function handleClickEvent(e) {
  const target = e.target;

  for (let i of tasks) {
    if (target.id == i.id) {
      toggleTask(i.id);
    }

    if (target.className == "delete" && target.dataset.id == i.id) {
      deleteTask(i.id);
    }
  }
}

function initializeApp() {
  fetchToDos();
  addTaskInput.addEventListener("keyup", handleInputKeypress);
  document.addEventListener("click", handleClickEvent);
}

initializeApp();
