import { create } from 'zustand';
import { tasksAPI } from '../services/api';

const useTaskStore = create((set, get) => ({
  tasks: [],
  grouped: { Todo: [], 'In Progress': [], Done: [] },
  counts: { Todo: 0, 'In Progress': 0, Done: 0 },
  loading: false,
  error: null,
  searchQuery: '',

  // Fetch all tasks
  fetchTasks: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await tasksAPI.getAll(params);
      set({
        tasks: res.data.tasks,
        grouped: res.data.grouped,
        counts: res.data.counts,
        loading: false,
      });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load tasks', loading: false });
    }
  },

  // Create task
  createTask: async (data) => {
    try {
      const res = await tasksAPI.create(data);
      const newTask = res.data.task;
      set((state) => {
        const tasks = [newTask, ...state.tasks];
        return { tasks, grouped: regroupTasks(tasks), counts: countTasks(tasks) };
      });
      return { success: true, task: newTask };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to create task' };
    }
  },

  // Update task
  updateTask: async (id, data) => {
    try {
      const res = await tasksAPI.update(id, data);
      const updated = res.data.task;
      set((state) => {
        const tasks = state.tasks.map((t) => (t._id === id ? updated : t));
        return { tasks, grouped: regroupTasks(tasks), counts: countTasks(tasks) };
      });
      return { success: true, task: updated };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to update task' };
    }
  },

  // Delete task
  deleteTask: async (id) => {
    try {
      await tasksAPI.delete(id);
      set((state) => {
        const tasks = state.tasks.filter((t) => t._id !== id);
        return { tasks, grouped: regroupTasks(tasks), counts: countTasks(tasks) };
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to delete task' };
    }
  },

  // Move task to a different stage
  moveTask: async (id, stage) => {
    // Optimistic update
    set((state) => {
      const tasks = state.tasks.map((t) => (t._id === id ? { ...t, stage } : t));
      return { tasks, grouped: regroupTasks(tasks), counts: countTasks(tasks) };
    });
    try {
      await tasksAPI.moveStage(id, stage);
      return { success: true };
    } catch (err) {
      // Rollback on failure
      get().fetchTasks();
      return { success: false, error: 'Failed to move task' };
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  clearError: () => set({ error: null }),
}));

// Helpers
function regroupTasks(tasks) {
  return {
    Todo: tasks.filter((t) => t.stage === 'Todo'),
    'In Progress': tasks.filter((t) => t.stage === 'In Progress'),
    Done: tasks.filter((t) => t.stage === 'Done'),
  };
}

function countTasks(tasks) {
  return {
    Todo: tasks.filter((t) => t.stage === 'Todo').length,
    'In Progress': tasks.filter((t) => t.stage === 'In Progress').length,
    Done: tasks.filter((t) => t.stage === 'Done').length,
  };
}

export default useTaskStore;
