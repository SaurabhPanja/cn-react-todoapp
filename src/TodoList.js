import React, { useState, useEffect } from "react";
import axios from "axios";

import "./TodoList.css";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [editedTodo, setEditedTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos?_start=0&_limit=5"
    );
    setTodos(response.data);
  };

  const addTodo = async () => {
    const newTodo = {
      title: newTodoTitle,
      completed: false,
      userId: 1, // This is a required field for the API
    };
    const response = await axios.post(
      "https://jsonplaceholder.typicode.com/todos",
      newTodo
    );
    setTodos([...todos, response.data]);
    setNewTodoTitle("");
  };

  const editTodo = (id, updates) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
    );
  };

  const updateTodo = async (id, updates) => {
    await axios.put(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      updates
    );
    setEditedTodo(null);
  };

  const deleteTodo = async (id) => {
    await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="todo-list">
      <h1>Todo List</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTodo();
        }}
        className="add-todo-form"
      >
        <input
          type="text"
          placeholder="Add a new todo"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          className="todo-input"
        />
        <button className="todo-btn add-todo-btn">Add</button>
      </form>
      <ul className="all-todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-list-item">
            {editedTodo === todo.id ? (
              <input
                type="text"
                value={todo.title}
                onChange={(e) =>
                  editTodo(todo.id, {
                    title: e.target.value,
                    completed: todo.completed,
                  })
                }
                onBlur={() =>
                  updateTodo(todo.id, {
                    title: todo.title,
                    completed: todo.completed,
                  })
                }
                className="todo-input edit-todo-input"
              />
            ) : (
              <>
                <div
                  className={
                    todo.completed
                      ? "edit-todo-input completed"
                      : "edit-todo-input"
                  }
                  onClick={() => setEditedTodo(todo.id)}
                >
                  {todo.title}
                </div>
                <div className="todo-btn-container">
                  <button
                    className={
                      todo.completed
                        ? "todo-btn uncheck-todo-btn p-05"
                        : "todo-btn check-todo-btn p-05"
                    }
                    onClick={() => {
                      editTodo(todo.id, {
                        title: todo.title,
                        completed: !todo.completed,
                      });
                    }}
                  >
                    {todo.completed ? "Uncheck" : "Check"}
                  </button>
                  <button
                    className="todo-btn delete-todo-btn p-05"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
