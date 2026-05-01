// Elements
const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const filterButtons = document.querySelectorAll("[data-filter]");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Add Task
addBtn.addEventListener("click", () => {
  if (input.value.trim() === "") return;

  const task = {
    id: Date.now(),
    text: input.value,
    done: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  input.value = "";
});

// Render Tasks
function renderTasks() {
  list.innerHTML = "";

  const filtered = tasks.filter(task => {
    if (currentFilter === "done") return task.done;
    if (currentFilter === "pending") return !task.done;
    return true;
  });

  filtered.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span class="${task.done ? "done" : ""}">
        ${task.text}
      </span>
      <div>
        <button onclick="toggleTask(${task.id})">✔</button>
        <button onclick="deleteTask(${task.id})">❌</button>
      </div>
    `;

    list.appendChild(li);
  });
}

// Toggle Done
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, done: !task.done } : task
  );

  saveTasks();
  renderTasks();
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Filter
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});


//  Async API (important for your project)
async function loadTasksFromAPI() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
    const data = await res.json();

    const apiTasks = data.map(item => ({
      id: item.id,
      text: item.title,
      done: item.completed
    }));

    tasks = [...apiTasks, ...tasks];
    saveTasks();
    renderTasks();

  } catch (error) {
    console.log("API error:", error);
  }
}

// Load on start

renderTasks();


const toggleBtn = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  toggleBtn.textContent = "☀️";
}

// Toggle
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    toggleBtn.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    toggleBtn.textContent = "🌙";
  }
});