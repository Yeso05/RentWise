import { IndianRupee, TrendingUp, AlertCircle, ArrowDownToLine, Download, Search, CheckCircle, Clock, ShieldCheck, Wallet, Filter, ExternalLink } from 'lucide-react';

const paymentHistory = [
  { id: 'TXN-1024', tenant: 'Rahul Verma', property: 'Sea View Apartment 4B', amount: '85,000', date: '01 Apr 2024', status: 'Settled', method: 'UPI' },
  { id: 'TXN-1023', tenant: 'Priya Singh', property: 'Green Park Villa 02', amount: '1,20,000', date: '28 Mar 2024', status: 'Processing', method: 'Bank Transfer' },
  { id: 'TXN-1022', tenant: 'Amit Patel', property: 'Tech Hub Studio 11', amount: '25,000', date: '25 Mar 2024', status: 'Settled', method: 'Card' },
  { id: 'TXN-1021', tenant: 'Siddharth Rao', property: 'Riverside Duplex A1', amount: '65,000', date: '15 Mar 2024', status: 'Arrears', method: 'Bank Transfer' },
];

const summaries = [
  { title: 'Total Revenue', amount: '₹8,45,000', label: 'Monthly', icon: <TrendingUp size={24} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { title: 'In-Transit', amount: '₹1,20,000', label: 'Pending', icon: <Clock size={24} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { title: 'Critical Arrears', amount: '₹65,000', label: 'Overdue', icon: <AlertCircle size={24} />, color: 'text-rose-400', bg: 'bg-rose-500/10' }
];

export default function LandlordPayments() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Payment Ledger</h1>
          <p className="text-slate-400 mt-1">Monitor rental income and transaction history</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all flex items-center gap-2">
            <Download size={18} className="text-brand-accent" />
            Export Report
          </button>
          <button className="px-5 py-2.5 active-gradient rounded-xl text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-accent/20 transition-all flex items-center gap-2">
            <Wallet size={18} />
            Payout Settings
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaries.map((summary, idx) => (
          <div key={idx} className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6">
               <div className={`p-3 rounded-xl ${summary.bg} ${summary.color}`}>
                  {summary.icon}
               </div>
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{summary.label}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{summary.title}</p>
              <h2 className="text-3xl font-bold text-white tracking-tight">{summary.amount}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
          <div className="flex items-center gap-4">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-accent transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search transactions..."
                  className="bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-brand-accent transition-all w-64"
                />
             </div>
             <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-500 hover:text-white transition-all">
                <Filter size={18} />
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Tenant</th>
                <th className="px-6 py-4">Property</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {paymentHistory.map((tx) => (
                 <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                   <td className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">{tx.id}</td>
                   <td className="px-6 py-5">
                      <span className="text-sm font-bold text-white">{tx.tenant}</span>
                   </td>
                   <td className="px-6 py-5">
                      <span className="text-xs text-slate-400 font-medium">{tx.property}</span>
                   </td>
                   <td className="px-6 py-5">
                      <span className="text-xs text-slate-400 font-medium">{tx.date}</span>
                   </td>
                   <td className="px-6 py-5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 py-1 rounded bg-white/5 border border-white/10">{tx.method}</span>
                   </td>
                   <td className="px-6 py-5">
                      <div className="flex items-center gap-1 text-brand-cyan font-bold text-lg tracking-tight">
                         <IndianRupee size={16} className="opacity-50" />
                         <span>{tx.amount}</span>
                      </div>
                   </td>
                   <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          tx.status === 'Settled' ? 'bg-emerald-400' :
                          tx.status === 'Processing' ? 'bg-amber-400 animate-pulse' : 'bg-rose-400'
                        }`} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                          tx.status === 'Settled' ? 'text-emerald-400' :
                          tx.status === 'Processing' ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                   </td>
                   <td className="px-6 py-5 text-center">
                      <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                        <ExternalLink size={16} />
                      </button>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
