import { useNavigate, Link } from 'react-router-dom';
import { Building2, ShieldCheck, PieChart, ArrowRight, MapPin, Zap } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-bg font-sans selection:bg-brand-accent/30 selection:text-brand-accent">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-brand-bg/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center text-white font-black text-xl">R</div>
          <span className="text-xl font-bold text-white tracking-tight">RentWise</span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all uppercase tracking-wider"
        >
          Portal Login
        </button>
      </nav>

      <div className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/10 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] -ml-80 -mb-80" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <ShieldCheck size={14} />
            Secure Private Management
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-8">
            Professional Rental <br />
            <span className="text-brand-accent">Authority Suite</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            The private ecosystem for high-yield property management. Secure your assets, streamline settlements, and maintain total operational control.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-10 py-5 active-gradient text-white font-bold rounded-2xl shadow-xl shadow-brand-accent/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              Initialize Portal
              <ArrowRight size={20} />
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">
              Request Onboarding
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-10 rounded-2xl border border-white/5">
            <div className="w-14 h-14 bg-brand-accent/20 rounded-xl flex items-center justify-center text-brand-accent mb-8">
              <Building2 size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Asset Sovereignty</h3>
            <p className="text-slate-400 leading-relaxed">Complete control over your property portfolio with secure verified lease management.</p>
          </div>
          <div className="glass-card p-10 rounded-2xl border border-white/5">
            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-8">
              <PieChart size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Yield Optimization</h3>
            <p className="text-slate-400 leading-relaxed">Automated settlement ledger and instant financial reporting for maximum operational efficiency.</p>
          </div>
          <div className="glass-card p-10 rounded-2xl border border-white/5">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-8">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Identity Verification</h3>
            <p className="text-slate-400 leading-relaxed">Rigorous counterpart screening and secure document vault for all property transactions.</p>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 text-center">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-12">Authorized Nodes Across India</p>
        <div className="flex flex-wrap justify-center items-center gap-10 opacity-50">
           {['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad', 'Kolkata'].map(city => (
             <div key={city} className="flex items-center gap-2 text-white font-bold tracking-widest text-xs uppercase">
               <MapPin size={14} className="text-brand-accent" />
               {city}
             </div>
           ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-6 h-6 rounded-md bg-brand-accent flex items-center justify-center text-white font-black text-xs">R</div>
          <span className="text-sm font-bold text-white tracking-tight">RentWise Private Management</span>
        </div>
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">© 2026 RentWise. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// Added back needed icons
import { Wrench } from 'lucide-react';
