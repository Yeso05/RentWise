import { Wrench, MapPin, Plus, Filter, Search, Loader2, X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const priorityStyles = {
  High: 'rw-pill rw-pill-rose',
  Medium: 'rw-pill rw-pill-amber',
  Low: 'rw-pill rw-pill-emerald'
};

const statusStyles = {
  'Open': 'rw-pill',
  'In Progress': 'rw-pill rw-pill-stone',
  'Resolved': 'rw-pill rw-pill-emerald'
};

export default function LandlordMaintenance() {
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    property_id: '',
    tenant_id: ''
  });

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/maintenance');
      const data = await res.json();
      setMaintenance(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching maintenance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          priority: formData.priority,
          status: 'Open'
        })
      });

      if (res.ok) {
        setShowModal(false);
        fetchMaintenance();
        setFormData({
          title: '',
          description: '',
          priority: 'Medium',
          property_id: '',
          tenant_id: ''
        });
      }
    } catch (error) {
      console.error('Error creating maintenance request:', error);
    }
  };

  const getTimeAgo = (date) => {
    if (!date) return 'N/A';
    const now = new Date();
    const diff = now - new Date(date);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    if (days < 30) return `${days} days ago`;
    return new Date(date).toLocaleDateString('en-IN');
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--navy)] tracking-tight">Maintenance Requests</h1>
          <p className="rw-muted mt-1">Track and manage property repair requests</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="rw-btn-primary text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <Plus size={18} />
          Log New Request
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-subtle)]" size={18} />
          <input 
            type="text" 
            placeholder="Search requests by property or tenant..."
            className="rw-input rw-input-icon-left"
          />
        </div>
        <button className="rw-btn-secondary text-sm font-medium flex items-center gap-2">
          <Filter size={18} className="text-[var(--stone)]" />
          Filter Tickets
        </button>
      </div>

      {/* Requests Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="text-[var(--stone)] animate-spin" size={40} />
          <p className="rw-muted font-medium tracking-widest text-xs uppercase">Loading Maintenance Requests...</p>
        </div>
      ) : maintenance.length === 0 ? (
        <div className="rw-panel p-20 text-center">
          <div className="w-20 h-20 bg-[rgba(28,47,63,0.05)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Wrench size={40} className="text-[var(--ink-subtle)]" />
          </div>
          <h3 className="text-2xl font-bold text-[var(--navy)] mb-2">No Maintenance Requests</h3>
          <p className="rw-muted max-w-xs mx-auto">No maintenance issues reported yet. Great!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {maintenance.map((request) => (
           <div key={request.id} className="rw-card p-6 group hover:border-[var(--stone-light)] transition-all flex flex-col">
              <div className="flex justify-between items-start mb-6">
                 <div className="flex items-center gap-3">
                <span className={`${priorityStyles[request.priority] || 'rw-pill'}`}>
                      {request.priority}
                    </span>
                <span className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest">REQ-{request.id}</span>
                 </div>
              <span className={`${statusStyles[request.status] || 'rw-pill'}`}>
                   {request.status}
                 </span>
              </div>

            <h3 className="text-xl font-bold text-[var(--navy)] mb-2 group-hover:text-[var(--stone)] transition-colors">{request.title}</h3>
            <p className="rw-muted text-sm mb-6">{request.description}</p>

            <div className="bg-[rgba(28,47,63,0.03)] p-4 rounded-xl border border-[var(--gray-pale)] mb-6">
                 <div className="flex items-center justify-between">
                    <div>
                    <p className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest leading-none mb-1">Reported</p>
                    <p className="text-xs font-bold text-[var(--ink-subtle)]">{getTimeAgo(request.created_at)}</p>
                    </div>
                 </div>
              </div>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-[var(--gray-pale)]">
                 <div className="flex items-center gap-2">
                <Wrench size={16} className="text-[var(--stone)]" />
                <span className="text-xs font-bold text-[var(--ink-subtle)] uppercase tracking-widest">Pending</span>
                 </div>
              <button onClick={() => setSelectedRequest(request)} className="rw-btn-secondary text-[10px] uppercase tracking-widest">
                    View Details
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Maintenance Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[rgba(28,47,63,0.25)] backdrop-blur-sm">
          <div className="w-full max-w-2xl rw-panel p-10 animate-fade-in-up relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-2 rounded-lg text-[var(--ink-subtle)] hover:text-[var(--navy)] transition-all"
            >
              <X size={20} />
            </button>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[var(--navy)] tracking-tight">Log Maintenance Request</h2>
              <p className="rw-muted text-sm mt-1">Report a new issue that needs attention</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="rw-label-text mb-2 block">Issue Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Water leak in bathroom" 
                    className="rw-input"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="rw-label-text mb-2 block">Priority Level</label>
                  <select 
                    className="rw-select appearance-none"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="rw-label-text mb-2 block">Description</label>
                <textarea 
                  placeholder="Provide details about the issue..." 
                  className="rw-input resize-none" 
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full rw-btn-primary mt-6 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                <span>Log Maintenance Request</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[rgba(28,47,63,0.25)] backdrop-blur-sm">
           <div className="w-full max-w-lg rw-panel p-10 animate-fade-in-up relative">
              <button 
                onClick={() => setSelectedRequest(null)}
                className="absolute top-6 right-6 p-2 rounded-lg text-[var(--ink-subtle)] hover:text-[var(--navy)] transition-all"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                 <span className={`${priorityStyles[selectedRequest.priority]}`}>{selectedRequest.priority}</span>
                 <span className={`${statusStyles[selectedRequest.status]}`}>{selectedRequest.status}</span>
              </div>
              
              <h2 className="text-2xl font-bold text-[var(--navy)] mb-2">{selectedRequest.title}</h2>
              <p className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest mb-6">
                 ID: REQ-{selectedRequest.id}
              </p>
              
              <div className="bg-[rgba(28,47,63,0.03)] p-6 rounded-xl border border-[var(--gray-pale)] mb-6">
                 <p className="text-sm text-[var(--navy)] leading-relaxed italic">"{selectedRequest.description}"</p>
              </div>
              
              <div className="space-y-4">
                 <div className="flex justify-between items-center py-2 border-b border-[var(--gray-pale)]">
                    <span className="text-sm font-bold text-[var(--ink-subtle)]">Property ID</span>
                    <span className="text-sm font-bold text-[var(--navy)]">{selectedRequest.property_id || 'N/A'}</span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-b border-[var(--gray-pale)]">
                    <span className="text-sm font-bold text-[var(--ink-subtle)]">Tenant ID</span>
                    <span className="text-sm font-bold text-[var(--navy)]">{selectedRequest.tenant_id || 'N/A'}</span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-b border-[var(--gray-pale)]">
                    <span className="text-sm font-bold text-[var(--ink-subtle)]">Reported On</span>
                    <span className="text-sm font-bold text-[var(--navy)]">{new Date(selectedRequest.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                 </div>
              </div>
              
              <button 
                onClick={() => setSelectedRequest(null)}
                className="w-full rw-btn-primary mt-8 uppercase tracking-widest text-xs"
              >
                Close Details
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
