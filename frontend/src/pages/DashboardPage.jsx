// import React from 'react';
// import { useState, useMemo } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useTodos } from '../hooks/useTodos';
// import { TodoItem } from '../components/TodoItem';
// import { TodoForm } from '../components/TodoForm';
// import { StatsBar } from '../components/StatsBar';
// import { FilterBar } from '../components/FilterBar';

// export function DashboardPage() {
//   const { user, logout } = useAuth();
//   const [filters, setFilters] = useState({});
//   const [showForm, setShowForm] = useState(false);
//   const [editingTodo, setEditingTodo] = useState(null);

//   const { todos, stats, loading, error, createTodo, updateTodo, deleteTodo, clearCompleted } = useTodos(filters);

//   const completedCount = useMemo(() => todos.filter(t => t.completed).length, [todos]);

//   const handleCreate = (data) => createTodo(data);
//   const handleEdit = (data) => updateTodo(editingTodo.id, data);
//   const handleToggle = (id, completed) => updateTodo(id, { completed });

//   const greeting = useMemo(() => {
//     const h = new Date().getHours();
//     if (h < 12) return 'Good morning';
//     if (h < 17) return 'Good afternoon';
//     return 'Good evening';
//   }, []);

//   return (
//     <div className="min-h-screen">
//       {/* Header */}
//       <header className="sticky top-0 z-10 bg-ink-50/80 backdrop-blur border-b border-ink-100">
//         <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
//           <h1 className="font-display text-xl font-bold text-ink-900 tracking-tight">Taskr</h1>
//           <div className="flex items-center gap-3">
//             <span className="text-sm text-ink-500 hidden sm:block">
//               {user?.username}
//             </span>
//             <button onClick={logout} className="btn-ghost text-xs py-1.5 px-3">
//               Sign out
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-2xl mx-auto px-4 py-8">
//         {/* Greeting */}
//         <div className="mb-8">
//           <p className="text-sm text-ink-500">{greeting},</p>
//           <h2 className="font-display text-3xl font-bold text-ink-900 mt-0.5 capitalize">
//             {user?.username}
//           </h2>
//           {stats && stats.pending > 0 && (
//             <p className="text-sm text-ink-400 mt-1">
//               You have <span className="text-ink-700 font-medium">{stats.pending} task{stats.pending !== 1 ? 's' : ''}</span> pending
//             </p>
//           )}
//           {stats && stats.pending === 0 && stats.total > 0 && (
//             <p className="text-sm text-sage-600 mt-1 font-medium">🎉 All done! Great work.</p>
//           )}
//         </div>

//         {/* Stats */}
//         <StatsBar stats={stats} />

//         {/* Add task button */}
//         <button
//           onClick={() => setShowForm(true)}
//           className="btn-primary w-full mb-5 py-3 text-sm gap-2 group"
//         >
//           <svg
//             className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200"
//             fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//           </svg>
//           Add new task
//         </button>

//         {/* Filters */}
//         <FilterBar
//           filters={filters}
//           onChange={setFilters}
//           completedCount={completedCount}
//           onClearCompleted={clearCompleted}
//         />

//         {/* Todo list */}
//         <div className="card overflow-hidden">
//           {loading && todos.length === 0 && (
//             <div className="py-16 text-center">
//               <svg className="animate-spin h-6 w-6 text-ink-300 mx-auto" viewBox="0 0 24 24" fill="none">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
//               </svg>
//               <p className="text-sm text-ink-400 mt-3">Loading tasks...</p>
//             </div>
//           )}

//           {error && (
//             <div className="py-10 text-center">
//               <p className="text-sm text-red-500">{error}</p>
//             </div>
//           )}

//           {!loading && !error && todos.length === 0 && (
//             <div className="py-16 text-center px-6">
//               <div className="w-12 h-12 rounded-full bg-ink-100 flex items-center justify-center mx-auto mb-3">
//                 <svg className="w-6 h-6 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
//                   <path strokeLinecap="round" strokeLinejoin="round"
//                     d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//               </div>
//               <p className="text-sm font-medium text-ink-700">
//                 {Object.keys(filters).some(k => filters[k] !== undefined)
//                   ? 'No tasks match your filters'
//                   : 'No tasks yet'}
//               </p>
//               <p className="text-xs text-ink-400 mt-1">
//                 {Object.keys(filters).some(k => filters[k] !== undefined)
//                   ? 'Try changing your filters'
//                   : 'Create your first task to get started'}
//               </p>
//             </div>
//           )}

