import { Wrench, Clock, AlertTriangle, CheckCircle2, MessageSquare, Plus, ShieldCheck, Zap, History, Settings, MapPin, Search, Filter } from 'lucide-react';
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
  High: 'bg-rose-500/10 text-rose-400',
  Medium: 'bg-amber-500/10 text-amber-400',
  Low: 'bg-emerald-500/10 text-emerald-400'
};

const statusStyles = {
  'Open': 'bg-white/5 text-slate-400',
  'Scheduled': 'bg-brand-accent/20 text-brand-accent',
  'In Progress': 'bg-blue-500/20 text-blue-400',
  'Resolved': 'bg-emerald-500/20 text-emerald-400'
};

export default function TenantMaintenance() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Maintenance Requests</h1>
          <p className="text-slate-400 mt-1">Track your repair requests and maintenance history</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3 active-gradient rounded-xl text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-accent/20 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          New Request
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-accent transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search your requests..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-brand-accent transition-all"
          />
        </div>
        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2">
          <Filter size={18} className="text-brand-accent" />
          Filter List
        </button>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {myRequests.map((request) => (
          <div key={request.id} className="glass-card p-6 rounded-2xl border border-white/5 group hover:border-brand-accent/20 transition-all flex flex-col">
            <div className="flex justify-between items-start mb-6">
               <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${priorityStyles[request.priority]}`}>
                    {request.priority}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{request.id}</span>
               </div>
               <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusStyles[request.status]}`}>
                 {request.status}
               </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-accent transition-colors">{request.title}</h3>
            <div className="flex items-center gap-2 mb-6">
               <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{request.category}</span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1 italic">
              "{request.desc}"
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
               <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Reported</span>
                  <span className="text-xs font-bold text-slate-400">{request.reported}</span>
               </div>
               <div className="flex gap-2">
                  {request.updates > 0 && (
                     <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <MessageSquare size={14} className="text-brand-accent" />
                        {request.updates} Updates
                     </div>
                  )}
                  <button className="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white text-[10px] font-bold uppercase tracking-widest transition-all">
                     Details
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
