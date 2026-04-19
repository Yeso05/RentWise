import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, CreditCard,
  Wrench, FileText, Bell, ChevronRight
} from 'lucide-react';

const landlordNav = [
  { name: 'Dashboard',       path: '/landlord/dashboard',  icon: LayoutDashboard },
  { name: 'Properties',      path: '/landlord/properties', icon: Building2 },
  { name: 'Tenants',         path: '/landlord/tenants',    icon: Users },
  { name: 'Payments',        path: '/landlord/payments',   icon: CreditCard },
  { name: 'Maintenance',     path: '/landlord/maintenance',icon: Wrench },
  { name: 'Lease Documents', path: '/landlord/documents',  icon: FileText },
  { name: 'Notifications',   path: '/landlord/notifications', icon: Bell },
];

const tenantNav = [
  { name: 'Dashboard',   path: '/tenant/dashboard', icon: LayoutDashboard },
  { name: 'Payments',    path: '/tenant/payments',  icon: CreditCard },
  { name: 'Maintenance', path: '/tenant/maintenance', icon: Wrench },
  { name: 'Documents',   path: '/tenant/documents', icon: FileText },
];

export default function Sidebar({ open }) {
  const location = useLocation();
  const role = localStorage.getItem('rentwise_role') || 'Landlord';
  const navItems = role === 'Tenant' ? tenantNav : landlordNav;

  return (
    <aside
      className={`
        fixed top-16 left-0 h-[calc(100vh-64px)] z-40
        w-64 bg-brand-sidebar border-r border-white/5
        flex flex-col transition-all duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:sticky lg:top-16
      `}
    >
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl
                text-sm font-medium transition-all
                ${isActive
                  ? 'active-gradient text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-slate-500'} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="p-4 rounded-xl bg-white/5 text-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Version 2.4.0</p>
        </div>
      </div>
    </aside>
  );
}
