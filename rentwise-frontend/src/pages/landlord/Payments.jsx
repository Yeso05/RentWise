import { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, AlertCircle, Download, Search, Clock, Wallet, Filter, ExternalLink, Loader2, X } from 'lucide-react';

export default function LandlordPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/payments');
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    if (payments.length === 0) return alert("No transactions to export");
    const headers = ["Transaction ID", "Tenant", "Date", "Amount", "Status"];
    const rows = payments.map(tx => [
      `TXN-${tx.id}`,
      tx.tenant_name || 'Unknown',
      new Date(tx.payment_date).toLocaleDateString('en-IN'),
      tx.amount,
      tx.status
    ]);
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `payment_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculateSummaries = () => {
    const total = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    const pending = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    const arrears = payments.filter(p => p.status === 'Arrears').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

    return [
      { title: 'Total Revenue', amount: `₹${total.toLocaleString()}`, label: 'All Time', icon: <TrendingUp size={24} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
      { title: 'In-Transit', amount: `₹${pending.toLocaleString()}`, label: 'Pending', icon: <Clock size={24} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
      { title: 'Critical Arrears', amount: `₹${arrears.toLocaleString()}`, label: 'Overdue', icon: <AlertCircle size={24} />, color: 'text-rose-400', bg: 'bg-rose-500/10' }
    ];
  };

  const summaries = calculateSummaries();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'rw-pill-emerald';
      case 'Pending': return 'rw-pill-amber';
      case 'Arrears': return 'rw-pill-rose';
      default: return 'rw-pill-stone';
    }
  };

  const filteredPayments = payments.filter(tx => {
    const searchMatch = (tx.tenant_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                        `txn-${tx.id}`.includes(searchQuery.toLowerCase());
    const filterMatch = filterStatus === 'All' || tx.status === filterStatus;
    return searchMatch && filterMatch;
  });

  const toggleFilter = () => {
    const statuses = ['All', 'Paid', 'Pending', 'Arrears'];
    const idx = statuses.indexOf(filterStatus);
    setFilterStatus(statuses[(idx + 1) % statuses.length]);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--navy)] tracking-tight">Payment Ledger</h1>
          <p className="rw-muted mt-1">Monitor rental income and transaction history</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportReport} className="rw-btn-secondary text-xs uppercase tracking-wider flex items-center gap-2">
            <Download size={18} className="text-[var(--stone)]" />
            Export Report
          </button>
          <button onClick={() => setShowSettingsModal(true)} className="rw-btn-primary text-xs uppercase tracking-wider flex items-center gap-2">
            <Wallet size={18} />
            Payout Settings
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaries.map((summary, idx) => (
          <div key={idx} className="rw-card p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6">
               <div className={`p-3 rounded-xl ${summary.bg} ${summary.color}`}>
                  {summary.icon}
               </div>
               <span className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest">{summary.label}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--ink-subtle)] uppercase tracking-widest mb-1">{summary.title}</p>
              <h2 className="text-3xl font-bold text-[var(--navy)] tracking-tight">{summary.amount}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="rw-panel overflow-hidden">
        <div className="p-6 border-b border-[var(--gray-pale)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-[var(--navy)]">Recent Transactions</h2>
          <div className="flex items-center gap-4">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-subtle)]" size={16} />
                <input 
                  type="text" 
                  placeholder="Search transactions..."
                  className="rw-input py-2 pl-10 pr-4 text-xs w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             <button onClick={toggleFilter} className={`relative p-2 border rounded-lg transition-all ${filterStatus !== 'All' ? 'border-[var(--navy)] text-[var(--navy)]' : 'border-[var(--gray-pale)] text-[var(--ink-subtle)]'}`}>
                <Filter size={18} />
                {filterStatus !== 'All' && (
                  <span className="absolute -top-2 -right-2 bg-[var(--navy)] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                    {filterStatus}
                  </span>
                )}
             </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="text-[var(--stone)] animate-spin" size={40} />
            <p className="rw-muted font-medium tracking-widest text-xs uppercase">Loading Transactions...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-20 text-center">
            <p className="rw-muted">No transactions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left rw-table">
              <thead>
                <tr className="border-b border-[var(--gray-pale)]">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Tenant</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--gray-pale)]">
                 {filteredPayments.map((tx) => (
                   <tr key={tx.id} className="transition-colors group">
                     <td className="px-6 py-5 text-xs font-bold text-[var(--ink-subtle)] uppercase tracking-widest">TXN-{tx.id}</td>
                     <td className="px-6 py-5">
                        <span className="text-sm font-bold text-[var(--navy)]">{tx.tenant_name || 'Unknown'}</span>
                     </td>
                     <td className="px-6 py-5">
                        <span className="text-xs text-[var(--ink-subtle)] font-medium">{new Date(tx.payment_date).toLocaleDateString('en-IN')}</span>
                     </td>
                     <td className="px-6 py-5">
                        <div className="flex items-center gap-1 text-[#0F766E] font-bold text-lg tracking-tight">
                           <IndianRupee size={16} className="opacity-50" />
                           <span>{parseFloat(tx.amount).toLocaleString('en-IN')}</span>
                        </div>
                     </td>
                     <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            tx.status === 'Paid' ? 'bg-emerald-500' :
                            tx.status === 'Pending' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'
                          }`} />
                          <span className={`rw-pill ${getStatusColor(tx.status)}`}>
                            {tx.status}
                          </span>
                        </div>
                     </td>
                     <td className="px-6 py-5 text-center">
                        <button onClick={() => setSelectedTransaction(tx)} className="text-[var(--stone)] hover:text-[var(--navy)] transition-colors">
                           <ExternalLink size={16} />
                        </button>
                     </td>
                   </tr>
                 ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[rgba(28,47,63,0.25)] backdrop-blur-sm">
           <div className="w-full max-w-lg rw-panel p-10 animate-fade-in-up relative">
              <button 
                onClick={() => setSelectedTransaction(null)}
                className="absolute top-6 right-6 p-2 rounded-lg text-[var(--ink-subtle)] hover:text-[var(--navy)] transition-all"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-4 mb-8 border-b border-[var(--gray-pale)] pb-6">
                <div className={`p-4 rounded-xl ${selectedTransaction.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600' : selectedTransaction.status === 'Pending' ? 'bg-amber-500/10 text-amber-600' : 'bg-rose-500/10 text-rose-600'}`}>
                  {selectedTransaction.status === 'Paid' ? <TrendingUp size={32} /> : selectedTransaction.status === 'Pending' ? <Clock size={32} /> : <AlertCircle size={32} />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--navy)] tracking-tight">Transaction Details</h2>
                  <p className="text-xs font-bold text-[var(--ink-subtle)] uppercase tracking-widest mt-1">TXN-{selectedTransaction.id}</p>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                 <div className="flex justify-between items-center bg-[rgba(28,47,63,0.03)] p-4 rounded-xl border border-[var(--gray-pale)]">
                    <span className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest">Amount</span>
                    <div className="flex items-center gap-1.5 text-2xl font-bold text-[var(--navy)]">
                       <IndianRupee size={20} className="text-[var(--stone)]" />
                       {parseFloat(selectedTransaction.amount).toLocaleString('en-IN')}
                    </div>
                 </div>

                 <div className="flex justify-between items-center py-2 border-b border-[var(--gray-pale)]">
                    <span className="text-sm font-bold text-[var(--ink-subtle)]">Status</span>
                    <span className={`rw-pill ${getStatusColor(selectedTransaction.status)}`}>
                      {selectedTransaction.status}
                    </span>
                 </div>
                 
                 <div className="flex justify-between items-center py-2 border-b border-[var(--gray-pale)]">
                    <span className="text-sm font-bold text-[var(--ink-subtle)]">Tenant Name</span>
                    <span className="text-sm font-bold text-[var(--navy)]">{selectedTransaction.tenant_name || 'Unknown'}</span>
                 </div>

                 <div className="flex justify-between items-center py-2 border-b border-[var(--gray-pale)]">
                    <span className="text-sm font-bold text-[var(--ink-subtle)]">Payment Date</span>
                    <span className="text-sm font-bold text-[var(--navy)]">{new Date(selectedTransaction.payment_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                 </div>
              </div>

              <button 
                onClick={() => setSelectedTransaction(null)}
                className="w-full rw-btn-primary uppercase tracking-widest text-xs"
              >
                Close Details
              </button>
           </div>
        </div>
      )}

      {/* Payout Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[rgba(28,47,63,0.25)] backdrop-blur-sm">
           <div className="w-full max-w-lg rw-panel p-10 animate-fade-in-up relative">
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="absolute top-6 right-6 p-2 rounded-lg text-[var(--ink-subtle)] hover:text-[var(--navy)] transition-all"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-xl bg-[rgba(181,155,114,0.12)] text-[var(--navy)]">
                  <Wallet size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--navy)] tracking-tight">Payout Settings</h2>
                  <p className="text-xs font-bold text-[var(--ink-subtle)] uppercase tracking-widest mt-1">Configure your bank account</p>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setShowSettingsModal(false); }} className="space-y-5 text-left">
                 <div>
                    <label className="rw-label-text mb-2 block">Account Holder Name</label>
                    <input type="text" className="rw-input" defaultValue="Vikram Sharma" required />
                 </div>
                 <div>
                    <label className="rw-label-text mb-2 block">Bank Name</label>
                    <input type="text" className="rw-input" defaultValue="HDFC Bank" required />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="rw-label-text mb-2 block">Account Number</label>
                      <input type="password" className="rw-input" defaultValue="123456789" required />
                   </div>
                   <div>
                      <label className="rw-label-text mb-2 block">IFSC Code</label>
                      <input type="text" className="rw-input uppercase" defaultValue="HDFC0001234" required />
                   </div>
                 </div>
                 <button type="submit" className="w-full rw-btn-primary mt-4 uppercase tracking-widest text-xs">
                   Save Bank Details
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
