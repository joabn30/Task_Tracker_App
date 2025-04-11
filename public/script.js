/*
document.addEventListener('DOMContentLoaded', function () {
  const inputBox = document.getElementById("input-box");
  const descriptionBox = document.getElementById("description-box");
  const listContainer = document.getElementById("list-container");

  //Add Task funtion allows users to enter a new task by entering a taskname and it's description.
  function AddTask() {
    const taskName = inputBox.value.trim();
    const taskDescription = descriptionBox.value.trim();
      
      if (!taskName || !taskDescription) {
        alert("Please fill in both task name and description.");
        return;
        }
      
        // Fetch existing tasks first
        fetch("http://localhost:3000/tasks")
          .then(response => response.json())
          //Checks to see if the task already exists in the Systems before entering the task.
          .then(existingTasks => {
            const duplicate = existingTasks.find(
              task => task.name.toLowerCase() === taskName.toLowerCase()
            );
      
            if (duplicate) {
              alert("A task with this name already exists. Please choose a different name.");
              return;
            }
      
            // If no duplicate, add the task
            return fetch("http://localhost:3000/tasks", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: taskName, description: taskDescription }),
            });
          })
          .then(response => response && response.json())
          .then(task => {
            if (task) {
              renderTask(task);
              inputBox.value = '';
              descriptionBox.value = '';
            }
          })
          .catch(error => {
            console.error(error);
            alert("Error: Could not add task. Please try again.");
          });
      }
      

 function UpdateTask() {
    const selectedTask = document.querySelector('li.checked');
    //Check to see if the task has been selected before you can update the Taskname or it's decription.
    if (!selectedTask) {
      alert("Please select a task to update.");
      return;
    }
    const taskId = selectedTask.getAttribute("data-id");
    const newName = prompt("New task name:");
    const newDesc = prompt("New task description:");

    if (newName && newDesc) {
      fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, description: newDesc }),
      })
        .then(res => res.json())
        .then(task => {
          selectedTask.innerHTML = `<strong>${task.name}</strong>: ${task.description}`;
          selectedTask.setAttribute("data-id", task.id);
          const span = document.createElement("span");
          span.innerHTML = "×";
          selectedTask.appendChild(span);
        });
    }
  }
  
  function DeleteTask() {
    const selectedTask = document.querySelector('li.checked');
    if (!selectedTask) {
      alert("Please select a task to delete.");
      return;
    }

    const taskId = selectedTask.getAttribute("data-id");

    fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "DELETE"
    })
      .then(() => selectedTask.remove())
      .catch(error => alert("Error deleting task."));
  }
      

  function renderTask(task) {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${task.name}</strong>: ${task.description}`;
    li.setAttribute("data-id", task.id);

    const span = document.createElement("span");
    span.innerHTML = "×";
    li.appendChild(span);

    listContainer.appendChild(li);
  }

  function showTasks() {
    fetch("http://localhost:3000/tasks")
      .then(res => res.json())
      .then(tasks => {
        listContainer.innerHTML = '';
        tasks.forEach(renderTask);
      });
  }

  
  listContainer.addEventListener("click", function (e) {
   
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("checked");

    } else if (e.target.tagName === "SPAN") {
      const li = e.target.parentElement;
      DeleteTask();
    }
  });

  
  showTasks();

  window.AddTask = AddTask;
  window.UpdateTask = UpdateTask;
  window.DeleteTask = DeleteTask;
});*/

// Runs the script after the full HTML document is loaded
document.addEventListener('DOMContentLoaded', function () {

  // Grabbing DOM elements by their IDs
  const inputBox = document.getElementById("input-box");
  const descriptionBox = document.getElementById("description-box");
  const listContainer = document.getElementById("list-container");

  /**
   * AddTask function allows users to add a new task
   * It validates that both the name and description are provided,
   * checks for duplicate task names (case-insensitive),
   * and sends a POST request to the backend server to save the task.
   */
  function AddTask() {
    const taskName = inputBox.value.trim();
    const taskDescription = descriptionBox.value.trim();

    if (!taskName || !taskDescription) {
      alert("Please fill in both task name and description.");
      return;
    }

    // Fetch existing tasks to check for duplicates
    fetch("http://localhost:3000/tasks")
      .then(response => response.json())
      .then(existingTasks => {
        // Checks if the task already exists in the system
        const duplicate = existingTasks.find(
          task => task.name.toLowerCase() === taskName.toLowerCase()
        );

        if (duplicate) {
          alert("A task with this name already exists. Please choose a different name.");
          return;
        }

        // Send POST request to add the task if it's not a duplicate
        return fetch("http://localhost:3000/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: taskName, description: taskDescription }),
        });
      })
      .then(response => response && response.json())
      .then(task => {
        if (task) {
          renderTask(task);
          inputBox.value = '';
          descriptionBox.value = '';
        }
      })
      .catch(error => {
        console.error(error);
        alert("Error: Could not add task. Please try again.");
      });
  }

  /**
   * UpdateTask function allows users to update the name and description
   * of a selected task. It ensures a task is selected before proceeding,
   * then prompts for new values and updates the task via a PATCH request.
   */
  function UpdateTask() {
    const selectedTask = document.querySelector('li.checked');
    // Check to see if the task has been selected before updating
    if (!selectedTask) {
      alert("Please select a task to update.");
      return;
    }

    const taskId = selectedTask.getAttribute("data-id");
    const newName = prompt("New task name:");
    const newDesc = prompt("New task description:");

    if (newName && newDesc) {
      fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, description: newDesc }),
      })
        .then(res => res.json())
        .then(task => {
          // Replace the task's content in the DOM
          selectedTask.innerHTML = `<strong>${task.name}</strong>: ${task.description}`;
          selectedTask.setAttribute("data-id", task.id);
          const span = document.createElement("span");
          span.innerHTML = "×";
          selectedTask.appendChild(span);
        });
    }
  }

  /**
   * DeleteTask function allows users to delete the currently selected task.
   * It ensures a task is selected before sending a DELETE request to the backend,
   * and removes the task from the DOM on success.
   */
  function DeleteTask() {
    const selectedTask = document.querySelector('li.checked');
    if (!selectedTask) {
      alert("Please select a task to delete.");
      return;
    }

    const taskId = selectedTask.getAttribute("data-id");

    fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "DELETE"
    })
      .then(() => selectedTask.remove())
      .catch(error => alert("Error deleting task."));
  }

  /**
   * renderTask function creates a new list item for a given task object,
   * sets its attributes, and appends it to the task list container.
   */
  function renderTask(task) {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${task.name}</strong>: ${task.description}`;
    li.setAttribute("data-id", task.id);

    const span = document.createElement("span");
    span.innerHTML = "×";
    li.appendChild(span);

    listContainer.appendChild(li);
  }

  /**
   * showTasks fetches all tasks from the backend and displays them
   * by calling renderTask for each one.
   */
  function showTasks() {
    fetch("http://localhost:3000/tasks")
      .then(res => res.json())
      .then(tasks => {
        listContainer.innerHTML = '';
        tasks.forEach(renderTask);
      });
  }

  /**
   * Event listener for clicks inside the task list.
   * - Clicking a list item toggles its "checked" class (selection).
   * - Clicking the "×" span inside a task triggers deletion.
   */
  listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("checked");
    } else if (e.target.tagName === "SPAN") {
      const li = e.target.parentElement;
      DeleteTask();
    }
  });

  // Load tasks from the backend when the page loads
  showTasks();

  // Expose functions to global scope for button elements to call
  window.AddTask = AddTask;
  window.UpdateTask = UpdateTask;
  window.DeleteTask = DeleteTask;
});
