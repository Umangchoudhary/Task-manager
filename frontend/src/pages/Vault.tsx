import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Key, Globe, Plus, Trash2, Edit3, Copy, Eye, EyeOff, Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const Vault = () => {
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCred, setEditingCred] = useState<any>(null);
  const [showPassword, setShowPassword] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: ''
  });

  const fetchCredentials = async () => {
    try {
      const res = await api.get('/credentials');
      setCredentials(res.data);
    } catch (error) {
      toast.error('Failed to fetch vault items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const togglePassword = (id: string) => {
    setShowPassword((prev: any) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCred) {
        await api.put(`/credentials/${editingCred._id}`, formData);
        toast.success('Credential updated');
      } else {
        await api.post('/credentials', formData);
        toast.success('Credential added to vault');
      }
      setShowModal(false);
      setEditingCred(null);
      setFormData({ title: '', username: '', password: '', url: '', notes: '' });
      fetchCredentials();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this credential?')) {
      try {
        await api.delete(`/credentials/${id}`);
        toast.success('Removed from vault');
        fetchCredentials();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const filteredCredentials = credentials.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Team Vault</h1>
          <p className="text-gray-400 mt-1">Securely manage your project IDs and passwords.</p>
        </div>
        <button 
          onClick={() => { setEditingCred(null); setFormData({ title: '', username: '', password: '', url: '', notes: '' }); setShowModal(true); }}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/20 font-semibold"
        >
          <Plus className="w-5 h-5" /> Add Credential
        </button>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search vault..." 
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary/50 transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCredentials.map((cred, index) => (
            <motion.div
              key={cred._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass p-6 rounded-2xl hover:bg-white/5 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/20 rounded-xl text-primary">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold">{cred.title}</h3>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingCred(cred); setFormData(cred); setShowModal(true); }} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(cred._id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Username / ID</p>
                  <div className="flex justify-between items-center">
                    <code className="text-sm text-primary-light">{cred.username}</code>
                    <button onClick={() => handleCopy(cred.username, 'Username')} className="text-gray-500 hover:text-white">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Password</p>
                  <div className="flex justify-between items-center">
                    <code className="text-sm text-primary-light">
                      {showPassword[cred._id] ? cred.password : '••••••••••••'}
                    </code>
                    <div className="flex gap-2">
                      <button onClick={() => togglePassword(cred._id)} className="text-gray-500 hover:text-white">
                        {showPassword[cred._id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleCopy(cred.password, 'Password')} className="text-gray-500 hover:text-white">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {cred.url && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Globe className="w-4 h-4" />
                    <a href={cred.url.startsWith('http') ? cred.url : `https://${cred.url}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors truncate">
                      {cred.url}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredCredentials.length === 0 && (
        <div className="text-center py-20 glass rounded-2xl">
          <Key className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold">No credentials found</h3>
          <p className="text-gray-500">Add your first ID and password to the vault.</p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass w-full max-w-lg p-8 rounded-3xl relative z-10"
            >
              <h2 className="text-2xl font-bold mb-6">{editingCred ? 'Edit Credential' : 'Add New Credential'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Service Title</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. AWS Console, MongoDB Atlas" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Username / ID</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                    <input 
                      required
                      type="password" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">URL (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="https://example.com" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Notes (Optional)</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50 resize-none"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
                <div className="flex gap-4 mt-8">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white transition-all font-semibold shadow-lg shadow-primary/20"
                  >
                    {editingCred ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Vault;
