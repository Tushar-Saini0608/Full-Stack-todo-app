const { v4: uuidv4 } = require('uuid');

/**
 * In-memory database (replace with MongoDB/PostgreSQL in production)
 * Structure mirrors a real DB schema for easy migration
 */
const db = {
  users: new Map(),
  todos: new Map(),
};

// ─── User Model ────────────────────────────────────────────────────────────────

const UserModel = {
  create({ username, email, password }) {
    const id = uuidv4();
    const now = new Date().toISOString();
    const user = {
      id,
      username,
      email: email.toLowerCase(),
      password,
      createdAt: now,
      updatedAt: now,
    };
    db.users.set(id, user);
    return user;
  },

  findById(id) {
    return db.users.get(id) || null;
  },

  findByEmail(email) {
    for (const user of db.users.values()) {
      if (user.email === email.toLowerCase()) return user;
    }
    return null;
  },

  findByUsername(username) {
    for (const user of db.users.values()) {
      if (user.username.toLowerCase() === username.toLowerCase()) return user;
    }
    return null;
  },

  toPublic(user) {
    const { password, ...public_user } = user;
    return public_user;
  },
};

// ─── Todo Model ────────────────────────────────────────────────────────────────

const TodoModel = {
  create({ title, description = '', priority = 'medium', dueDate = null, userId }) {
    const id = uuidv4();
    const now = new Date().toISOString();
    const todo = {
      id,
      title,
      description,
      priority,
      dueDate,
      completed: false,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    db.todos.set(id, todo);
    return todo;
  },

  findById(id) {
    return db.todos.get(id) || null;
  },

  findByUserId(userId, filters = {}) {
    let todos = [];
    for (const todo of db.todos.values()) {
      if (todo.userId === userId) todos.push(todo);
    }

    // Apply filters
    if (filters.completed !== undefined) {
      todos = todos.filter(t => t.completed === filters.completed);
    }
    if (filters.priority) {
      todos = todos.filter(t => t.priority === filters.priority);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      todos = todos.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }

    // Sort
    const sortField = filters.sortBy || 'createdAt';
    const sortDir = filters.sortDir === 'asc' ? 1 : -1;
    todos.sort((a, b) => {
      if (a[sortField] < b[sortField]) return -sortDir;
      if (a[sortField] > b[sortField]) return sortDir;
      return 0;
    });

    return todos;
  },

  update(id, updates) {
    const todo = db.todos.get(id);
    if (!todo) return null;
    const updated = {
      ...todo,
      ...updates,
      id: todo.id,
      userId: todo.userId,
      createdAt: todo.createdAt,
      updatedAt: new Date().toISOString(),
    };
    db.todos.set(id, updated);
    return updated;
  },

  delete(id) {
    const todo = db.todos.get(id);
    if (!todo) return false;
    db.todos.delete(id);
    return true;
  },

  getStats(userId) {
    const todos = [];
    for (const todo of db.todos.values()) {
      if (todo.userId === userId) todos.push(todo);
    }
    return {
      total: todos.length,
      completed: todos.filter(t => t.completed).length,
      pending: todos.filter(t => !t.completed).length,
      byPriority: {
        high: todos.filter(t => t.priority === 'high').length,
        medium: todos.filter(t => t.priority === 'medium').length,
        low: todos.filter(t => t.priority === 'low').length,
      },
    };
  },
};

module.exports = { UserModel, TodoModel };