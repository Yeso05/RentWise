import { IndianRupee, TrendingUp, AlertCircle, ArrowUpToLine, ShieldCheck, Search, CheckCircle, Clock, Wallet, History, Download, Filter, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const myPayments = [
  { id: 'PAY-1001', amount: '25,000', date: '01 Apr 2024', status: 'Paid', method: 'UPI', type: 'Monthly Rent' },
  { id: 'PAY-1002', amount: '2,500', date: '28 Mar 2024', status: 'Verified', method: 'Bank Transfer', type: 'Maintenance' },
  { id: 'PAY-1003', amount: '25,000', date: '25 Feb 2024', status: 'Paid', method: 'Card', type: 'Monthly Rent' },
  { id: 'PAY-1004', amount: '25,000', date: '24 Jan 2024', status: 'Paid', method: 'UPI', type: 'Monthly Rent' },
  { id: 'PAY-1005', amount: '15,000', date: '15 Jan 2024', status: 'Paid', method: 'Bank Transfer', type: 'Security Deposit' },
];

export default function TenantPayments() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Rent Payments</h1>
          <p className="text-slate-400 mt-1">Manage your rental payments and transaction history</p>
        </div>
        <button className="px-6 py-3 active-gradient rounded-xl text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-accent/20 transition-all flex items-center gap-2">
          <Wallet size={18} />
          Pay Rent Now
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
           <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                 <Clock size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Next Due</span>
           </div>
           <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Upcoming Payment</p>
              <h2 className="text-3xl font-bold text-white tracking-tight">₹25,000</h2>
              <p className="text-xs text-amber-400 font-bold mt-4 uppercase tracking-widest">Due on 10 April 2024</p>
           </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
           <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-brand-accent/10 text-brand-accent rounded-xl">
                 <ShieldCheck size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Paid</span>
           </div>
           <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Settlement</p>
              <h2 className="text-3xl font-bold text-white tracking-tight">₹1,25,000</h2>
              <p className="text-xs text-slate-400 font-bold mt-4 uppercase tracking-widest">Year to Date 2024</p>
           </div>
        </div>
      </div>

      {/* History Table */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white">Payment History</h2>
          <div className="flex items-center gap-4">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-accent transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search payments..."
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
                <th className="px-6 py-4">Purpose</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {myPayments.map((tx) => (
                 <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                   <td className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">{tx.id}</td>
                   <td className="px-6 py-5">
                      <span className="text-sm font-bold text-white">{tx.type}</span>
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
                          tx.status === 'Paid' || tx.status === 'Verified' ? 'bg-emerald-400' : 'bg-amber-400'
                        }`} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                          tx.status === 'Paid' || tx.status === 'Verified' ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                   </td>
                   <td className="px-6 py-5 text-center">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                        <Download size={16} />
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
