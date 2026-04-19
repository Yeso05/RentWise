import { Bell, LogOut, Menu, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const navigate = useNavigate();
  const role = localStorage.getItem('rentwise_role') || 'Landlord';
  const userName = localStorage.getItem('rentwise_name') || (role === 'Landlord' ? 'Vikram Sharma' : 'Amit Patel');

  const handleLogout = () => {
    localStorage.removeItem('rentwise_token');
    localStorage.removeItem('rentwise_role');
    localStorage.removeItem('rentwise_name');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-brand-sidebar border-b border-white/5 sticky top-0 z-50 flex items-center justify-between px-6 shadow-xl">

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 mr-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center text-white font-black text-xl">
            R
          </div>
          <span className="text-xl font-bold text-white hidden sm:block tracking-tight">
            RentWise
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        
        {/* User Info */}
        <div className="hidden sm:block text-right">
          <p className="text-xs font-bold text-white">{userName}</p>
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{role}</p>
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand-accent rounded-full border-2 border-brand-sidebar" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/5">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-800 border border-white/10">
             <img
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${userName}&backgroundColor=0B0F19`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
