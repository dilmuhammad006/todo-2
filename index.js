const tasksList = document.getElementById("tasks-list");
const form = document.getElementById("form");
const tab = document.getElementById("tab");
const searchInput = document.getElementById("searchInput");
const sortBtn = document.getElementById("sort-btn");
let searchValue = "";

const actionTypes = {
  get: "get",
  set: "set",
  clear: "clear",
};

let isArchivedTab = false;

const useLSTasks = (actionType, obj) => {
  if (actionType == actionTypes.get)
    return JSON.parse(localStorage.getItem("tasks"));
  if (actionType == actionTypes.set)
    localStorage.setItem("tasks", JSON.stringify(obj));

  if (actionType == actionTypes.clear) localStorage.clear();
};
let tasks = [
  {
    id: 1,
    title: "1",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi officia porro, quos mollitia iste maxime delectus, sint corporis quas quasi libero, natus ullam ad voluptatem placeat voluptatum sapiente praesentium ratione.",
    completed: false,
    isArchived: false,
  },
];

let lsTasks = useLSTasks(actionTypes.get);
lsTasks ? (tasks = lsTasks) : useLSTasks(actionTypes.set, tasks);

tab.addEventListener("click", (e) => {
  if (e.target.textContent === "Tasks") {
    isArchivedTab = false;
    e.target.parentElement.children[0].classList.add("bg-slate-600");
    e.target.parentElement.children[1].classList.remove("bg-slate-600");
  }

  if (e.target.textContent === "Archived") {
    isArchivedTab = true;
    e.target.parentElement.children[0].classList.remove("bg-slate-600");
    e.target.parentElement.children[1].classList.add("bg-slate-600");
  }

  writeToDoc();
});
function writeToDoc() {
  tasksList.innerHTML = "";

  let readyArray = tasks
    .filter((task) => (isArchivedTab ? task.isArchived : !task.isArchived))
    .filter(
      (task) =>
        task.title.toLowerCase().includes(searchValue) ||
        task.desc.toLowerCase().includes(searchValue)
    );
  if (!readyArray.length) {
    tasksList.innerHTML =
      '<p class="text-center text-slate-500 text-lg border py-2 rounded border-slate-400">Empty</p>';
    return;
  }

  sortBtn.addEventListener("click", () => {
    if (sortBtn.textContent != "Sorted") {
      readyArray = sortTasks(tasks);
      writeToDoc();
      sortBtn.textContent = "Sorted";
      return;
    } else {
      console.log("keldi");
      sortBtn.textContent = "Sort";
      writeToDoc();
    }
  });

  readyArray.forEach((task) => {
    tasksList.innerHTML += `
            <div class="border p-2 rounded border-slate-400">
                <p class="font-bold text-lg ${
                  task.completed ? "line-through" : ""
                }">${task.title}</p>
                <p class="text-sm text-slate-400 mb-2">${task.desc}</p>
                <button 
                    onclick="changeStatus(${task.id}, 'completed', 'true')"
                    ${task.completed ? "disabled" : ""} 
                    class="bg-slate-600 text-white px-2 py-1 rounded text-sm">
                        ${task.completed ? "Completed" : "Complete"}
                </button>
                <button 
                    onclick="deleteTask(${task.id})"
                    class="bg-red-400 text-white px-2 py-1 rounded text-sm">
                        Delete
                </button>

                  <button 
                    onclick="changeStatus(${task.id}, 'isArchived', ${
      task.isArchived ? "false" : "true"
    })"
                    class="bg-indigo-400 text-white px-2 py-1 rounded text-sm">
                        ${!task.isArchived ? "Archive" : "UnArchive"}
                </button>
            </div>
        `;
  });
}

writeToDoc();

form.addEventListener("submit", (e) => {
  e.preventDefault();

  tasks.push({
    title: e.target.title.value,
    desc: e.target.desc.value,
    id: tasks.length + 1,
    completed: false,
    isArchived: false,
  });
  writeToDoc();
  useLSTasks(actionTypes.set, tasks);
  form.reset();
});

function sortTasks(tasksArr) {
  return tasksArr.sort((a, b) => b.id - a.id);
}

function changeStatus(taskId, key, value) {
  console.log(taskId);
  tasks = tasks.map((task) => {
    if (task.id == taskId) {
      task = {
        ...task,
        [key]: value,
      };
      console.log(task);
    }

    return task;
  });

  writeToDoc();
  useLSTasks(actionTypes.set, tasks);
}

function deleteTask(taskId) {
  if (confirm("Are you sure delete this tasks!")) {
    tasks = tasks.filter((item) => item.id != taskId);

    writeToDoc();
    useLSTasks(actionTypes.set, tasks);
  }
}

searchInput.addEventListener("keyup", (e) => {
  searchValue = e.target.value.trim().toLowerCase();
  writeToDoc();
});
