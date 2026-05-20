import { useState, useEffect, useCallback } from 'react';
import { api } from './api/client';
import type { Todo, CreateTodoInput } from './types/todo';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import './App.css';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      setError(null);
      const data = await api.getTodos();
      setTodos(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleCreate = async (input: CreateTodoInput) => {
    try {
      const created = await api.createTodo(input);
      setTodos((prev) => [created, ...prev]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create todo');
    }
  };

  const handleToggle = async (id: number, completed: boolean) => {
    try {
      const updated = await api.updateTodo(id, { completed });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update todo');
    }
  };

  const handleUpdate = async (
    id: number,
    data: { title: string; description?: string },
  ) => {
    try {
      const updated = await api.updateTodo(id, data);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update todo');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete todo');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Todo App</h1>
        <p className="subtitle">Full stack demo</p>
      </header>

      <main className="app-main">
        <TodoForm onSubmit={handleCreate} />
        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}
        {loading ? (
          <p className="loading">Loading…</p>
        ) : (
          <TodoList
            todos={todos}
            onToggle={handleToggle}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}

export default App;
