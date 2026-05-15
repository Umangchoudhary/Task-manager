import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, FolderKanban,
  TrendingUp, BarChart2,
  CheckSquare, Plus, ArrowRight,
  ShieldCheck, UserPlus
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PageWrapper from '../components/PageWrapper';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    taskCompletionRate: 0,
  });

  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'Admin';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/tasks/stats');
        setStats(res.data);
      } catch (error) {
        console.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const pieData = [
    { name: 'Completed', value: stats.completedTasks, color: '#22c55e' },
    { name: 'Pending', value: stats.pendingTasks, color: '#f59e0b' },
    { name: 'Overdue', value: stats.overdueTasks, color: '#ef4444' },
  ];

  const barData = [
    { name: 'Mon', tasks: 4 },
    { name: 'Tue', tasks: 7 },
    { name: 'Wed', tasks: 5 },
    { name: 'Thu', tasks: 8 },
    { name: 'Fri', tasks: 12 },
    { name: 'Sat', tasks: 3 },
    { name: 'Sun', tasks: 2 },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  }

  const StatCard = ({ title, value, icon: Icon, colorClass, delay }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="glass p-6 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer border border-white/5"
    >
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold">{value}</h3>
      </div>
      <div className={`p-4 rounded-xl ${colorClass} shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </motion.div>
  );

  return (
    <PageWrapper>
      <div className="space-y-8 pb-10">
        {/* Welcome Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent border border-primary/20"
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Good day, <span className="text-primary">{user.name}</span>! ✨
              </h1>
              <p className="text-gray-400 max-w-md">
                {isAdmin 
                  ? "You have full control over the team's productivity today. Keep the momentum going!"
                  : "Check your assigned tasks and keep track of your progress. You're doing great!"}
              </p>
            </div>
            <div className="flex gap-3">
              {isAdmin ? (
                <>
                  <Link to="/projects" className="px-6 py-3 bg-primary rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition shadow-lg shadow-primary/20">
                    <Plus className="w-5 h-5" /> New Project
                  </Link>
                  <Link to="/team" className="px-6 py-3 glass rounded-xl font-bold flex items-center gap-2 hover:bg-white/5 transition">
                    <UserPlus className="w-5 h-5" /> Invite Team
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/tasks" className="px-6 py-3 bg-primary rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition shadow-lg shadow-primary/20">
                    <CheckSquare className="w-5 h-5" /> My Tasks
                  </Link>
                  <Link to="/vault" className="px-6 py-3 glass rounded-xl font-bold flex items-center gap-2 hover:bg-white/5 transition">
                    <ShieldCheck className="w-5 h-5" /> Open Vault
                  </Link>
                </>
              )}
            </div>
          </div>
          {/* Decorative background shapes */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Projects" value={stats.totalProjects} icon={FolderKanban} colorClass="bg-blue-500/80" delay={0.1} />
          <StatCard title="Total Tasks" value={stats.totalTasks} icon={CheckSquare} colorClass="bg-purple-500/80" delay={0.2} />
          <StatCard title="Task Completion" value={`${stats.taskCompletionRate}%`} icon={TrendingUp} colorClass="bg-green-500/80" delay={0.3} />
          <StatCard title="Overdue Tasks" value={stats.overdueTasks} icon={AlertTriangle} colorClass="bg-red-500/80" delay={0.4} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass p-6 rounded-3xl col-span-1 lg:col-span-2 border border-white/5"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-primary" />
                Team Performance
              </h3>
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs outline-none focus:border-primary/50 transition-colors">
                <option value="weekly" className="bg-surface">Weekly</option>
                <option value="monthly" className="bg-surface">Monthly</option>
              </select>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
                  />
                  <Bar dataKey="tasks" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass p-6 rounded-3xl border border-white/5"
          >
            <h3 className="text-xl font-bold mb-8">Task Allocation</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-4">
              {pieData.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-300">{item.name}</span>
                  </div>
                  <span className="font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Help/Tip for Member vs Admin */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-6 glass rounded-2xl border border-primary/10 flex flex-col md:flex-row items-center gap-4 group cursor-help"
        >
          <div className="p-3 bg-primary/20 rounded-xl text-primary group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold">Pro Tip:</h4>
            <p className="text-sm text-gray-400">
              {isAdmin 
                ? "You can click on any project card to see detailed team performance and manage specific task assignments."
                : "Always check the Vault before starting a new project task to ensure you have the correct credentials."}
            </p>
          </div>
          <div className="ml-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="w-5 h-5" />
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
