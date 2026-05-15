import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, FolderKanban, Users, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FolderKanban, label: 'Projects', path: '/projects' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: ShieldCheck, label: 'Vault', path: '/vault' },
    { icon: Users, label: 'Team', path: '/team' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 h-screen border-r border-white/10 glass hidden md:flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          TaskFlow
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
