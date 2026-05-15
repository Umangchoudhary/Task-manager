import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Vault from './pages/Vault';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Router>
      <div className="min-h-screen bg-background text-white font-sans">
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
        }} />
        <Routes>
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/vault" element={<Vault />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
