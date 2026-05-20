import { useState } from 'react';
import type { Todo } from '../types/todo';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onUpdate: (
    id: number,
    data: { title: string; description?: string },
  ) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({
  todo,
  onToggle,
  onUpdate,
  onDelete,
}: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description ?? '');

  const handleSave = () => {
    const t = editTitle.trim();
    if (t) {
      onUpdate(todo.id, { title: t, description: editDesc.trim() || undefined });
      setEditing(false);
    }
  };

  return (
    <li
      className={`todo-item ${todo.completed ? 'todo-item--completed' : ''}`}
      data-testid={`todo-${todo.id}`}
    >
      <div className="todo-item-main">
        <button
          type="button"
          className="todo-item-check"
          onClick={() => onToggle(todo.id, !todo.completed)}
          aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
          aria-pressed={todo.completed}
        >
          {todo.completed && <span className="todo-item-check-icon">✓</span>}
        </button>
        {editing ? (
          <div className="todo-item-edit">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
              aria-label="Edit title"
            />
            <input
              type="text"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              onBlur={handleSave}
              placeholder="Description"
              aria-label="Edit description"
            />
          </div>
        ) : (
          <div
            className="todo-item-content"
            onDoubleClick={() => setEditing(true)}
          >
            <span className="todo-item-title">{todo.title}</span>
            {todo.description && (
              <span className="todo-item-desc">{todo.description}</span>
            )}
          </div>
        )}
        <div className="todo-item-actions">
          {!editing && (
            <button
              type="button"
              className="todo-item-btn todo-item-btn--edit"
              onClick={() => setEditing(true)}
              aria-label="Edit todo"
            >
              Edit
            </button>
          )}
          <button
            type="button"
            className="todo-item-btn todo-item-btn--delete"
            onClick={() => onDelete(todo.id)}
            aria-label="Delete todo"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
