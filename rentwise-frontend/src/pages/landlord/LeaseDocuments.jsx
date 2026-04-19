import { FileText, UploadCloud, Download, ShieldCheck, Clock, AlertCircle, Search, Filter, MoreVertical, File } from 'lucide-react';
import { useState } from 'react';

const documents = [
  { id: 'DOC-101', title: 'Lease Agreement', property: 'Sea View Apartment 4B', tenant: 'Rahul Verma', type: 'PDF', size: '2.4 MB', status: 'Authorized', date: '01 Jan 2024' },
  { id: 'DOC-102', title: 'Security Deposit Receipt', property: 'Green Park Villa 02', tenant: 'Priya Singh', type: 'PDF', size: '1.1 MB', status: 'Verified', date: '15 Mar 2024' },
  { id: 'DOC-103', title: 'Operational Lease V2', property: 'Riverside Duplex A1', tenant: 'Siddharth Rao', type: 'PDF', size: '3.5 MB', status: 'Expiring', date: '01 Aug 2023' },
  { id: 'DOC-104', title: 'KYC Document (Aadhar)', property: 'Tech Hub Studio 11', tenant: 'Amit Patel', type: 'IMG', size: '0.8 MB', status: 'Verified', date: '05 Feb 2024' },
];

export default function LandlordDocuments() {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Lease Documents</h1>
          <p className="text-slate-400 mt-1">Manage and store all rental agreements and records</p>
        </div>
        <button 
          onClick={() => setShowUpload(true)}
          className="px-6 py-3 active-gradient rounded-xl text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-accent/20 transition-all flex items-center gap-2"
        >
          <UploadCloud size={18} />
          Upload New Document
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-accent transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by title, property or tenant..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-brand-accent transition-all"
          />
        </div>
        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2">
          <Filter size={18} className="text-brand-accent" />
          Filter Vault
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div key={doc.id} className="glass-card p-6 rounded-2xl border border-white/5 group hover:border-brand-accent/20 transition-all flex flex-col">
            <div className="flex justify-between items-start mb-6">
               <div className="p-3 bg-brand-accent/10 rounded-xl text-brand-accent">
                  <FileText size={24} />
               </div>
               <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                    doc.status === 'Authorized' || doc.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {doc.status}
                  </span>
                  <button className="text-slate-500 hover:text-white transition-all">
                     <MoreVertical size={18} />
                  </button>
               </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-brand-accent transition-colors line-clamp-1">{doc.title}</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">{doc.id} • {doc.size} {doc.type}</p>

            <div className="bg-white/5 p-4 rounded-xl border border-white/5 mb-6 space-y-3">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Property</span>
                  <span className="text-xs font-bold text-slate-300">{doc.property}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tenant</span>
                  <span className="text-xs font-bold text-slate-300">{doc.tenant}</span>
               </div>
            </div>

            <div className="flex items-center justify-between mt-auto">
               <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Uploaded</span>
                  <span className="text-xs font-bold text-slate-400">{doc.date}</span>
               </div>
               <button className="p-2.5 bg-white/5 hover:bg-brand-accent text-white rounded-xl border border-white/10 hover:border-brand-accent transition-all shadow-lg group/btn">
                  <Download size={18} className="group-hover/btn:-translate-y-0.5 transition-transform" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
