import { IndianRupee, Wrench, AlertCircle, ArrowRight, Calendar, MapPin, CheckCircle2, Clock, FileText, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TenantDashboard() {
  const navigate = useNavigate();
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  }, [user.email]);

  const property = tenantData?.property;

  const myKpis = [
    { title: 'Due Date', value: '10 Apr 2024', label: 'Next Payment', icon: <Calendar className="text-[var(--navy)]" />, color: 'bg-[rgba(181,155,114,0.12)]' },
    { title: 'Monthly Rent', value: property ? `₹${property.rent.toLocaleString()}` : '₹0', label: property ? property.title : 'No Asset Linked', icon: <IndianRupee className="text-[#0F766E]" />, color: 'bg-[rgba(16,185,129,0.12)]' },
    { title: 'Active Requests', value: '01', label: 'Maintenance', icon: <Wrench className="text-[#B45309]" />, color: 'bg-[rgba(245,158,11,0.12)]' },
    { title: 'Documents', value: '04', label: 'Lease & KYC', icon: <FileText className="text-[#1D4ED8]" />, color: 'bg-[rgba(59,130,246,0.12)]' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="text-[var(--stone)] animate-spin" size={40} />
        <p className="rw-muted font-medium tracking-widest text-xs uppercase">Synchronizing Residency...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-10 rw-panel group">
        <img 
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1920" 
          alt="Resident Portal" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-white/80" />
        
        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-2xl">
            <div className="rw-pill rw-pill-stone mb-4">
               {property ? 'Active Residency' : 'Onboarding Pending'}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-[var(--navy)] tracking-tight leading-none mb-4">
              Welcome Home, <br /><span className="text-[var(--stone)]">{userName.split(' ')[0]}</span>
            </h1>
            <p className="rw-muted text-sm md:text-base font-medium max-w-md leading-relaxed">
              {property ? (
                <>Your primary node <span className="text-[var(--navy)]">{property.title}</span> is fully operational. Next settlement due in 7 days.</>
              ) : (
                <>Please contact your landlord to link your residency to an active property asset.</>
              )}
            </p>
          </div>
          
          <div className="absolute bottom-8 right-8 flex items-center gap-3">
             <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/90 rounded-xl border border-[var(--gray-pale)] text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest">
                <MapPin size={16} className="text-[var(--stone)]" />
                {property ? property.location : 'Location TBD'}
             </div>
             <button onClick={() => navigate('/tenant/payments')} className="rw-btn-primary text-[10px] uppercase tracking-widest flex items-center gap-2">
                Settlement Console
                <ArrowRight size={16} />
             </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {myKpis.map((kpi, idx) => (
          <div key={idx} className="rw-card p-6 hover:border-[var(--stone-light)] transition-all group">
            <div className="flex items-center justify-between mb-6">
               <div className={`p-3 rounded-xl ${kpi.color}`}>
                  {kpi.icon}
               </div>
               <span className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest">{kpi.title}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--navy)] tracking-tight mb-1">{kpi.value}</h2>
              <p className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Payments */}
        <div className="lg:col-span-2 rw-panel p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-[var(--navy)]">Recent Payments</h2>
            <button onClick={() => navigate('/tenant/payments')} className="text-[var(--stone)] text-xs font-bold uppercase tracking-wider hover:underline">View History</button>
          </div>

          <div className="space-y-4">
            {[ 
               { month: 'March Rent', amount: property ? `₹${property.rent.toLocaleString()}` : '₹0', status: 'Paid', date: '05 Mar 2024' },
               { month: 'February Rent', amount: property ? `₹${property.rent.toLocaleString()}` : '₹0', status: 'Paid', date: '04 Feb 2024' },
               { month: 'January Rent', amount: property ? `₹${property.rent.toLocaleString()}` : '₹0', status: 'Paid', date: '05 Jan 2024' }
            ].map((p, i) => (
               <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[rgba(28,47,63,0.03)] border border-[var(--gray-pale)] hover:bg-[rgba(28,47,63,0.06)] transition-all group/item">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-[rgba(28,47,63,0.04)] flex items-center justify-center text-[var(--navy)] border border-[var(--gray-pale)]">
                     <Clock size={20} />
                   </div>
                   <div>
                     <p className="font-bold text-[var(--navy)] group-hover/item:text-[var(--stone)] transition-colors">{p.month}</p>
                     <p className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest mt-0.5">{p.date}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-lg font-bold text-[#0F766E] tracking-tight">{p.amount}</p>
                   <div className="flex items-center gap-1.5 justify-end mt-0.5">
                      <CheckCircle2 size={12} className="text-[#0F766E]" />
                      <span className="text-[9px] font-bold uppercase text-[#0F766E] tracking-widest">{p.status}</span>
                   </div>
                 </div>
               </div>
            ))}
          </div>
        </div>

        {/* Support & Maintenance */}
          <div className="rw-panel p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-[var(--navy)]">Support</h2>
            <div className="p-2 bg-[rgba(181,155,114,0.12)] rounded-lg text-[var(--navy)]">
               <Wrench size={18} />
            </div>
          </div>
          
           <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6 bg-[rgba(28,47,63,0.03)] rounded-2xl border border-[var(--gray-pale)]">
             <div className="p-4 bg-white rounded-full border border-[var(--gray-pale)] shadow-sm">
               <AlertCircle size={32} className="text-[var(--stone)]" />
             </div>
             <div>
               <p className="font-bold text-[var(--navy)] mb-2">Main door lock jammed</p>
               <span className="rw-pill rw-pill-stone">
                   In Progress
                </span>
               <p className="text-xs text-[var(--ink-subtle)] mt-4 font-medium italic">"Technician Arriving Tomorrow 10AM"</p>
             </div>
             <button className="w-full rw-btn-primary text-[10px] uppercase tracking-widest">
                View Project Dossier
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
