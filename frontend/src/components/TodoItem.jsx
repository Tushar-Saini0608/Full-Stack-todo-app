
import React, { useState } from 'react';
import { format, isPast, isToday, differenceInHours, differenceInMinutes } from 'date-fns';

const PRIORITY_STYLES = {
  high:   { badge: 'priority-high',   label: 'High' },
  medium: { badge: 'priority-medium', label: 'Med'  },
  low:    { badge: 'priority-low',    label: 'Low'  },
};

// Format the due date+time into a human-readable string
function formatDueDate(due_date) {
  const d = new Date(due_date);
  const hasTime = d.getHours() !== 0 || d.getMinutes() !== 0;

  const timeStr = hasTime ? ` at ${format(d, 'h:mm a')}` : '';

  if (isToday(d)) return `Due today${timeStr}`;
  return `${format(d, 'MMM d, yyyy')}${timeStr}`;
}

// Show a countdown like "2h 30m left" or "Overdue by 3h"
function getCountdown(due_date) {
  const d = new Date(due_date);
  const hasTime = d.getHours() !== 0 || d.getMinutes() !== 0;
  if (!hasTime) return null;

  const now = new Date();
  const diffMins = differenceInMinutes(d, now);

  if (diffMins < 0) {
    const overMins = Math.abs(diffMins);
    if (overMins < 60) return `Overdue by ${overMins}m`;
    return `Overdue by ${Math.floor(overMins / 60)}h ${overMins % 60}m`;
  }
  if (diffMins < 60) return `${diffMins}m left`;
  const h = Math.floor(diffMins / 60);
  const m = diffMins % 60;
  return m > 0 ? `${h}h ${m}m left` : `${h}h left`;
}

function getDueDateStyle(due_date, is_completed) {
  if (!due_date || is_completed) return 'text-ink-400';
  const d = new Date(due_date);
  if (isPast(d) && !isToday(d)) return 'text-red-500 font-medium';
  if (isToday(d)) {
    const mins = differenceInMinutes(d, new Date());
    const hasTime = d.getHours() !== 0 || d.getMinutes() !== 0;
    if (hasTime && mins < 60 && mins >= 0) return 'text-red-500 font-medium';
    if (hasTime && mins < 0) return 'text-red-600 font-bold';
    return 'text-amber-600 font-medium';
  }
  return 'text-ink-400';
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const priority = PRIORITY_STYLES[todo.priority] || PRIORITY_STYLES.medium;
  const countdown = todo.due_date && !todo.is_completed ? getCountdown(todo.due_date) : null;

  const handleToggle = async () => {
    setToggling(true);
    try { await onToggle(todo._id, !todo.is_completed); }
    finally { setToggling(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await onDelete(todo._id); }
    catch { setDeleting(false); }
  };

  return (
    <div className={`group flex items-start gap-3 px-4 py-3.5 border-b border-ink-50 last:border-0
                     transition-all duration-200 hover:bg-ink-50/60
                     ${deleting ? 'opacity-50 pointer-events-none' : ''}
                     ${todo.is_completed ? 'opacity-60' : ''}`}>
      {/* Checkbox */}
      <div className="mt-0.5">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.is_completed}
          onChange={handleToggle}
          disabled={toggling}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <p className={`text-sm font-medium leading-snug flex-1 min-w-0 break-words
                        ${todo.is_completed ? 'line-through text-ink-400' : 'text-ink-900'}`}>
            {todo.title}
          </p>
          <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide ${priority.badge}`}>
            {priority.label}
          </span>
        </div>

        {todo.description && (
          <p className="text-xs text-ink-400 mt-0.5 leading-relaxed line-clamp-2">
            {todo.description}
          </p>
        )}

        {/* Due date + time row */}
        {todo.due_date && (
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {/* Date & time */}
            <span className={`text-xs flex items-center gap-1 ${getDueDateStyle(todo.due_date, todo.is_completed)}`}>
              <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDueDate(todo.due_date)}
            </span>

            {/* Countdown badge — only shown when a time is set */}
            {countdown && (
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5
                ${countdown.startsWith('Overdue')
                  ? 'bg-red-50 text-red-600 border border-red-100'
                  : countdown.includes('m left') && !countdown.includes('h')
                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                    : 'bg-ink-50 text-ink-500 border border-ink-100'}`}>
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {countdown}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hover actions */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5">
        <button onClick={() => onEdit(todo)}
          className="p-1.5 rounded-md text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors" title="Edit">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button onClick={handleDelete}
          className="p-1.5 rounded-md text-ink-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
