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
    <aside className="w-64 min-h-screen bg-white text-[var(--ink)] flex flex-col transition-all duration-300 shadow-sm border-r border-[var(--gray-pale)] relative z-20">
      
      {/* Sidebar Navigation */}
      <nav className="flex-1 px-4 py-6 mt-4 space-y-2">
        <div className="text-xs font-bold text-[var(--ink-subtle)] uppercase tracking-widest px-4 mb-4">
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
                  ? 'bg-[rgba(181,155,114,0.18)] text-[var(--navy)] font-medium border border-[var(--stone-light)]' 
                  : 'hover:bg-[rgba(28,47,63,0.04)] hover:text-[var(--navy)]'
              }`}
            >
              <div className={`${isActive ? 'text-[var(--navy)]' : 'text-[var(--ink-subtle)] group-hover:text-[var(--navy)]'} transition-colors`}>
                {item.icon}
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Decorative Sidebar Footer */}
      <div className="p-4 mt-auto mb-4 border-t border-[var(--gray-pale)] mx-4">
        <div className="rounded-xl bg-[rgba(181,155,114,0.12)] p-4 border border-[var(--stone-light)]">
            <p className="text-xs font-bold text-[var(--navy)] mb-1">RentWise Pro</p>
            <p className="text-[10px] text-[var(--ink-subtle)]">Premium plan active</p>
        </div>
      </div>
    </aside>
  );
}
