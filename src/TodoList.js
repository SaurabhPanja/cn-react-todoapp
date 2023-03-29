import React, { useState, useEffect } from 'react';
import axios from 'axios';

import "./TodoList.css";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [editedTodo, setEditedTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get(
      'https://jsonplaceholder.typicode.com/todos?_start=0&_limit=10'
    );
    setTodos(response.data);
  };

  const addTodo = async () => {
    const newTodo = {
      title: newTodoTitle,
      completed: false,
      userId: 1 // This is a required field for the API
    };
    const response = await axios.post(
      'https://jsonplaceholder.typicode.com/todos',
      newTodo
    );
    setTodos([...todos, response.data]);
    setNewTodoTitle('');
  };

  const editTodo = (id, updates) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
    );
  };

  const updateTodo = async (id, updates) => {
    const response = await axios.put(
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
      >
        <input
          type="text"
          placeholder="Add a new todo"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
        />
        <button>Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {editedTodo === todo.id ? (
              <input
                type="text"
                value={todo.title}
                onChange={(e) =>
                  editTodo(todo.id, { title: e.target.value, completed: todo.completed })
                }
                onBlur={() => updateTodo(todo.id, { title: todo.title, completed: todo.completed })}
              />
            ) : (
              <>
                <span
                  className={todo.completed ? 'completed' : ''}
                  onClick={() => setEditedTodo(todo.id)}
                >
                  {todo.title}
                </span>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
