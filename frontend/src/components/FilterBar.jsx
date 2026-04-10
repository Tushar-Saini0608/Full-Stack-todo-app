
import React from 'react';

export function FilterBar({ filters, onChange, completedCount, onClearCompleted }) {
  const set = (key) => (val) => onChange({ ...filters, [key]: val });
  const tabs = [
    { label: 'All',     value: undefined },
    { label: 'Pending', value: false },
    { label: 'Done',    value: true },
  ];

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input className="input-base pl-9" type="text" placeholder="Search tasks..."
          value={filters.search || ''}
          onChange={e => set('search')(e.target.value || undefined)} />
        {filters.search && (
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
            onClick={() => set('search')(undefined)}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex bg-ink-100 rounded-lg p-0.5 gap-0.5">
          {tabs.map(tab => (
            <button key={String(tab.value)}
              onClick={() => set('completed')(tab.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150
                ${filters.completed === tab.value ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <select className="text-xs border border-ink-200 rounded-lg px-2.5 py-1.5 bg-white text-ink-700
                           focus:outline-none focus:ring-2 focus:ring-accent-400"
          value={filters.priority || ''}
          onChange={e => set('priority')(e.target.value || undefined)}>
          <option value="">All priorities</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>

        <select className="text-xs border border-ink-200 rounded-lg px-2.5 py-1.5 bg-white text-ink-700
                           focus:outline-none focus:ring-2 focus:ring-accent-400 ml-auto"
          value={`${filters.sortBy || 'created_at'}:${filters.sortDir || 'desc'}`}
          onChange={e => {
            const [sortBy, sortDir] = e.target.value.split(':');
            onChange({ ...filters, sortBy, sortDir });
          }}>
          <option value="created_at:desc">Newest first</option>
          <option value="created_at:asc">Oldest first</option>
          <option value="due_date:asc">Due date</option>
          <option value="title:asc">A → Z</option>
          <option value="priority:desc">Priority</option>
        </select>
      </div>

      {completedCount > 0 && (
        <button onClick={onClearCompleted}
          className="self-start text-xs text-ink-400 hover:text-red-500 transition-colors flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear {completedCount} completed
        </button>
      )}
    </div>
  );
}
