import { Building2, IndianRupee, Wrench, AlertCircle, ArrowRight, Calendar, User, MapPin, CheckCircle2, Zap, Clock, FileText, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TenantDashboard() {
  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("rentwise_user") || "{}");
  const userName = user.name || 'Resident';

  useEffect(() => {
    if (user.email) {
      fetch(`http://localhost:5000/api/tenants/${user.email}`)
        .then(res => res.json())
        .then(data => {
          setTenantData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching tenant property:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user.email]);

  const property = tenantData?.property;

  const myKpis = [
    { title: 'Due Date', value: '10 Apr 2024', label: 'Next Payment', icon: <Calendar className="text-brand-accent" />, color: 'bg-purple-500/10' },
    { title: 'Monthly Rent', value: property ? `₹${property.rent.toLocaleString()}` : '₹0', label: property ? property.title : 'No Asset Linked', icon: <IndianRupee className="text-brand-cyan" />, color: 'bg-emerald-500/10' },
    { title: 'Active Requests', value: '01', label: 'Maintenance', icon: <Wrench className="text-amber-500" />, color: 'bg-amber-500/10' },
    { title: 'Documents', value: '04', label: 'Lease & KYC', icon: <FileText className="text-blue-500" />, color: 'bg-blue-500/10' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="text-brand-accent animate-spin" size={40} />
        <p className="text-slate-400 font-medium tracking-widest text-xs uppercase">Synchronizing Residency...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-10 shadow-2xl border border-white/5 group">
        <img 
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1920" 
          alt="Resident Portal" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-bg via-brand-bg/80 to-transparent" />
        
        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-brand-cyan/20 border border-brand-cyan/30 text-[10px] font-bold text-brand-cyan uppercase tracking-[0.2em] mb-4">
               {property ? 'Active Residency' : 'Onboarding Pending'}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none mb-4">
              Welcome Home, <br /><span className="text-brand-accent">{userName.split(' ')[0]}</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-medium max-w-md leading-relaxed">
              {property ? (
                <>Your primary node <span className="text-white">{property.title}</span> is fully operational. Next settlement due in 7 days.</>
              ) : (
                <>Please contact your landlord to link your residency to an active property asset.</>
              )}
            </p>
          </div>
          
          <div className="absolute bottom-8 right-8 flex items-center gap-3">
             <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                <MapPin size={16} className="text-brand-accent" />
                {property ? property.location : 'Location TBD'}
             </div>
             <button className="px-6 py-3 active-gradient rounded-xl text-white text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-brand-accent/40 transition-all flex items-center gap-2">
                Settlement Console
                <ArrowRight size={16} />
             </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {myKpis.map((kpi, idx) => (
          <div key={idx} className="glass-card p-6 rounded-2xl border border-white/5 hover:border-brand-accent/20 transition-all group">
            <div className="flex items-center justify-between mb-6">
               <div className={`p-3 rounded-xl ${kpi.color}`}>
                  {kpi.icon}
               </div>
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{kpi.title}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-1">{kpi.value}</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Payments */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white">Recent Payments</h2>
            <button className="text-brand-accent text-xs font-bold uppercase tracking-wider hover:underline">View History</button>
          </div>

          <div className="space-y-4">
            {[ 
               { month: 'March Rent', amount: property ? `₹${property.rent.toLocaleString()}` : '₹0', status: 'Paid', date: '05 Mar 2024' },
               { month: 'February Rent', amount: property ? `₹${property.rent.toLocaleString()}` : '₹0', status: 'Paid', date: '04 Feb 2024' },
               { month: 'January Rent', amount: property ? `₹${property.rent.toLocaleString()}` : '₹0', status: 'Paid', date: '05 Jan 2024' }
            ].map((p, i) => (
               <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all group/item">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-brand-accent border border-white/5">
                     <Clock size={20} />
                   </div>
                   <div>
                     <p className="font-bold text-white group-hover/item:text-brand-accent transition-colors">{p.month}</p>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{p.date}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-lg font-bold text-brand-cyan tracking-tight">{p.amount}</p>
                   <div className="flex items-center gap-1.5 justify-end mt-0.5">
                      <CheckCircle2 size={12} className="text-emerald-400" />
                      <span className="text-[9px] font-bold uppercase text-emerald-400 tracking-widest">{p.status}</span>
                   </div>
                 </div>
               </div>
            ))}
          </div>
        </div>

        {/* Support & Maintenance */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white">Support</h2>
            <div className="p-2 bg-brand-accent/10 rounded-lg text-brand-accent">
               <Wrench size={18} />
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6 bg-white/5 rounded-2xl border border-white/5">
             <div className="p-4 bg-white/5 rounded-full border border-white/10 shadow-xl">
                <AlertCircle size={32} className="text-brand-accent" />
             </div>
             <div>
                <p className="font-bold text-white mb-2">Main door lock jammed</p>
                <span className="px-4 py-1 rounded-full bg-brand-accent/20 text-brand-accent text-[10px] font-bold uppercase tracking-widest border border-brand-accent/20">
                   In Progress
                </span>
                <p className="text-xs text-slate-500 mt-4 font-medium italic">"Technician Arriving Tomorrow 10AM"</p>
             </div>
             <button className="w-full py-3.5 rounded-xl active-gradient text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-brand-accent/20 transition-all">
                Project Dossier
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
