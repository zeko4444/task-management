document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form");
  const tasksContainer = document.getElementById("tasks-container");
  const taskTitleInput = document.getElementById("task-title");
  const taskDescInput = document.getElementById("task-desc");
  const searchTasksInput = document.getElementById("search-tasks");
  const sortTasksButton = document.getElementById("sort-tasks");

  let tasks = [];
  let sortAscending = true;

  // Fetch tasks from the dummy API
  fetchTasks();

  // Event listener for task form submission
  taskForm.addEventListener("submit", addOrUpdateTask);

  // Event listener for search input
  searchTasksInput.addEventListener("input", filterTasks);

  // Event listener for sort button
  sortTasksButton.addEventListener("click", sortTasks);

  // Function to fetch tasks
  function fetchTasks() {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((fetchedTasks) => {
        tasks = fetchedTasks.slice(0, 10); // Limiting to 10 tasks for simplicity
        displayTasks(tasks);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }

  // Function to display tasks in the DOM
  function displayTasks(tasks) {
    tasksContainer.innerHTML = "";
    tasks.forEach((task) => {
      const taskElement = createTaskElement(task);
      tasksContainer.appendChild(taskElement);
    });
  }

  // Function to create task element
  function createTaskElement(task) {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");
    if (task.completed) {
      taskElement.classList.add("completed");
    }
    taskElement.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description || ""}</p>
      <button onclick="toggleTask(${task.id})">${
      task.completed ? "Mark as Not Completed" : "Mark as Completed"
    }</button>
      <button onclick="editTask(${task.id})" class="edit">Edit</button>
      <button onclick="deleteTask(${task.id})" class="delete">Delete</button>
    `;
    return taskElement;
  }

  // Function to add or update a task
  function addOrUpdateTask(event) {
    event.preventDefault();

    const title = taskTitleInput.value.trim();
    const description = taskDescInput.value.trim();

    if (!title) {
      alert("Task title cannot be empty!");
      return;
    }

    const existingTask = tasks.find(
      (task) => task.id === parseInt(taskTitleInput.dataset.taskId)
    );
    if (existingTask) {
      // Update existing task
      existingTask.title = title;
      existingTask.description = description;
    } else {
      // Add new task
      const newTask = {
        id: tasks.length + 1, // Increment ID for each new task
        title: title,
        description: description,
        completed: false,
      };
      tasks.unshift(newTask); // Add new task to the beginning of the tasks array
    }

    displayTasks(tasks);
    taskForm.reset();
    delete taskTitleInput.dataset.taskId;
  }

  // Function to toggle task completion status
  window.toggleTask = function (taskId) {
    const task = tasks.find((t) => t.id === taskId);
    task.completed = !task.completed;
    displayTasks(tasks);
  };

  // Function to edit a task
  window.editTask = function (taskId) {
    const task = tasks.find((t) => t.id === taskId);
    taskTitleInput.value = task.title;
    taskDescInput.value = task.description || "";
    taskTitleInput.dataset.taskId = taskId; // Set dataset to store task ID
  };

  // Function to delete a task
  window.deleteTask = function (taskId) {
    tasks = tasks.filter((task) => task.id !== taskId);
    displayTasks(tasks);
  };

  // Function to filter tasks based on search input
  function filterTasks() {
    const searchTerm = searchTasksInput.value.toLowerCase();
    const filteredTasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm)
    );
    displayTasks(filteredTasks);
  }

  // Function to sort tasks by completion status
  function sortTasks() {
    tasks.sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return sortAscending
        ? a.completed - b.completed
        : b.completed - a.completed;
    });
    sortAscending = !sortAscending; // Toggle sorting order for next click
    displayTasks(tasks);
  }
});
