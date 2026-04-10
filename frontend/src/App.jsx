// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import { LoginPage, RegisterPage } from './pages/AuthPage';
// import { DashboardPage } from './pages/DashboardPage';

// function ProtectedRoute({ children }) {
//   const { user, loading } = useAuth();
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <svg className="animate-spin h-8 w-8 text-ink-300 mx-auto" viewBox="0 0 24 24" fill="none">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
//           </svg>
//           <p className="text-sm text-ink-400 mt-3 font-body">Loading...</p>
//         </div>
//       </div>
//     );
//   }
//   return user ? children : <Navigate to="/login" replace />;
// }

// function PublicRoute({ children }) {
//   const { user, loading } = useAuth();
//   if (loading) return null;
//   return user ? <Navigate to="/" replace /> : children;
// }

// function AppRoutes() {
//   return (
//     <Routes>
//       <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
//       <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
//       <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <AppRoutes />
//         <Toaster
//           position="bottom-right"
//           toastOptions={{
//             style: {
//               fontFamily: '"DM Sans", system-ui, sans-serif',
//               fontSize: '13px',
//               background: '#2a2722',
//               color: '#f4f3f0',
//               borderRadius: '10px',
//               padding: '10px 14px',
//             },
//             success: { iconTheme: { primary: '#4a7f4a', secondary: '#fff' } },
//             error: { iconTheme: { primary: '#e24b4a', secondary: '#fff' } },
//           }}
//         />
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage, RegisterPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-ink-300 mx-auto" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <p className="text-sm text-ink-400 mt-3 font-body">Loading...</p>
        </div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: '"DM Sans", system-ui, sans-serif',
              fontSize: '13px',
              background: '#2a2722',
              color: '#f4f3f0',
              borderRadius: '10px',
              padding: '10px 14px',
            },
            success: { iconTheme: { primary: '#4a7f4a', secondary: '#fff' } },
            error: { iconTheme: { primary: '#e24b4a', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}