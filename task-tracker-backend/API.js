/*const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let tasks = [];
let currentId = 1;

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: "Both name and description are required" });
  }
  const newTask = { id: currentId++, name, description };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.patch('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description } = req.body;
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  if (name) task.name = name;
  if (description) task.description = description;
  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});*/

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Create an Express application
const app = express();
const PORT = 3000;

// Middleware setup
app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json()); // Parse incoming JSON request bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the "public" directory

// In-memory task storage
let tasks = [];
let currentId = 1;

/**
 * GET /tasks
 * Returns a list of all tasks as JSON.
 */
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

/**
 * POST /tasks
 * Adds a new task to the list.
 * Expects a JSON body with 'name' and 'description'.
 * Returns the created task with a unique ID.
 */
app.post('/tasks', (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: "Both name and description are required" });
  }
  const newTask = { id: currentId++, name, description };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

/**
 * PATCH /tasks/:id
 * Updates an existing task's name and/or description.
 * Expects a task ID in the URL and a JSON body with updated fields.
 * Returns the updated task or 404 if not found.
 */
app.patch('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description } = req.body;
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  if (name) task.name = name;
  if (description) task.description = description;
  res.json(task);
});

/**
 * DELETE /tasks/:id
 * Deletes a task with the given ID.
 * Returns 204 No Content on success.
 */
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.status(204).send();
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

