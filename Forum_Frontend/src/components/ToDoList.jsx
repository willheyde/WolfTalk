import React, { useState, useEffect } from 'react';
import todoService from '../services/TagService';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');

  // 1. FETCH DATA when component mounts
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await todoService.getAllTodos();
      setTodos(data); // Update React state with Spring Boot data
    } catch (error) {
      console.error('Failed to load todos:', error);
    }
  };

  // 2. CREATE: Send new todo to Spring Boot
  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      const newTodo = await todoService.createTodo({ text: newTodoText });
      setTodos([...todos, newTodo]); // Add to local state
      setNewTodoText(''); // Clear input
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  // 3. UPDATE: Toggle todo completion
  const handleToggleTodo = async (todo) => {
    try {
      const updated = await todoService.updateTodo(todo.id, {
        ...todo,
        done: !todo.done
      });
      // Replace in local state
      setTodos(todos.map(t => t.id === updated.id ? updated : t));
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  // 4. DELETE: Remove todo
  const handleDeleteTodo = async (id) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id)); // Remove from local state
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* CREATE FORM */}
      <form onSubmit={handleAddTodo} className="mb-4">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          className="border p-2 mr-2"
          placeholder="New todo..."
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Add Todo
        </button>
      </form>

      {/* TODO LIST */}
      <div>
        {todos.map(todo => (
          <div key={todo.id} className="flex items-center mb-2 p-2 border">
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => handleToggleTodo(todo)}
              className="mr-2"
            />
            <span className={todo.done ? 'line-through' : ''}>
              {todo.text}
            </span>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              className="ml-auto text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoList;