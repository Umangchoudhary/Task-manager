import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, FolderKanban, Users, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState<{title: string, description: string, teamMembers: string[]}>({ title: '', description: '', teamMembers: [] });
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'Admin';

  const fetchData = async () => {
    try {
      const [projectsRes, usersRes] = await Promise.all([
        api.get('/projects'),
        api.get('/auth/users')
      ]);
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

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      toast.success('Project created successfully');
      setIsModalOpen(false);
      setNewProject({ title: '', description: '', teamMembers: [] });
      fetchData();
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  const toggleMember = (userId: string) => {
    const members = [...newProject.teamMembers];
    if (members.includes(userId)) {
      setNewProject({ ...newProject, teamMembers: members.filter(id => id !== userId) });
    } else {
      setNewProject({ ...newProject, teamMembers: [...members, userId] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Projects</h1>
          <p className="text-gray-400 mt-1">Manage your team projects</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary rounded-lg flex items-center gap-2 hover:bg-primary/90 transition text-white font-medium shadow-lg shadow-primary/20"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={project._id}
              className="glass p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <FolderKanban className="w-6 h-6 text-primary" />
                </div>
                <div className="flex -space-x-2">
                  {project.teamMembers.slice(0, 3).map((m: any) => (
                    <div key={m._id} title={m.name} className="w-8 h-8 rounded-full border-2 border-surface bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-[10px] font-bold">
                      {m.name.charAt(0)}
                    </div>
                  ))}
                  {project.teamMembers.length > 3 && (
                    <div className="w-8 h-8 rounded-full border-2 border-surface bg-gray-800 flex items-center justify-center text-[10px] font-bold">
                      +{project.teamMembers.length - 3}
                    </div>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-2 mb-6 h-10">{project.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{project.teamMembers.length} Members</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Created by {project.createdBy?.name}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="Enter project name"
                  className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  placeholder="Describe the project goals"
                  className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  rows={3}
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Team Members</label>
                <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {users.filter((u: any) => u._id !== user._id).map((u: any) => (
                    <label key={u._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{u.name}</p>
                          <p className="text-[10px] text-gray-500">{u.email}</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded-md border-white/10 bg-transparent text-primary focus:ring-primary"
                        checked={newProject.teamMembers.includes(u._id)}
                        onChange={() => toggleMember(u._id)}
                      />
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 bg-primary rounded-xl hover:bg-primary/90 transition text-white font-bold shadow-lg shadow-primary/20"
                >
                  Create Project
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Projects;
