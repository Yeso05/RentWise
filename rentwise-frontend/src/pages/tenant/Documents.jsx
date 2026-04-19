import { FileText, Download, ShieldCheck, Clock, CheckCircle2, AlertCircle, FileKey, ShieldAlert, Search, Filter } from 'lucide-react';
import { useState } from 'react';

const myDocuments = [
  { id: 'DOC-901', title: 'Lease Agreement', type: 'PDF', size: '2.4 MB', status: 'Verified', expiry: '31 Dec 2024' },
  { id: 'DOC-902', title: 'Rent Receipt - March', type: 'PDF', size: '0.5 MB', status: 'Verified', expiry: 'N/A' },
  { id: 'DOC-903', title: 'Identity Proof (Aadhar)', type: 'IMG', size: '0.8 MB', status: 'Verified', expiry: 'N/A' },
  { id: 'DOC-904', title: 'Property Rules', type: 'PDF', size: '1.2 MB', status: 'Verified', expiry: 'N/A' }
];

export default function TenantDocuments() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">My Documents</h1>
          <p className="text-slate-400 mt-1">Access your lease agreements, receipts and KYC documents</p>
        </div>
        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all flex items-center gap-2">
          <Download size={18} className="text-brand-accent" />
          Download All
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-accent transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search documents..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-brand-accent transition-all"
          />
        </div>
        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2 text-slate-300">
          <Filter size={18} className="text-brand-accent" />
          Filter
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myDocuments.map((doc) => (
          <div key={doc.id} className="glass-card p-6 rounded-2xl border border-white/5 group hover:border-brand-accent/20 transition-all flex flex-col">
            <div className="flex items-start justify-between mb-6">
               <div className="p-4 bg-brand-accent/10 rounded-xl text-brand-accent border border-brand-accent/10 group-hover:scale-110 transition-transform">
                  <FileText size={24} />
               </div>
               <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{doc.type}</span>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{doc.size}</span>
               </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-accent transition-colors truncate">{doc.title}</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">{doc.id}</p>

            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Verified</span>
               </div>
               <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                  <Download size={18} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
