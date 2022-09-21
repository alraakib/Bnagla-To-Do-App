let newTaskBtn = document.getElementById("newTask");
let addTaskBtn = document.getElementById("addTask");
let overlay = document.querySelector(".overlay");
let incompleteDiv = document.querySelector(".incomplete");
let completeDiv = document.querySelector(".complete");
let taskName = document.getElementById("taskName");
let taskDesc = document.getElementById("taskDesc");
let taskTime = document.getElementById("taskTime");
let data;

window.onload = async () => {
  if (localStorage.getItem("data")) {
    data = await JSON.parse(localStorage.getItem("data"));
    for (let index in data.incomplete) {
      createTask(
        0,
        decodeURI(data.incomplete[index].taskname),
        decodeURI(data.incomplete[index].taskdesc),
        decodeURI(data.incomplete[index].tasktime),
        false
      );
      index++;
    }
    for (let index in data.complete) {
      createTask(
        1,
        decodeURI(data.complete[index].taskname),
        decodeURI(data.complete[index].taskdesc),
        decodeURI(data.complete[index].tasktime),
        false
      );
      index++;
    }
  } else {
    localStorage.setItem("data", '{"incomplete": [], "complete": []}');
    data = await JSON.parse(localStorage.getItem("data"));
  }
};

function resetInputs() {
  taskName.value = "";
  taskDesc.value = "";
  taskTime.value = "";
}

function showOverlay(visible) {
  if (visible) {
    overlay.style.animation = "visible .3s ease-in-out forwards";
  } else {
    overlay.style.animation = "hidden .3s ease-in-out";
    resetInputs();
  }
}

function deleteTask(node) {
  for (
    let index = 0;
    index < document.querySelectorAll(".deleteBtn").length;
    index++
  ) {
    if (node.isSameNode(document.querySelectorAll(".deleteBtn")[index])) {
      data.complete.splice(index, 1);
      localStorage.setItem("data", JSON.stringify(data));
      node.closest(".task").remove();
      if (document.querySelectorAll(".deleteBtn").length == 0) {
        completeDiv.style.display = "none";
      }
      break;
    }
  }
}

function completeTask(node) {
  for (
    let index = 0;
    index < document.querySelectorAll(".completeBtn").length;
    index++
  ) {
    if (node.isSameNode(document.querySelectorAll(".completeBtn")[index])) {
      createTask(
        1,
        decodeURI(data.incomplete[index].taskname),
        decodeURI(data.incomplete[index].taskdesc),
        decodeURI(data.incomplete[index].tasktime),
        true
      );
      data.incomplete.splice(index, 1);
      localStorage.setItem("data", JSON.stringify(data));
      node.closest(".task").remove();
      if (document.querySelectorAll(".completeBtn").length == 0) {
        incompleteDiv.style.display = "none";
      }
      break;
    }
  }
}

function createTask(id, name, desc, time, sync) {
  let task = document.createElement("div");
  let taskInfo = document.createElement("div");
  let title = document.createElement("h1");
  let subtitle = document.createElement("h2");
  let deadline = document.createElement("h3");
  let controlBtn = document.createElement("button");
  task.className = "task";
  taskInfo.className = "task-info";
  title.className = "title";
  subtitle.className = "subtitle";
  deadline.className = "deadline";
  controlBtn.classList.add("outlined");

  if (id === 0 && name != "" && desc != "" && time != "") {
    title.innerText = name;
    subtitle.innerText = desc;
    deadline.innerText = "সময়ঃ " + time;
    controlBtn.classList.add("completeBtn");
    controlBtn.innerText = "সমাপ্ত";
    controlBtn.addEventListener("click", (e) => {
      completeTask(e.target);
    });
    taskInfo.append(title, subtitle, deadline);
    task.append(taskInfo, controlBtn);
    incompleteDiv.appendChild(task);
    incompleteDiv.style.display = "flex";
    if (sync) {
      data.incomplete.push(
        JSON.parse(
          '{"taskname": "' +
          encodeURI(name) +
          '", "taskdesc": "' +
          encodeURI(desc) +
          '", "tasktime": "' +
          encodeURI(time) +
          '"}'
        )
      );
      localStorage.setItem("data", JSON.stringify(data));
    }
  } else if (id === 1 && name != "" && desc != "" && time != "") {
    title.innerText = name;
    subtitle.innerText = desc;
    deadline.innerText = "সময়ঃ " + time;
    controlBtn.classList.add("deleteBtn");
    controlBtn.innerText = "মুছুন";
    controlBtn.addEventListener("click", (e) => {
      deleteTask(e.target);
    });
    taskInfo.append(title, subtitle, deadline);
    task.append(taskInfo, controlBtn);
    completeDiv.appendChild(task);
    completeDiv.style.display = "flex";
    if (sync) {
      data.complete.push(
        JSON.parse(
          '{"taskname": "' +
          encodeURI(name) +
          '", "taskdesc": "' +
          encodeURI(desc) +
          '", "tasktime": "' +
          encodeURI(time) +
          '"}'
        )
      );
      localStorage.setItem("data", JSON.stringify(data));
    }
  }
}

newTaskBtn.addEventListener("click", () => {
  showOverlay(true);
});

overlay.addEventListener("mousedown", (element) => {
  if (element.target == element.currentTarget) {
    showOverlay(false);
  }
});

addTaskBtn.addEventListener("click", () => {
  if (taskName.value.trim() != '' && taskDesc.value.trim() != '' && taskTime.value.trim() != '') {
    createTask(0, taskName.value.trim(), taskDesc.value.trim(), taskTime.value.trim(), true);
    showOverlay(false);
  } else {
    alert('You can\'t add blank task');
    resetInputs();
  }
});
