import { Bell, LogOut, Menu, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const role = localStorage.getItem('rentwise_role') || 'Landlord';
  const userName = localStorage.getItem('rentwise_name') || (role === 'Landlord' ? 'Vikram Sharma' : 'Amit Patel');
  const user = JSON.parse(localStorage.getItem('rentwise_user') || '{}');

  useEffect(() => {
    if (user.id && showNotifs) {
      fetch(`http://localhost:5000/api/notifications?user_id=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setNotifications(data);
        })
        .catch(err => console.error(err));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNotifs]);

  const handleLogout = () => {
    localStorage.removeItem('rentwise_token');
    localStorage.removeItem('rentwise_role');
    localStorage.removeItem('rentwise_name');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-[var(--gray-pale)] sticky top-0 z-50 flex items-center justify-between px-6 shadow-sm">

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 mr-2 rounded-lg text-[var(--ink-subtle)] hover:bg-[rgba(181,155,114,0.12)] hover:text-[var(--navy)] transition-all"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg border border-[var(--stone)] text-[var(--navy)] flex items-center justify-center font-bold text-xl">
            R
          </div>
          <span className="text-xl font-bold text-[var(--navy)] hidden sm:block tracking-tight">RentWise</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        
        {/* User Info */}
        <div className="hidden sm:block text-right">
          <p className="text-xs font-bold text-[var(--navy)]">{userName}</p>
          <p className="text-[10px] font-medium text-[var(--ink-subtle)] uppercase tracking-wider">{role}</p>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg text-[var(--ink-subtle)] hover:bg-[rgba(181,155,114,0.12)] hover:text-[var(--navy)] transition-all"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--stone)] rounded-full border-2 border-white" />
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-lg border border-[var(--gray-pale)] overflow-hidden z-50 animate-fade-in-up">
              <div className="p-4 border-b border-[var(--gray-pale)] flex justify-between items-center">
                 <h3 className="font-bold text-[var(--navy)]">Notifications</h3>
                 {notifications.filter(n => !n.is_read).length > 0 && (
                   <span className="text-[10px] bg-[var(--stone)] text-white px-2 py-0.5 rounded-full font-bold">
                     {notifications.filter(n => !n.is_read).length} New
                   </span>
                 )}
              </div>
              <div className="p-4 flex flex-col gap-4 max-h-72 overflow-y-auto custom-scrollbar">
                 {notifications.length === 0 ? (
                   <p className="text-xs text-[var(--ink-subtle)] text-center py-4">No recent notifications</p>
                 ) : (
                   notifications.slice(0, 5).map(notif => (
                     <div key={notif.id} className={`flex gap-3 items-start group cursor-pointer ${notif.is_read ? 'opacity-60' : ''}`}>
                       <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 transition-transform ${notif.is_read ? 'bg-transparent border border-[var(--gray-pale)]' : 'bg-[var(--stone)] group-hover:scale-150'}`} />
                       <div>
                         <p className="text-sm font-bold text-[var(--navy)] leading-tight">{notif.title}</p>
                         <p className="text-xs text-[var(--ink-subtle)] mt-1 leading-relaxed">{notif.message}</p>
                       </div>
                     </div>
                   ))
                 )}
              </div>
              <div className="p-3 border-t border-[var(--gray-pale)] text-center bg-[rgba(28,47,63,0.02)]">
                 <button 
                  onClick={() => { setShowNotifs(false); navigate(role === 'Landlord' ? '/landlord/notifications' : '/tenant/dashboard'); }} 
                  className="text-[10px] font-bold text-[var(--stone)] hover:text-[var(--navy)] uppercase tracking-widest transition-colors"
                 >
                   View All Activity
                 </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-[var(--gray-pale)]">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-[rgba(28,47,63,0.08)] border border-[var(--gray-pale)]">
             <img
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${userName}&backgroundColor=F2EFEA`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-[var(--ink-subtle)] hover:text-[#BE123C] hover:bg-[rgba(244,63,94,0.12)] transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
