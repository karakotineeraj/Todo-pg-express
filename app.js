// Setting the process.env variables
require("dotenv").config();

const express = require("express");
const app = express();

const { Sequelize, DataTypes, Model } = require("sequelize");

// req.body
app.use(express.json());

// Setting up the DB connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
    acquire: 10000
  }
});

const Todo = sequelize.define("todo", {
  todoId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.TEXT,
    required: true,
    unique: true,
    allowNull: false
  }
});

sequelize.sync()
.catch(function(err) {
  console.log(err);
});

/*
  ROUTES
*/

// Get all todos
app.get("/todos", async(req, res) => {
  Todo.findAll()
  .then((todos) => {
    return res.json(todos);
  }).catch((err) => {
    console.log(err);
    return res.json(err);
  });
});

// Get a todo
app.get("/todos/:id", async(req, res) => {
  Todo.findByPk(req.params.id)
  .then((resolve, reject) => {
    if(todo)
      return res.json(resolve);

    return res.send("Todo doesn't exist.");
  }).catch((err) => {
    return res.send(err);
  });
});

//Create a todo
app.post("/todos", async(req, res) => {
  Todo.create({ title: req.body.title })
  .then((resolve, reject) => {
    if(resolve)
      return res.json(resolve);

    return res.json(reject);
  }).catch((err) => {
    return res.send(err);
  });
});

// Update a todo
app.put("/todos/:id", async(req, res) => {
  Todo.update({ title: req.body.title}, {
    where: {
      todoId: req.params.id
    }
  }).then((resolve, reject) => {
    if(resolve)
      return res.json(resolve);

    return res.send(reject);
  }).catch((err) => {
    return res.send(err);
  });
});

// Delete a todo
app.delete("/todos/:id", async(req, res) => {
  Todo.destroy({
    where:{
      todoId: req.params.id
    }
  }).then((resolve, reject) => {
    if(resolve)
      return res.json(resolve);

    return res.send(reject);
  }).catch((err) => {
    return res.send(err);
  });
});

app.listen(process.env.SERVER_PORT, () => {
  console.log("Server has started...");
});
