import { MessageSquare, Plus, Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

const myRequests = [
  {
    id: 'REQ-501',
    title: 'Main Door Lock Jammed',
    reported: '2 days ago',
    priority: 'High',
    status: 'Scheduled',
    category: 'Security',
    updates: 2,
    desc: 'The main door lock is difficult to turn and occasionally gets stuck completely.'
  },
  {
    id: 'REQ-482',
    title: 'Kitchen Tap Leakage',
    reported: '2 weeks ago',
    priority: 'Low',
    status: 'Resolved',
    category: 'Plumbing',
    updates: 1,
    desc: 'Minor water leakage from the kitchen sink tap.'
  }
];

const priorityStyles = {
  High: 'rw-pill rw-pill-rose',
  Medium: 'rw-pill rw-pill-amber',
  Low: 'rw-pill rw-pill-emerald'
};

const statusStyles = {
  'Open': 'rw-pill',
  'Scheduled': 'rw-pill rw-pill-stone',
  'In Progress': 'rw-pill rw-pill-amber',
  'Resolved': 'rw-pill rw-pill-emerald'
};

export default function TenantMaintenance() {
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterActive, setFilterActive] = useState(false);

  const displayedRequests = filterActive 
    ? myRequests.filter(req => req.status !== 'Resolved')
    : myRequests;

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--navy)] tracking-tight">Maintenance Requests</h1>
          <p className="rw-muted mt-1">Track your repair requests and maintenance history</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="rw-btn-primary text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <Plus size={18} />
          New Request
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-subtle)]" size={18} />
          <input 
            type="text" 
            placeholder="Search your requests..."
            className="rw-input rw-input-icon-left"
          />
        </div>
        <button 
          onClick={() => setFilterActive(!filterActive)} 
          className={`rw-btn-secondary text-sm font-medium flex items-center gap-2 ${filterActive ? 'border-[var(--navy)] text-[var(--navy)]' : ''}`}
        >
          <Filter size={18} className={filterActive ? 'text-[var(--navy)]' : 'text-[var(--stone)]'} />
          {filterActive ? 'Clear Filters' : 'Filter Active'}
        </button>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayedRequests.map((request) => (
         <div key={request.id} className="rw-card p-6 group hover:border-[var(--stone-light)] transition-all flex flex-col">
            <div className="flex justify-between items-start mb-6">
               <div className="flex items-center gap-3">
              <span className={`${priorityStyles[request.priority]}`}>
                    {request.priority}
                  </span>
              <span className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest">{request.id}</span>
               </div>
            <span className={`${statusStyles[request.status]}`}>
                 {request.status}
               </span>
            </div>

          <h3 className="text-xl font-bold text-[var(--navy)] mb-2 group-hover:text-[var(--stone)] transition-colors">{request.title}</h3>
            <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--stone)]" />
            <span className="text-xs font-bold text-[var(--ink-subtle)] uppercase tracking-widest">{request.category}</span>
            </div>

          <p className="rw-muted text-sm leading-relaxed mb-6 flex-1 italic">
              "{request.desc}"
            </p>

          <div className="flex items-center justify-between pt-6 border-t border-[var(--gray-pale)]">
               <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest leading-none mb-1">Reported</span>
              <span className="text-xs font-bold text-[var(--ink-subtle)]">{request.reported}</span>
               </div>
               <div className="flex gap-2">
                  {request.updates > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[rgba(28,47,63,0.03)] rounded-lg border border-[var(--gray-pale)] text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest">
                  <MessageSquare size={14} className="text-[var(--stone)]" />
                        {request.updates} Updates
                     </div>
                  )}
              <button onClick={() => setSelectedRequest(request)} className="rw-btn-secondary text-[10px] uppercase tracking-widest">
                     Details
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[rgba(28,47,63,0.25)] backdrop-blur-sm">
           <div className="w-full max-w-lg rw-panel p-10 animate-fade-in-up relative">
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 rounded-lg text-[var(--ink-subtle)] hover:text-[var(--navy)] transition-all"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold text-[var(--navy)] mb-8">Submit New Request</h2>
              
              <form onSubmit={(e) => { e.preventDefault(); setShowModal(false); }} className="space-y-6">
                 <div>
                    <label className="rw-label-text mb-2 block">Issue Title</label>
                    <input type="text" placeholder="e.g., Leaking kitchen sink" className="rw-input" required />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="rw-label-text mb-2 block">Category</label>
                       <select className="rw-select appearance-none h-[54px]" required>
                          <option value="Plumbing">Plumbing</option>
                          <option value="Electrical">Electrical</option>
                          <option value="HVAC">HVAC</option>
                          <option value="Security">Security</option>
                          <option value="Other">Other</option>
                       </select>
                    </div>
                    <div>
                       <label className="rw-label-text mb-2 block">Priority Level</label>
                       <select className="rw-select appearance-none h-[54px]" required>
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                       </select>
                    </div>
                 </div>
                 <div>
                    <label className="rw-label-text mb-2 block">Description</label>
                    <textarea rows="4" placeholder="Provide details about the issue..." className="rw-input resize-none" required></textarea>
                 </div>
                 <button type="submit" className="w-full rw-btn-primary mt-4 uppercase tracking-widest text-xs">
                   Submit Maintenance Request
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
              <p className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest mb-6">ID: {selectedRequest.id} • {selectedRequest.category}</p>
              
              <div className="bg-[rgba(28,47,63,0.03)] p-6 rounded-xl border border-[var(--gray-pale)] mb-6">
                 <p className="text-sm text-[var(--navy)] leading-relaxed italic">"{selectedRequest.desc}"</p>
              </div>
              
              <div className="flex justify-between items-center text-xs text-[var(--ink-subtle)] font-bold uppercase tracking-widest">
                 <span>Reported: {selectedRequest.reported}</span>
                 <span>Updates: {selectedRequest.updates}</span>
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
