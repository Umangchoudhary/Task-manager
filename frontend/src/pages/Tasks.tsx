import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, MoreVertical } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const Tasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', projectId: '', assignedTo: '', priority: 'Medium' });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'Admin';

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects'),
        api.get('/auth/users')
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map((t: any) => t._id === taskId ? { ...t, status: newStatus } : t));
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.projectId) {
      toast.error('Please select a project');
      return;
    }
    try {
      await api.post('/tasks', newTask);
      toast.success('Task created successfully');
      setIsModalOpen(false);
      setNewTask({ title: '', description: '', projectId: '', assignedTo: '', priority: 'Medium' });
      fetchData();
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const columns = ['Pending', 'In Progress', 'Completed'];

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Low': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Tasks Board</h1>
          <p className="text-gray-400 mt-1">Manage your workflow</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center bg-surface border border-white/10 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input type="text" placeholder="Search tasks..." className="bg-transparent border-none outline-none text-sm w-32 md:w-48" />
          </div>
          <button className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition flex items-center justify-center">
            <Filter className="w-5 h-5 text-gray-400" />
          </button>
          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-primary rounded-lg flex items-center gap-2 hover:bg-primary/90 transition text-white font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>
      ) : (
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-max h-full">
            {columns.map(status => (
              <div key={status} className="w-80 flex flex-col glass rounded-xl p-4 border-t-4 border-t-primary/50 h-[calc(100vh-220px)] overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold">{status}</h3>
                  <span className="bg-white/10 px-2 py-0.5 rounded text-xs">
                    {tasks.filter((t: any) => t.status === status).length}
                  </span>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar pb-4">
                  {tasks.filter((t: any) => t.status === status).map((task: any) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={task._id}
                      className="bg-surface border border-white/10 p-4 rounded-xl shadow-lg hover:border-primary/30 transition-all group cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <div className="relative">
                          <select 
                            className="bg-transparent text-xs text-gray-400 outline-none cursor-pointer opacity-0 group-hover:opacity-100 absolute right-0 top-0 w-6 h-6"
                            value={task.status}
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          >
                            <option value="Pending" className="bg-surface">Pending</option>
                            <option value="In Progress" className="bg-surface">In Progress</option>
                            <option value="Completed" className="bg-surface">Completed</option>
                          </select>
                          <div className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical className="w-4 h-4"/></div>
                        </div>
                      </div>
                      <h4 className="font-semibold text-white mb-1">{task.title}</h4>
                      <p className="text-xs text-gray-400 line-clamp-2 mb-3">{task.description}</p>
                      <div className="flex justify-between items-center pt-3 border-t border-white/5">
                        <div className="text-xs text-gray-500 max-w-[120px] truncate">
                          {task.projectId?.title || 'Unknown Project'}
                        </div>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-primary flex items-center justify-center text-[10px] font-bold">
                          {task.createdBy?.name?.charAt(0) || 'U'}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-background border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 bg-background border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  rows={2}
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Project</label>
                  <select
                    required
                    className="w-full px-4 py-2 bg-background border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    value={newTask.projectId}
                    onChange={(e) => setNewTask({...newTask, projectId: e.target.value})}
                  >
                    <option value="">Select Project</option>
                    {projects.map((p: any) => (
                      <option key={p._id} value={p._id}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Assign To</label>
                  <select
                    className="w-full px-4 py-2 bg-background border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                  >
                    <option value="">Unassigned</option>
                    {users.map((u: any) => (
                      <option key={u._id} value={u._id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                <select
                  className="w-full px-4 py-2 bg-background border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary rounded-lg hover:bg-primary/90 transition text-white"
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
