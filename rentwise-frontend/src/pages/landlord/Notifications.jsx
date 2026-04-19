import { Bell, IndianRupee, Wrench, FileText, CheckCircle, AlertCircle, X, Clock, Trash2 } from 'lucide-react';
import { useState } from 'react';

const allNotifications = [
  { id: 1, type: 'payment', title: 'Payment Received', message: 'Rahul Verma paid ₹85,000 for Sea View Apartment 4B.', time: '2 hours ago', read: false },
  { id: 2, type: 'alert', title: 'Payment Overdue', message: "Siddharth Rao's payment of ₹65,000 is 7 days overdue.", time: '5 hours ago', read: false },
  { id: 3, type: 'maintenance', title: 'Maintenance Request', message: 'Priya Singh raised a plumbing request for Green Park Villa 02.', time: '8 hours ago', read: false },
  { id: 4, type: 'lease', title: 'Lease Expiring', message: "Siddharth Rao's lease expires in 30 days.", time: '1 day ago', read: false },
  { id: 5, type: 'payment', title: 'Payment Received', message: 'Neha Gupta paid ₹25,000 for Tech Hub Studio 09.', time: '1 day ago', read: true },
];

const typeStyles = {
  payment: { icon: IndianRupee, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  alert: { icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  maintenance: { icon: Wrench, color: 'text-brand-accent', bg: 'bg-brand-accent/10' },
  lease: { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
};

const tabs = ['All', 'Unread', 'Payments', 'Maintenance', 'Alerts'];

export default function LandlordNotifications() {
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState(allNotifications);

  const filtered = notifications.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return !n.read;
    if (activeTab === 'Payments') return n.type === 'payment';
    if (activeTab === 'Maintenance') return n.type === 'maintenance';
    if (activeTab === 'Alerts') return n.type === 'alert';
    return true;
  });

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const deleteNotif = (id) => setNotifications(prev => prev.filter(n => n.id !== id));
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Notifications</h1>
          <p className="text-slate-400 mt-1">Stay updated with property and tenant activities</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button 
              onClick={markAllRead}
              className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <CheckCircle size={18} className="text-brand-accent" />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
              activeTab === tab
                ? 'active-gradient text-white border-transparent shadow-lg shadow-brand-accent/20'
                : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/10 hover:text-slate-300'
            }`}
          >
            {tab}
            {tab === 'Unread' && unreadCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-brand-accent text-[10px] text-white">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-20 glass-card border border-white/5 rounded-2xl">
            <Bell size={48} className="mx-auto text-slate-700 mb-4 opacity-50" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No notifications found</p>
          </div>
        ) : (
          filtered.map(n => {
            const style = typeStyles[n.type];
            const Icon = style.icon;
            return (
              <div 
                key={n.id} 
                className={`glass-card p-5 rounded-2xl border transition-all flex items-start gap-5 relative group ${
                  n.read ? 'bg-white/[0.01] border-white/5 opacity-60' : 'bg-white/[0.03] border-brand-accent/20'
                }`}
              >
                <div className={`p-4 rounded-xl ${style.bg} ${style.color} flex-shrink-0`}>
                  <Icon size={24} />
                </div>
                
                <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-bold tracking-tight ${n.read ? 'text-slate-400' : 'text-white'}`}>{n.title}</h3>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={12} />
                        {n.time}
                      </span>
                   </div>
                   <p className={`text-sm leading-relaxed mb-0 ${n.read ? 'text-slate-500' : 'text-slate-300'}`}>
                      {n.message}
                   </p>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                     onClick={() => deleteNotif(n.id)}
                     className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                   >
                      <Trash2 size={16} />
                   </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
