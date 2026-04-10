// import { useState, useEffect, useCallback } from 'react';
// import { todosAPI } from '../api';
// import toast from 'react-hot-toast';

// export function useTodos(filters = {}) {
//   const [todos, setTodos] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchTodos = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const [todosRes, statsRes] = await Promise.all([
//         todosAPI.getAll(filters),
//         todosAPI.getStats(),
//       ]);
//       setTodos(todosRes.data.data.todos);
//       setStats(statsRes.data.data);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to load todos');
//     } finally {
//       setLoading(false);
//     }
//   }, [JSON.stringify(filters)]);

//   useEffect(() => { fetchTodos(); }, [fetchTodos]);

//   const createTodo = useCallback(async (todoData) => {
//     const toastId = toast.loading('Creating task...');
//     try {
//       const { data } = await todosAPI.create(todoData);
//       setTodos(prev => [data.data.todo, ...prev]);
//       toast.success('Task created!', { id: toastId });
//       fetchTodos(); // refresh stats
//       return data.data.todo;
//     } catch (err) {
//       const msg = err.response?.data?.message || 'Failed to create task';
//       toast.error(msg, { id: toastId });
//       throw err;
//     }
//   }, [fetchTodos]);

//   const updateTodo = useCallback(async (id, updates) => {
//     try {
//       const { data } = await todosAPI.update(id, updates);
//       setTodos(prev => prev.map(t => t.id === id ? data.data.todo : t));
//       if ('completed' in updates) {
//         toast.success(updates.completed ? '✓ Marked complete' : 'Marked incomplete', { duration: 1500 });
//       }
//       fetchTodos(); // refresh stats
//       return data.data.todo;
//     } catch (err) {
//       toast.error('Failed to update task');
//       throw err;
//     }
//   }, [fetchTodos]);

//   const deleteTodo = useCallback(async (id) => {
//     const toastId = toast.loading('Deleting...');
//     try {
//       await todosAPI.delete(id);
//       setTodos(prev => prev.filter(t => t.id !== id));
//       toast.success('Task deleted', { id: toastId });
//       fetchTodos();
//     } catch (err) {
//       toast.error('Failed to delete task', { id: toastId });
//       throw err;
//     }
//   }, [fetchTodos]);

//   const clearCompleted = useCallback(async () => {
//     const toastId = toast.loading('Clearing completed tasks...');
//     try {
//       const { data } = await todosAPI.clearCompleted();
//       setTodos(prev => prev.filter(t => !t.completed));
//       toast.success(data.message, { id: toastId });
//       fetchTodos();
//     } catch (err) {
//       toast.error('Failed to clear tasks', { id: toastId });
//     }
//   }, [fetchTodos]);

//   return {
//     todos,
//     stats,
//     loading,
//     error,
//     refetch: fetchTodos,
//     createTodo,
//     updateTodo,
//     deleteTodo,
//     clearCompleted,
//   };
// }
import React, { useState, useEffect, useCallback } from 'react';
import { tasksAPI } from '../api';
import toast from 'react-hot-toast';

export function useTodos(filters = {}) {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map frontend filter keys to backend query params
  const buildParams = (f) => {
    const p = {};
    if (f.completed !== undefined) p.is_completed = f.completed;
    if (f.priority)   p.priority = f.priority;
    if (f.search)     p.search = f.search;
    if (f.sortBy)     p.sort_by = f.sortBy;
    if (f.sortDir)    p.sort_dir = f.sortDir;
    return p;
  };

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [tasksRes, statsRes] = await Promise.all([
        tasksAPI.getAll(buildParams(filters)),
        tasksAPI.getStats(),
      ]);
      setTodos(tasksRes.data.data.tasks);
      setStats(statsRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTodo = useCallback(async (taskData) => {
    const toastId = toast.loading('Creating task...');
    try {
      const { data } = await tasksAPI.create(taskData);
      toast.success('Task created!', { id: toastId });
      await fetchTasks();
      return data.data.task;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task', { id: toastId });
      throw err;
    }
  }, [fetchTasks]);

  const updateTodo = useCallback(async (id, updates) => {
    try {
      const { data } = await tasksAPI.update(id, updates);
      setTodos(prev => prev.map(t => t._id === id ? data.data.task : t));
      if ('is_completed' in updates) {
        toast.success(updates.is_completed ? '✓ Marked complete' : 'Marked incomplete', { duration: 1500 });
      }
      await fetchTasks();
      return data.data.task;
    } catch (err) {
      toast.error('Failed to update task');
      throw err;
    }
  }, [fetchTasks]);

  const deleteTodo = useCallback(async (id) => {
    const toastId = toast.loading('Deleting...');
    try {
      await tasksAPI.delete(id);
      setTodos(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted', { id: toastId });
      await fetchTasks();
    } catch (err) {
      toast.error('Failed to delete task', { id: toastId });
      throw err;
    }
  }, [fetchTasks]);

  const clearCompleted = useCallback(async () => {
    const toastId = toast.loading('Clearing completed tasks...');
    try {
      const { data } = await tasksAPI.clearCompleted();
      toast.success(data.message, { id: toastId });
      await fetchTasks();
    } catch (err) {
      toast.error('Failed to clear tasks', { id: toastId });
    }
  }, [fetchTasks]);

  return { todos, stats, loading, error, refetch: fetchTasks, createTodo, updateTodo, deleteTodo, clearCompleted };
}