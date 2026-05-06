import { Users, Building2, Wrench, IndianRupee, TrendingUp, Clock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';


export default function LandlordDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('rentwise_name') || 'Landlord';
  const userEmail = JSON.parse(localStorage.getItem('rentwise_user') || '{}').email;

  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [propsRes, tenantsRes, paymentsRes, maintRes] = await Promise.all([
        fetch(`http://localhost:5000/api/properties/${userEmail}`),
        fetch('http://localhost:5000/api/tenants'),
        fetch('http://localhost:5000/api/payments'),
        fetch('http://localhost:5000/api/maintenance')
      ]);

      const propsData = await propsRes.json();
      const tenantsData = await tenantsRes.json();
      const paymentsData = await paymentsRes.json();
      const maintData = await maintRes.json();

      setProperties(Array.isArray(propsData) ? propsData : []);
      setTenants(Array.isArray(tenantsData) ? tenantsData : []);
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      setMaintenance(Array.isArray(maintData) ? maintData : []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    const pendingRepairs = maintenance.filter(m => m.status !== 'Resolved').length;

    return [
      { label: 'Total Properties', value: properties.length, icon: Building2, trend: `+${properties.length} properties`, chipClass: 'bg-[rgba(181,155,114,0.15)] text-[var(--navy)]', valueClass: 'text-[var(--navy)]' },
      { label: 'Total Tenants', value: tenants.length, icon: Users, trend: `+${tenants.length} tenants`, chipClass: 'bg-[rgba(28,47,63,0.08)] text-[var(--navy)]', valueClass: 'text-[var(--navy)]' },
      { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN', {maximumFractionDigits: 0})}`, icon: IndianRupee, trend: 'All transactions', chipClass: 'bg-[rgba(16,185,129,0.12)] text-[#0F766E]', valueClass: 'text-[#0F766E]' },
      { label: 'Pending Repairs', value: pendingRepairs, icon: Wrench, trend: `${pendingRepairs} open`, chipClass: 'bg-[rgba(245,158,11,0.12)] text-[#B45309]', valueClass: 'text-[var(--navy)]' },
    ];
  };

  const stats = calculateStats();

  const recentActivities = [
    ...payments.slice(0, 2).map(p => ({
      id: `payment-${p.id}`,
      title: 'Rent Received',
      desc: `Payment of ₹${parseFloat(p.amount).toLocaleString('en-IN')}`,
      time: new Date(p.payment_date).toLocaleDateString('en-IN'),
      type: 'payment'
    })),
    ...maintenance.slice(0, 2).map(m => ({
      id: `maint-${m.id}`,
      title: 'Maintenance Request',
      desc: m.title,
      time: new Date(m.created_at).toLocaleDateString('en-IN'),
      type: 'maintenance'
    }))
  ].slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-10 rw-panel group">
        <img 
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1920" 
          alt="Apartment Portfolio" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-white/80" />
        
        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-2xl">
            <div className="rw-pill rw-pill-stone mb-4">Portfolio Overview</div>
            <h1 className="text-3xl md:text-5xl font-black text-[var(--navy)] tracking-tight leading-none mb-4">
              Real Estate <br /><span className="text-[var(--stone)]">Control Center</span>
            </h1>
            <p className="rw-muted text-sm md:text-base font-medium max-w-md leading-relaxed">
              Welcome back, {userName.split(' ')[0]}. {loading ? 'Loading...' : 'All systems operational. Your portfolio is active.'}
            </p>
          </div>
          
          <div className="absolute bottom-8 right-8 flex items-center gap-3">
            <button onClick={() => window.print()} className="rw-btn-secondary text-[10px] uppercase tracking-widest">
              Export Portfolio PDF
            </button>
            <button onClick={() => navigate('/landlord/properties')} className="rw-btn-primary text-[10px] uppercase tracking-widest">
              Initialize New Asset
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="text-[var(--stone)] animate-spin" size={40} />
          <p className="rw-muted font-medium tracking-widest text-xs uppercase">Loading Dashboard...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="rw-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.chipClass}`}>
                  <stat.icon size={24} />
                </div>
                <span className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest">{stat.trend}</span>
              </div>
              <p className="text-[var(--ink-subtle)] text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className={`text-2xl font-bold ${stat.valueClass}`}>
                {stat.value}
              </h3>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rw-panel flex flex-col">
          <div className="p-6 border-b border-[var(--gray-pale)] flex items-center justify-between">
            <h3 className="font-bold text-[var(--navy)] uppercase tracking-widest text-xs">Recent Activity</h3>
            <button onClick={() => navigate('/landlord/payments')} className="text-[10px] font-bold text-[var(--stone)] uppercase tracking-widest hover:text-[var(--navy)] transition-colors">View All</button>
          </div>
          <div className="flex-1 p-6 space-y-6">
            {recentActivities.length === 0 ? (
              <p className="text-center py-10 rw-muted">No recent activities</p>
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      activity.type === 'payment' ? 'bg-[rgba(16,185,129,0.12)] text-[#0F766E]' :
                      activity.type === 'maintenance' ? 'bg-[rgba(245,158,11,0.12)] text-[#B45309]' :
                      'bg-[rgba(181,155,114,0.12)] text-[var(--navy)]'
                    }`}>
                      {activity.type === 'payment' ? <TrendingUp size={18} /> : 
                       activity.type === 'maintenance' ? <Wrench size={18} /> : 
                       <Clock size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--navy)] group-hover:text-[var(--stone)] transition-colors">{activity.title}</p>
                      <p className="text-xs text-[var(--ink-subtle)]">{activity.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                  {activity.time && (
                    <p className="text-[10px] text-[var(--ink-subtle)] font-bold uppercase tracking-tighter">{activity.time}</p>
                  )}
                </div>
              </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions / Summary */}
        <div className="space-y-8">
          <div className="rw-panel p-6">
            <h3 className="font-bold text-[var(--navy)] mb-2">Platform Status</h3>
            <p className="rw-muted text-sm leading-relaxed mb-6">Your rental nodes are performing at optimal efficiency.</p>
            <div className="space-y-4">
              <div className="bg-[rgba(28,47,63,0.03)] p-3 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider">Server Uptime</span>
                <span className="text-xs font-bold text-[var(--navy)]">99.9%</span>
              </div>
              <div className="bg-[rgba(28,47,63,0.03)] p-3 rounded-xl flex items-center justify-center">
                <span className="text-xs font-bold text-[var(--navy)] uppercase tracking-widest">Active Identity</span>
              </div>
            </div>
          </div>

          <div className="rw-panel p-6">
             <h3 className="font-bold text-[var(--navy)] uppercase tracking-widest text-xs mb-6">Occupancy Rate</h3>
             <div className="relative h-4 w-full bg-[rgba(28,47,63,0.08)] rounded-full overflow-hidden mb-4">
                <div className="absolute top-0 left-0 h-full w-[85%] bg-[var(--navy)] rounded-full" />
             </div>
             <div className="flex justify-between items-center text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest">
                <span>Allocated</span>
                <span className="text-[var(--navy)]">85%</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
