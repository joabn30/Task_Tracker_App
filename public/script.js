// Runs the script after the full HTML document is loaded
document.addEventListener('DOMContentLoaded', function () {

  // Grabbing DOM elements by their IDs
  const inputBox = document.getElementById("input-box");
  const descriptionBox = document.getElementById("description-box");
  const listContainer = document.getElementById("list-container");

  /**
   * AddTask function allows users to add a new task.
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

    fetch("http://localhost:3000/tasks")
      .then(response => response.json())
      .then(existingTasks => {
        const duplicate = existingTasks.find(
          task => task.name.toLowerCase() === taskName.toLowerCase()
        );

        if (duplicate) {
          alert("A task with this name already exists. Please choose a different name.");
          return;
        }

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
          selectedTask.innerHTML = '';
          const status = selectedTask.getAttribute("data-status") || "Pending";

          const wrapper = document.createElement("div");
          wrapper.style.display = "flex";
          wrapper.style.alignItems = "center";
          wrapper.style.justifyContent = "space-between";
          wrapper.style.width = "100%";

          const taskContent = document.createElement("div");
          taskContent.className = "task-content";
          taskContent.innerHTML = `<strong>${task.name}</strong>: ${task.description} <em>(${status})</em>`;

          const statusBtn = document.createElement("button");
          statusBtn.textContent = "✔";
          statusBtn.title = "Mark as Completed/Pending";
          statusBtn.className = "tickmark-btn";
          statusBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleStatus(selectedTask);
          });

          const span = document.createElement("span");
          span.innerHTML = "×";
          span.title = "Delete Task";
          span.className = "delete-btn";

          wrapper.appendChild(taskContent);
          wrapper.appendChild(statusBtn);
          wrapper.appendChild(span);
          selectedTask.appendChild(wrapper);
          selectedTask.setAttribute("data-id", task.id);
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
   * toggleStatus function allows a user to toggle a task's completion status
   * between "Pending" and "Completed". It updates the task both in the backend
   * (via a PATCH request) and in the frontend by re-rendering the task's layout.
   *
   * @param {HTMLElement} taskElement - The DOM element representing the task <li>
   */
  function toggleStatus(taskElement) {
    const taskId = taskElement.getAttribute("data-id");
    const currentStatus = taskElement.getAttribute("data-status") || "Pending";
    const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";

    fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => res.json())
      .then(updatedTask => {
        const status = updatedTask.status || "Completed";
        taskElement.setAttribute("data-status", status);
        taskElement.innerHTML = '';

        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";
        wrapper.style.justifyContent = "space-between";
        wrapper.style.width = "100%";

        const taskContent = document.createElement("div");
        taskContent.className = "task-content";
        taskContent.innerHTML = `<strong>${updatedTask.name}</strong>: ${updatedTask.description} <em>(${status})</em>`;

        const statusBtn = document.createElement("button");
        statusBtn.textContent = "✔";
        statusBtn.className = "tickmark-btn";
        statusBtn.title = "Mark as Completed/Pending";
        statusBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleStatus(taskElement);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "×";
        deleteBtn.className = "delete-btn";
        deleteBtn.title = "Delete Task";
        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          DeleteTask();
        });

        const btnGroup = document.createElement("div");
        btnGroup.className = "button-group";

        if (status !== "Completed") {
          btnGroup.appendChild(statusBtn);
        }

        btnGroup.appendChild(deleteBtn);
        wrapper.appendChild(taskContent);
        wrapper.appendChild(btnGroup);
        taskElement.appendChild(wrapper);
      })
      .catch(error => {
        console.error("Error updating status:", error);
        alert("Failed to update task status.");
      });
  }

  /**
   * renderTask function creates a new list item for a given task object,
   * sets its attributes, and appends it to the task list container.
   */
  function renderTask(task) {
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);

    const status = task.status || "Pending";
    li.setAttribute("data-status", status);
    li.innerHTML = `<strong>${task.name}</strong>: ${task.description} <em>(${status})</em>`;

    const statusBtn = document.createElement("button");
    statusBtn.textContent = "✔";
    statusBtn.title = "Mark as Completed/Pending";
    statusBtn.style.marginLeft = "10px";
    statusBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleStatus(li);
    });

    const span = document.createElement("span");
    span.innerHTML = "×";
    span.title = "Delete Task";

    li.appendChild(statusBtn);
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
   * Clicking a list item toggles its "checked" class (selection).
   * Clicking the "×" span inside a task triggers deletion.
   */
  listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
      const wasChecked = e.target.classList.contains("checked");
      document.querySelectorAll("li").forEach(li => li.classList.remove("checked"));
      if (!wasChecked) {
        e.target.classList.add("checked");
      }
    } else if (e.target.tagName === "SPAN") {
      const li = e.target.closest("li");
      if (li) DeleteTask();
    }
  });

  // Load tasks from the backend when the page loads
  showTasks();

  // Expose functions to global scope for button elements to call
  window.AddTask = AddTask;
  window.UpdateTask = UpdateTask;
  window.DeleteTask = DeleteTask;
});