//           {todos.map(todo => (
//             <TodoItem
//               key={todo.id}
//               todo={todo}
//               onToggle={handleToggle}
//               onEdit={(t) => { setEditingTodo(t); setShowForm(true); }}
//               onDelete={deleteTodo}
//             />
//           ))}

//           {todos.length > 0 && (
//             <div className="px-4 py-2.5 border-t border-ink-50 bg-ink-50/50">
//               <p className="text-xs text-ink-400">
//                 {todos.length} task{todos.length !== 1 ? 's' : ''} shown
//               </p>
//             </div>
//           )}
//         </div>
//       </main>

//       {/* Modal */}
//       {showForm && (
//         <TodoForm
//           onSubmit={editingTodo ? handleEdit : handleCreate}
//           onClose={() => { setShowForm(false); setEditingTodo(null); }}
//           initialData={editingTodo}
//         />
//       )}
//     </div>
//   );
// }
import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTodos } from '../hooks/useTodos';
import { TodoItem } from '../components/TodoItem';
import { TodoForm } from '../components/TodoForm';
import { StatsBar } from '../components/StatsBar';
import { FilterBar } from '../components/FilterBar';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [filters, setFilters]         = useState({});
  const [showForm, setShowForm]       = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  const { todos, stats, loading, error, createTodo, updateTodo, deleteTodo, clearCompleted } = useTodos(filters);

  const completedCount = useMemo(() => todos.filter(t => t.is_completed).length, [todos]);

  const handleCreate = (data) => createTodo(data);
  const handleEdit   = (data) => updateTodo(editingTodo._id, data);
  const handleToggle = (id, is_completed) => updateTodo(id, { is_completed });

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-ink-50/80 backdrop-blur border-b border-ink-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-ink-900 tracking-tight">Taskr</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-ink-500 hidden sm:block">Welcome {user?.username}</span>
            <button onClick={logout} className="btn-ghost text-xs py-1.5 px-3">Sign out</button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-sm text-ink-500">{greeting},</p>
          <h2 className="font-display text-3xl font-bold text-ink-900 mt-0.5 capitalize">{user?.username}</h2>
          {stats && stats.pending > 0 && (
            <p className="text-sm text-ink-400 mt-1">
              You have <span className="text-ink-700 font-medium">{stats.pending} task{stats.pending !== 1 ? 's' : ''}</span> pending
            </p>
          )}
          {stats && stats.pending === 0 && stats.total > 0 && (
            <p className="text-sm text-sage-600 mt-1 font-medium">🎉 All done! Great work.</p>
          )}
        </div>

        <StatsBar stats={stats} />

        <button onClick={() => setShowForm(true)} className="btn-primary w-full mb-5 py-3 text-sm gap-2 group">
          <svg className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add new task
        </button>

        <FilterBar filters={filters} onChange={setFilters} completedCount={completedCount} onClearCompleted={clearCompleted} />

        <div className="card overflow-hidden">
          {loading && todos.length === 0 && (
            <div className="py-16 text-center">
              <svg className="animate-spin h-6 w-6 text-ink-300 mx-auto" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <p className="text-sm text-ink-400 mt-3">Loading tasks...</p>
            </div>
          )}

          {error && <div className="py-10 text-center"><p className="text-sm text-red-500">{error}</p></div>}

          {!loading && !error && todos.length === 0 && (
            <div className="py-16 text-center px-6">
              <div className="w-12 h-12 rounded-full bg-ink-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm font-medium text-ink-700">
                {Object.values(filters).some(Boolean) ? 'No tasks match your filters' : 'No tasks yet'}
              </p>
              <p className="text-xs text-ink-400 mt-1">
                {Object.values(filters).some(Boolean) ? 'Try changing your filters' : 'Create your first task to get started'}
              </p>
            </div>
          )}

          {todos.map(todo => (
            <TodoItem key={todo._id} todo={todo} onToggle={handleToggle}
              onEdit={(t) => { setEditingTodo(t); setShowForm(true); }}
              onDelete={deleteTodo} />
          ))}

          {todos.length > 0 && (
            <div className="px-4 py-2.5 border-t border-ink-50 bg-ink-50/50">
              <p className="text-xs text-ink-400">{todos.length} task{todos.length !== 1 ? 's' : ''} shown</p>
            </div>
          )}
        </div>
      </main>

      {showForm && (
        <TodoForm
          onSubmit={editingTodo ? handleEdit : handleCreate}
          onClose={() => { setShowForm(false); setEditingTodo(null); }}
          initialData={editingTodo}
        />
      )}
    </div>
  );
}