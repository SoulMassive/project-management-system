import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import Dashboard from './pages/Dashboard';
import ClientsPage from './pages/ClientsPage';
import ClientDetailPage from './pages/ClientDetailPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import TasksPage from './pages/TasksPage';
import FilesPage from './pages/FilesPage';
import TeamPage from './pages/TeamPage';
import HomePage from './pages/HomePage';
import PrivateRoute from './components/auth/PrivateRoute';
import { selectCurrentUser } from './features/auth/authSlice';

/**
 * SmartRoot — sends logged-in users straight to /dashboard,
 * everyone else sees the public HomePage.
 */
const SmartRoot = () => {
  const user = useSelector(selectCurrentUser);
  return user ? <Navigate to="/dashboard" replace /> : <HomePage />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/"        element={<SmartRoot />} />
        <Route path="/login"   element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes — all wrapped in Layout (sidebar + topbar) */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/projects">
              <Route index element={<ProjectsPage />} />
              <Route path=":id" element={<ProjectDetailPage />} />
            </Route>

            <Route path="/clients" element={<PrivateRoute allowedRoles={['Admin', 'Manager', 'Sales']} />}>
              <Route index element={<ClientsPage />} />
              <Route path=":id" element={<ClientDetailPage />} />
            </Route>

            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/files" element={<FilesPage />} />

            <Route path="/team" element={<PrivateRoute allowedRoles={['Admin', 'Manager']} />}>
              <Route index element={<TeamPage />} />
            </Route>

            <Route path="/reports" element={<PrivateRoute allowedRoles={['Admin', 'Manager']} />}>
              <Route index element={<div className="p-8 text-neutral">Reports coming soon.</div>} />
            </Route>

            <Route path="/settings" element={<PrivateRoute allowedRoles={['Admin']} />}>
              <Route index element={<AdminPage />} />
            </Route>
          </Route>
        </Route>

        {/* Catch-all: unknown URLs → go home (SmartRoot handles redirect) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
