import { useState, FormEvent } from 'react';
import type { CreateTodoInput } from '../types/todo';
import './TodoForm.css';

interface TodoFormProps {
  onSubmit: (input: CreateTodoInput) => void;
}

export function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    onSubmit({ title: t, description: description.trim() || undefined });
    setTitle('');
    setDescription('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo-form-input"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Todo title"
        maxLength={500}
      />
      <textarea
        className="todo-form-textarea"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        aria-label="Todo description"
        rows={2}
        maxLength={2000}
      />
      <button type="submit" className="todo-form-submit">
        Add
      </button>
    </form>
  );
}
