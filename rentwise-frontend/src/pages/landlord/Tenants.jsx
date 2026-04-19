import { useState } from 'react';
import { Mail, Phone, Calendar, Building, IndianRupee, MoreVertical, Search, UserPlus, X, ShieldCheck, ArrowRight, MapPin, Filter, Plus, CheckCircle2 } from 'lucide-react';

const tenants = [
  { id: 1, name: 'Rahul Verma', property: 'Sea View Apartment 4B', email: 'rahul.v@gmail.com', phone: '+91 98765 43210', status: 'Active', joined: '15 Jan 2024' },
  { id: 2, name: 'Priya Singh', property: 'Green Park Villa 02', email: 'priya.s@outlook.com', phone: '+91 91234 56789', status: 'Active', joined: '10 Feb 2024' },
  { id: 3, name: 'Amit Patel', property: 'Tech Hub Studio 11', email: 'amit.p@company.com', phone: '+91 88776 55443', status: 'Pending', joined: '01 Mar 2024' },
  { id: 4, name: 'Sneha Reddy', property: 'Riverside Duplex A1', email: 'sneha.r@gmail.com', phone: '+91 77665 44332', status: 'Active', joined: '20 Dec 2023' },
];

export default function LandlordTenants() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Tenant Directory</h1>
          <p className="text-slate-400 mt-1">Manage active residents and guest profiles</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3 active-gradient rounded-xl text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-accent/20 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Assign New Tenant
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-accent transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, property or contact..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-brand-accent transition-all"
          />
        </div>
        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2">
          <Filter size={18} className="text-brand-accent" />
          More Filters
        </button>
      </div>

      {/* Tenant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map((tenant) => (
          <div key={tenant.id} className="glass-card p-6 rounded-2xl border border-white/5 group hover:border-brand-accent/20 transition-all">
            <div className="flex items-start justify-between mb-6">
               <div className="w-14 h-14 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold text-xl group-hover:scale-110 transition-transform">
                  {tenant.name.split(' ').map(n => n[0]).join('')}
               </div>
               <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                 tenant.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
               }`}>
                 {tenant.status}
               </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-accent transition-colors">{tenant.name}</h3>
            <p className="text-slate-400 text-sm flex items-center gap-2 mb-6">
              <MapPin size={14} className="text-brand-accent" />
              {tenant.property}
            </p>

            <div className="space-y-4 border-t border-white/5 pt-6 mb-8">
               <div className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                  <Mail size={16} className="text-brand-accent/60" />
                  <span className="text-xs font-semibold">{tenant.email}</span>
               </div>
               <div className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                  <Phone size={16} className="text-brand-accent/60" />
                  <span className="text-xs font-semibold">{tenant.phone}</span>
               </div>
               <div className="flex items-center gap-3 text-slate-400">
                  <Calendar size={16} className="text-brand-accent/60" />
                  <span className="text-xs font-semibold uppercase tracking-widest">Joined {tenant.joined}</span>
               </div>
            </div>

            <div className="flex gap-3">
               <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white text-xs font-bold uppercase tracking-widest border border-white/5 transition-all">
                  Profile
               </button>
               <button className="flex-1 py-3 bg-brand-accent/10 hover:bg-brand-accent text-white rounded-xl text-xs font-bold uppercase tracking-widest border border-brand-accent/20 transition-all">
                  Message
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Onboarding Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-bg/80 backdrop-blur-md">
          <div className="w-full max-w-2xl glass-card p-10 rounded-2xl border border-white/10 shadow-2xl animate-fade-in-up relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-2 rounded-lg bg-white/5 text-slate-500 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight">Initialize Resident Identity</h2>
              <p className="text-slate-500 text-sm mt-1">Deploy new tenant node after offline agreement</p>
            </div>

            <form className="space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Legal Name</label>
                  <input type="text" placeholder="e.g. Rahul Verma" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-brand-accent transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Email Node</label>
                  <input type="email" placeholder="rahul@gmail.com" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-brand-accent transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Contact Phone</label>
                  <input type="text" placeholder="+91 98765 43210" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-brand-accent transition-all" />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Dashboard Password</label>
                   <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-brand-accent transition-all" />
                </div>
              </div>

              <div className="space-y-6 pt-4 border-t border-white/5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Assign Asset</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-brand-accent transition-all appearance-none bg-slate-900/50">
                    <option className="bg-slate-900">Sea View Apartment 4B</option>
                    <option className="bg-slate-900">Green Park Villa 02</option>
                    <option className="bg-slate-900">Tech Hub Studio 11</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Monthly Rent (₹)</label>
                    <input type="text" placeholder="25,000" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-brand-accent transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Lease Start</label>
                    <input type="date" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-accent transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Lease End</label>
                    <input type="date" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-accent transition-all" />
                  </div>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full py-4 active-gradient text-white font-bold rounded-xl shadow-xl shadow-brand-accent/20 mt-6 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                <span>Authorize & Initialize Identity</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
