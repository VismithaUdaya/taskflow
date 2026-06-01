import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

// Route guard: redirects to /login if not authenticated
function PrivateRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" replace />;
}

// Route guard: redirects to /dashboard if already authenticated
function PublicRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  return !token ? children : <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/login"
        element={<PublicRoute><LoginPage /></PublicRoute>}
      />
      <Route
        path="/register"
        element={<PublicRoute><RegisterPage /></PublicRoute>}
      />
      <Route
        path="/dashboard"
        element={<PrivateRoute><DashboardPage /></PrivateRoute>}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
