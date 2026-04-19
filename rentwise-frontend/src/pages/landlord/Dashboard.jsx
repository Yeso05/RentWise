import { Users, Building2, CreditCard, Wrench, IndianRupee, ArrowUpRight, TrendingUp, Clock, Wallet, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const stats = [
  { label: 'Total Properties', value: '12', icon: Building2, trend: '+2 this month', color: 'text-brand-purple' },
  { label: 'Total Tenants', value: '48', icon: Users, trend: '+5 this month', color: 'text-blue-400' },
  { label: 'Monthly Revenue', value: '₹4,85,000', icon: IndianRupee, trend: '+12% vs last month', color: 'text-brand-cyan' },
  { label: 'Pending Repairs', value: '06', icon: Wrench, trend: '2 high priority', color: 'text-amber-400' },
];

const activities = [
  { id: 1, title: 'Rent Received', desc: 'Sea View Apartment - Unit 4B', time: '2 hours ago', amount: '+ ₹85,000', type: 'payment' },
  { id: 2, title: 'New Maintenance Request', desc: 'Green Park Villa - Plumbing', time: '5 hours ago', status: 'Pending', type: 'maintenance' },
  { id: 3, title: 'Lease Renewed', desc: 'Rahul Verma - Studio 11', time: 'Yesterday', type: 'lease' },
  { id: 4, title: 'Payment Overdue', desc: 'Tech Hub Studio - Unit 02', time: '2 days ago', amount: '₹25,000', type: 'alert' },
];

export default function LandlordDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('rentwise_name') || 'Vikram Sharma';

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-10 shadow-2xl border border-white/5 group">
        <img 
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1920" 
          alt="Apartment Portfolio" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-bg via-brand-bg/80 to-transparent" />
        
        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-brand-accent/20 border border-brand-accent/30 text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em] mb-4">
               Portfolio Overview
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none mb-4">
              Real Estate <br /><span className="text-brand-accent">Control Center</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-medium max-w-md leading-relaxed">
              Welcome back, {userName.split(' ')[0]}. All systems are operational. Your portfolio yield is up 12% this cycle.
            </p>
          </div>
          
          <div className="absolute bottom-8 right-8 flex items-center gap-3">
            <button className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
              Generate PDF Report
            </button>
            <button className="px-6 py-3 active-gradient rounded-xl text-white text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-brand-accent/40 transition-all">
              Initialize New Asset
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl border border-white/5">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.trend}</span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className={`text-2xl font-bold ${stat.label.includes('Revenue') ? 'text-brand-cyan' : 'text-white'}`}>
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-white/5 flex flex-col">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-bold text-white uppercase tracking-widest text-xs">Recent Activity</h3>
            <button className="text-[10px] font-bold text-brand-accent uppercase tracking-widest hover:text-white transition-colors">View All</button>
          </div>
          <div className="flex-1 p-6 space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    activity.type === 'payment' ? 'bg-emerald-500/10 text-emerald-400' :
                    activity.type === 'maintenance' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-brand-accent/10 text-brand-accent'
                  }`}>
                    {activity.type === 'payment' ? <TrendingUp size={18} /> : 
                     activity.type === 'maintenance' ? <Wrench size={18} /> : 
                     <Clock size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-brand-accent transition-colors">{activity.title}</p>
                    <p className="text-xs text-slate-500">{activity.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  {activity.amount && (
                    <p className={`text-sm font-bold ${activity.type === 'alert' ? 'text-rose-400' : 'text-brand-cyan'}`}>
                      {activity.amount}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Summary */}
        <div className="space-y-8">
          <div className="glass-card rounded-2xl border border-white/5 p-6 active-gradient">
            <h3 className="font-bold text-white mb-2">Platform Status</h3>
            <p className="text-white/80 text-sm leading-relaxed mb-6">Your rental nodes are performing at optimal efficiency.</p>
            <div className="space-y-4">
              <div className="bg-white/10 p-3 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Server Uptime</span>
                <span className="text-xs font-bold text-white">99.9%</span>
              </div>
              <div className="bg-white/10 p-3 rounded-xl flex items-center justify-center">
                <span className="text-xs font-bold text-white uppercase tracking-widest">Active Identity</span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-white/5 p-6">
             <h3 className="font-bold text-white uppercase tracking-widest text-xs mb-6">Occupancy Rate</h3>
             <div className="relative h-4 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                <div className="absolute top-0 left-0 h-full w-[85%] active-gradient rounded-full" />
             </div>
             <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <span>Allocated</span>
                <span className="text-white">85%</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
