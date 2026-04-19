import { Wrench, Clock, AlertTriangle, CheckCircle2, MessageSquare, MapPin, Plus, Filter, Search, MoreVertical, Zap } from 'lucide-react';
import { useState } from 'react';

const maintenanceRequests = [
  {
    id: 'REQ-101',
    title: 'Water leaking from AC Unit',
    property: 'Sea View Apartment 4B',
    tenant: 'Rahul Verma',
    date: '2 hours ago',
    priority: 'High',
    status: 'In Progress',
    category: 'Plumbing'
  },
  {
    id: 'REQ-102',
    title: 'Broken window latch',
    property: 'Green Park Villa 02',
    tenant: 'Priya Singh',
    date: '1 day ago',
    priority: 'Low',
    status: 'Open',
    category: 'Carpentry'
  },
  {
    id: 'REQ-103',
    title: 'Main door lock jammed',
    property: 'Tech Hub Studio 11',
    tenant: 'Amit Patel',
    date: '2 days ago',
    priority: 'Medium',
    status: 'Open',
    category: 'Security'
  }
];

const priorityStyles = {
  High: 'bg-rose-500/10 text-rose-400',
  Medium: 'bg-amber-500/10 text-amber-400',
  Low: 'bg-emerald-500/10 text-emerald-400'
};

const statusStyles = {
  'Open': 'bg-white/5 text-slate-400',
  'In Progress': 'bg-brand-accent/20 text-brand-accent',
  'Resolved': 'bg-emerald-500/20 text-emerald-400'
};

export default function LandlordMaintenance() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Maintenance Requests</h1>
          <p className="text-slate-400 mt-1">Track and manage property repair requests</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3 active-gradient rounded-xl text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-accent/20 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Log New Request
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-accent transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search requests by property or tenant..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-brand-accent transition-all"
          />
        </div>
        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2">
          <Filter size={18} className="text-brand-accent" />
          More Filters
        </button>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {maintenanceRequests.map((request) => (
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
            <p className="text-slate-400 text-sm flex items-center gap-2 mb-6">
              <MapPin size={14} className="text-brand-accent" />
              {request.property}
            </p>

            <div className="bg-white/5 p-4 rounded-xl border border-white/5 mb-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold text-xs">
                        {request.tenant[0]}
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Tenant</p>
                        <p className="text-xs font-bold text-white">{request.tenant}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Reported</p>
                     <p className="text-xs font-bold text-slate-400">{request.date}</p>
                  </div>
               </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
               <div className="flex items-center gap-2">
                  <Wrench size={16} className="text-brand-accent" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{request.category}</span>
               </div>
               <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white text-[10px] font-bold uppercase tracking-widest transition-all">
                  View Details
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
