import type { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (import.meta.env.DEV) return 'http://localhost:3000';
  return ''; // same origin in production
};

const baseUrl = getBaseUrl();

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  getTodos: () => request<Todo[]>('/todos'),
  getTodo: (id: number) => request<Todo>(`/todos/${id}`),
  createTodo: (data: CreateTodoInput) =>
    request<Todo>('/todos', { method: 'POST', body: JSON.stringify(data) }),
  updateTodo: (id: number, data: UpdateTodoInput) =>
    request<Todo>(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteTodo: (id: number) =>
    request<void>(`/todos/${id}`, { method: 'DELETE' }),
};
