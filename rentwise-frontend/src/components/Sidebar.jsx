import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  CreditCard, 
  Wrench, 
  FileText, 
  Bell
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Properties', path: '/dashboard/properties', icon: <Building2 size={20} /> },
  { name: 'Tenants', path: '/dashboard/tenants', icon: <Users size={20} /> },
  { name: 'Payments', path: '/dashboard/payments', icon: <CreditCard size={20} /> },
  { name: 'Maintenance', path: '/dashboard/maintenance', icon: <Wrench size={20} /> },
  { name: 'Documents', path: '/dashboard/documents', icon: <FileText size={20} /> },
  { name: 'Notifications', path: '/dashboard/notifications', icon: <Bell size={20} /> },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 shadow-2xl relative z-20">
      
      {/* Sidebar Navigation */}
      <nav className="flex-1 px-4 py-6 mt-4 space-y-2">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">
          Main Menu
        </div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-brand-600/20 text-brand-500 font-medium scale-105 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-brand-500/20' 
                  : 'hover:bg-slate-800 hover:text-white hover:scale-[1.02]'
              }`}
            >
              <div className={`${isActive ? 'text-brand-500' : 'text-slate-400 group-hover:text-white'} transition-colors`}>
                {item.icon}
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Decorative Sidebar Footer */}
      <div className="p-4 mt-auto mb-4 border-t border-slate-800 mx-4">
        <div className="rounded-xl bg-gradient-to-tr from-indigo-900/50 to-brand-900/30 p-4 border border-indigo-500/20">
            <p className="text-xs font-bold text-indigo-300 mb-1">RentWise Pro</p>
            <p className="text-[10px] text-slate-500">Premium plan active</p>
        </div>
      </div>
    </aside>
  );
}
