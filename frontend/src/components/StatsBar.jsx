// import React from 'react';
// export function StatsBar({ stats }) {
//   if (!stats) return null;

//   const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

//   return (
//     <div className="grid grid-cols-3 gap-3 mb-6">
//       {[
//         { label: 'Total', value: stats.total, color: 'text-ink-900' },
//         { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
//         { label: 'Done', value: stats.completed, color: 'text-sage-600' },
//       ].map(({ label, value, color }) => (
//         <div key={label} className="card p-3 text-center">
//           <p className={`text-2xl font-display font-bold ${color}`}>{value}</p>
//           <p className="text-xs text-ink-400 mt-0.5 uppercase tracking-wide">{label}</p>
//         </div>
//       ))}

//       {/* Progress bar — spans full width */}
//       {stats.total > 0 && (
//         <div className="col-span-3 card px-4 py-3">
//           <div className="flex items-center justify-between text-xs text-ink-500 mb-2">
//             <span>Progress</span>
//             <span className="font-medium text-ink-700">{pct}%</span>
//           </div>
//           <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
//             <div
//               className="h-full bg-ink-900 rounded-full transition-all duration-700"
//               style={{ width: `${pct}%` }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React from 'react';

export function StatsBar({ stats }) {
  if (!stats) return null;
  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {[
        { label: 'Total',   value: stats.total,     color: 'text-ink-900' },
        { label: 'Pending', value: stats.pending,   color: 'text-amber-600' },
        { label: 'Done',    value: stats.completed, color: 'text-sage-600' },
      ].map(({ label, value, color }) => (
        <div key={label} className="card p-3 text-center">
          <p className={`text-2xl font-display font-bold ${color}`}>{value}</p>
          <p className="text-xs text-ink-400 mt-0.5 uppercase tracking-wide">{label}</p>
        </div>
      ))}
      {stats.total > 0 && (
        <div className="col-span-3 card px-4 py-3">
          <div className="flex items-center justify-between text-xs text-ink-500 mb-2">
            <span>Progress</span>
            <span className="font-medium text-ink-700">{pct}%</span>
          </div>
          <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
            <div className="h-full bg-ink-900 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}