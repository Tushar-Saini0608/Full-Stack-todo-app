
import React, { useState, useEffect } from 'react';

const PRIORITIES = [
  { value: 'low',    label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high',   label: 'High' },
];

// Parse an ISO datetime string into { date: 'YYYY-MM-DD', time: 'HH:MM' }
function parseDateTime(isoString) {
  if (!isoString) return { date: '', time: '' };
  const d = new Date(isoString);
  if (isNaN(d)) return { date: '', time: '' };
  const date = d.toLocaleDateString('en-CA');           // YYYY-MM-DD
  const time = d.toTimeString().slice(0, 5);            // HH:MM
  return { date, time };
}

// Combine date + time strings into a full ISO string
function buildDateTime(date, time) {
  if (!date) return null;
  const combined = time ? `${date}T${time}:00` : `${date}T00:00:00`;
  return new Date(combined).toISOString();
}

export function TodoForm({ onSubmit, onClose, initialData = null }) {
  const isEdit = !!initialData;
  const [form, setForm] = useState({
    title:       '',
    description: '',
    priority:    'medium',
    due_date:    '',   // YYYY-MM-DD
    due_time:    '',   // HH:MM
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      const { date, time } = parseDateTime(initialData.due_date);
      setForm({
        title:       initialData.title       || '',
        description: initialData.description || '',
        priority:    initialData.priority    || 'medium',
        due_date:    date,
        due_time:    time,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      await onSubmit({
        title:       form.title,
        description: form.description,
        priority:    form.priority,
        due_date:    buildDateTime(form.due_date, form.due_time),
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const today = new Date().toISOString().split('T')[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm animate-fade-in" />

      <div className="relative w-full max-w-md card shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100">
          <h2 className="font-display text-lg font-semibold text-ink-900">
            {isEdit ? 'Edit task' : 'New task'}
          </h2>
          <button onClick={onClose} className="btn-ghost p-1.5 -mr-1.5 rounded-lg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1.5 uppercase tracking-wide">
              Task title <span className="text-red-400">*</span>
            </label>
            <input
              className="input-base text-base"
              type="text"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={set('title')}
              required
              autoFocus
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1.5 uppercase tracking-wide">
              Description
            </label>
            <textarea
              className="input-base resize-none"
              rows={3}
              placeholder="Add more details..."
              value={form.description}
              onChange={set('description')}
              maxLength={1000}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1.5 uppercase tracking-wide">
              Priority
            </label>
            <div className="flex gap-2">
              {PRIORITIES.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, priority: p.value }))}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all duration-150
                    ${form.priority === p.value
                      ? p.value === 'high'   ? 'bg-red-50 border-red-300 text-red-700'
                      : p.value === 'medium' ? 'bg-amber-50 border-amber-300 text-amber-700'
                                             : 'bg-sage-50 border-sage-300 text-sage-700'
                      : 'bg-white border-ink-200 text-ink-500 hover:border-ink-300'
                    }`}
                >
                  {p.value === 'high' ? '🔴' : p.value === 'medium' ? '🟡' : '🟢'} {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date + Time */}
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1.5 uppercase tracking-wide">
              Due date &amp; time
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Date picker */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-400 pointer-events-none"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input
                  className="input-base pl-9 text-sm"
                  type="date"
                  value={form.due_date}
                  onChange={set('due_date')}
                  min={today}
                />
              </div>

              {/* Time picker */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-400 pointer-events-none"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <input
                  className={`input-base pl-9 text-sm ${!form.due_date ? 'opacity-40 cursor-not-allowed' : ''}`}
                  type="time"
                  value={form.due_time}
                  onChange={set('due_time')}
                  disabled={!form.due_date}
                />
              </div>
            </div>

            {/* Helper text */}
            {form.due_date && (
              <p className="text-xs text-ink-400 mt-1.5 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {form.due_time
                  ? `Due ${form.due_date} at ${form.due_time}`
                  : `Due ${form.due_date} — no specific time set`}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="btn-ghost flex-1 py-2.5 border border-ink-200">
              Cancel
            </button>
            <button type="submit" disabled={loading || !form.title.trim()}
              className="btn-primary flex-1 py-2.5">
              {loading
                ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                : isEdit ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
