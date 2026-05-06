import { FileText, UploadCloud, Download, Search, Filter, MoreVertical, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LandlordDocuments() {
  // eslint-disable-next-line no-unused-vars
  const [showUpload, setShowUpload] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeases();
  }, []);

  const fetchLeases = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/leases');
      const data = await res.json();
      setLeases(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching leases:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getStatusColor = (start, end) => {
    if (!end) return 'bg-[rgba(107,114,128,0.12)]';
    const now = new Date();
    const endDate = new Date(end);
    const daysLeft = Math.floor((endDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return 'bg-[rgba(244,63,94,0.12)]'; // Expired
    if (daysLeft < 30) return 'bg-[rgba(251,146,60,0.12)]'; // Expiring soon
    return 'bg-[rgba(16,185,129,0.12)]'; // Active
  };

  const handleDownload = (doc) => {
    const content = `LEASE AGREEMENT (LEASE-${doc.id})\\nPeriod: ${formatDate(doc.start_date)} to ${formatDate(doc.end_date)}\\nRent Amount: ₹${doc.rent_amount}\\n\\nTerms and conditions apply.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lease_Agreement_${doc.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--navy)] tracking-tight">Lease Documents</h1>
          <p className="rw-muted mt-1">Manage and store all rental agreements and records</p>
        </div>
        <button 
          onClick={() => setShowUpload(true)}
          className="rw-btn-primary text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <UploadCloud size={18} />
          Upload New Document
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-subtle)]" size={18} />
          <input 
            type="text" 
            placeholder="Search by property or lease period..."
            className="rw-input rw-input-icon-left"
          />
        </div>
        <button className="rw-btn-secondary text-sm font-medium flex items-center gap-2">
          <Filter size={18} className="text-[var(--stone)]" />
          Filter Documents
        </button>
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="text-[var(--stone)] animate-spin" size={40} />
          <p className="rw-muted font-medium tracking-widest text-xs uppercase">Loading Leases...</p>
        </div>
      ) : leases.length === 0 ? (
        <div className="rw-panel p-20 text-center">
          <div className="w-20 h-20 bg-[rgba(28,47,63,0.05)] rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText size={40} className="text-[var(--ink-subtle)]" />
          </div>
          <h3 className="text-2xl font-bold text-[var(--navy)] mb-2">No Leases Found</h3>
          <p className="rw-muted max-w-xs mx-auto">No active leases yet. Create your first lease to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leases.map((doc) => (
           <div key={doc.id} className={`rw-card p-6 group hover:border-[var(--stone-light)] transition-all flex flex-col ${getStatusColor(doc.start_date, doc.end_date)}`}>
              <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-[rgba(181,155,114,0.12)] rounded-xl text-[var(--navy)]">
                    <FileText size={24} />
                 </div>
                 <div className="flex items-center gap-2 relative">
                <span className={`rw-pill ${
                  new Date(doc.end_date) > new Date() ? 'rw-pill-emerald' : 'rw-pill-rose'
                }`}>
                      {new Date(doc.end_date) > new Date() ? 'Active' : 'Expired'}
                    </span>
                <div className="relative">
                  <button onClick={() => toggleDropdown(doc.id)} className="text-[var(--ink-subtle)] hover:text-[var(--navy)] transition-all">
                         <MoreVertical size={18} />
                      </button>
                  {activeDropdown === doc.id && (
                    <div className="absolute right-0 top-6 w-36 bg-white rounded-lg shadow-lg border border-[var(--gray-pale)] py-2 z-10 animate-fade-in-up">
                      <button onClick={() => { setActiveDropdown(null); handleDownload(doc); }} className="w-full text-left px-4 py-2 text-xs font-bold text-[var(--navy)] hover:bg-[rgba(181,155,114,0.12)] transition-colors">
                        Download Copy
                      </button>
                      <button onClick={() => { setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-[#0F766E] hover:bg-[rgba(16,185,129,0.12)] transition-colors">
                        Renew Lease
                      </button>
                    </div>
                  )}
                </div>
                 </div>
              </div>

            <h3 className="text-lg font-bold text-[var(--navy)] mb-1 group-hover:text-[var(--stone)] transition-colors line-clamp-1">Lease Agreement</h3>
            <p className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest mb-6">LEASE-{doc.id}</p>

            <div className="bg-[rgba(28,47,63,0.03)] p-4 rounded-xl border border-[var(--gray-pale)] mb-6 space-y-3">
                 <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest">Period</span>
                <span className="text-xs font-bold text-[var(--navy)]">{formatDate(doc.start_date)} - {formatDate(doc.end_date)}</span>
                 </div>
                 <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest">Rent Amount</span>
                <span className="text-xs font-bold text-[var(--navy)]">₹{parseFloat(doc.rent_amount).toLocaleString('en-IN')}</span>
                 </div>
              </div>

              <div className="flex items-center justify-between mt-auto">
                 <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest leading-none mb-1">Created</span>
                <span className="text-xs font-bold text-[var(--ink-subtle)]">{formatDate(doc.created_at)}</span>
                 </div>
              <button onClick={() => handleDownload(doc)} className="p-2.5 bg-[rgba(28,47,63,0.03)] hover:bg-[rgba(181,155,114,0.18)] text-[var(--navy)] rounded-xl border border-[var(--gray-pale)] transition-all shadow-sm group/btn">
                    <Download size={18} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
