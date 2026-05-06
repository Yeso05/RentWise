import { FileText, Download, Filter, Search, Shield, Eye } from 'lucide-react';

const myDocuments = [
  { id: 'DOC-901', title: 'Lease Agreement', type: 'PDF', size: '2.4 MB', status: 'Verified', expiry: '31 Dec 2024' },
  { id: 'DOC-902', title: 'Rent Receipt - March', type: 'PDF', size: '0.5 MB', status: 'Verified', expiry: 'N/A' },
  { id: 'DOC-903', title: 'Identity Proof (Aadhar)', type: 'IMG', size: '0.8 MB', status: 'Verified', expiry: 'N/A' },
  { id: 'DOC-904', title: 'Property Rules', type: 'PDF', size: '1.2 MB', status: 'Verified', expiry: 'N/A' }
];

export default function TenantDocuments() {
  const handleDownloadDocument = (doc) => {
    const content = `Content for ${doc.title} (${doc.id})\\nType: ${doc.type}\\nStatus: ${doc.status}\\nExpiry: ${doc.expiry}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/ /g, '_')}.${doc.type.toLowerCase() === 'img' ? 'txt' : 'pdf'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    myDocuments.forEach((doc, index) => {
      setTimeout(() => {
        handleDownloadDocument(doc);
      }, index * 500); // Stagger downloads slightly
    });
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--navy)] tracking-tight">My Documents</h1>
          <p className="rw-muted mt-1">Access your lease agreements, receipts and KYC documents</p>
        </div>
        <button onClick={handleDownloadAll} className="rw-btn-secondary text-xs uppercase tracking-wider flex items-center gap-2">
          <Download size={18} className="text-[var(--stone)]" />
          Download All
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-subtle)]" size={18} />
          <input 
            type="text" 
            placeholder="Search documents..."
            className="rw-input rw-input-icon-left"
          />
        </div>
        <button className="rw-btn-secondary text-sm font-medium flex items-center gap-2">
          <Filter size={18} className="text-[var(--stone)]" />
          Filter Documents
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myDocuments.map((doc) => (
         <div key={doc.id} className="rw-card p-6 group hover:border-[var(--stone-light)] transition-all flex flex-col">
            <div className="flex items-start justify-between mb-6">
            <div className="p-4 bg-[rgba(181,155,114,0.12)] rounded-xl text-[var(--navy)] border border-[var(--stone-light)] group-hover:scale-110 transition-transform">
                  <FileText size={24} />
               </div>
               <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest mb-1">{doc.type}</span>
              <span className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest">{doc.size}</span>
               </div>
            </div>

          <h3 className="text-lg font-bold text-[var(--navy)] mb-2 group-hover:text-[var(--stone)] transition-colors truncate">{doc.title}</h3>
          <p className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest mb-6">{doc.id}</p>

          <div className="mt-auto pt-6 border-t border-[var(--gray-pale)] flex items-center justify-between">
               <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F766E]">Verified</span>
               </div>
            <button onClick={() => handleDownloadDocument(doc)} className="p-2 text-[var(--ink-subtle)] hover:text-[var(--navy)] hover:bg-[rgba(28,47,63,0.04)] rounded-lg transition-all">
                  <Download size={18} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
