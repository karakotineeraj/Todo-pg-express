// Setting the process.env variables
require("dotenv").config();

const express = require("express");
const app = express();

const pool = require("./db");

// req.body
app.use(express.json());

/*
  ROUTES
*/

// Get all todos
app.get("/todos", async(req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");

    res.json(allTodos.rows);
  } catch(err) {
    console.log(err.message);
  }

})

// Get a todo
app.get("/todos/:id", async(req, res) => {
  const { id } = req.params;

  try {
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [ id ]);

    res.json(todo.rows);
  } catch(err) {
    console.log(err.message);
  }
})

//Create a todo
app.post("/todos", async(req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query("INSERT INTO todo (description) VALUES ($1) RETURNING *", [ description ]);

    res.json(newTodo);
  } catch(err) {
    console.error(err.message);
  }
});

// Update a todo
app.put("/todos/:id", async(req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  try {
    const updateTodo = pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [ description, id]);

    res.json("Todo was updated");
  } catch(err) {
    console.log(err.message);
  }
})

// Delete a todo
app.delete("/todos/:id", async(req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [ id ]);

    res.send("Todo was successfully deleted..");
  } catch(err) {
    console.log(err.message);
  }
})

app.listen(process.env.SERVER_PORT, () => {
  console.log("Server has started...");
});
