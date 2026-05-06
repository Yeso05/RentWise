import { Bell, IndianRupee, Wrench, FileText, CheckCircle, AlertCircle, Clock, Trash2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const typeStyles = {
  payment: { icon: IndianRupee, color: 'text-[#0F766E]', bg: 'bg-[rgba(16,185,129,0.12)]' },
  alert: { icon: AlertCircle, color: 'text-[#BE123C]', bg: 'bg-[rgba(244,63,94,0.12)]' },
  maintenance: { icon: Wrench, color: 'text-[var(--navy)]', bg: 'bg-[rgba(181,155,114,0.12)]' },
  lease: { icon: FileText, color: 'text-[#1D4ED8]', bg: 'bg-[rgba(59,130,246,0.12)]' },
};

const tabs = ['All', 'Unread', 'Payments', 'Maintenance', 'Alerts'];

export default function LandlordNotifications() {
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("rentwise_user") || "{}");

  useEffect(() => {
    fetchNotifications();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications?user_id=${user.id}`);
      const data = await res.json();
      // Map API response to display format
      const mapped = Array.isArray(data) ? data.map(n => ({
        ...n,
        read: n.is_read,
        type: 'general'
      })) : [];
      setNotifications(mapped);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = notifications.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return !n.read;
    return true;
  });

  const markAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    for (const id of unreadIds) {
      try {
        await fetch(`http://localhost:5000/api/notifications/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_read: true })
        });
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    fetchNotifications();
  };

  const deleteNotif = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: 'DELETE'
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTimeAgo = (date) => {
    if (!date) return 'N/A';
    const now = new Date();
    const diff = now - new Date(date);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;
    return new Date(date).toLocaleDateString('en-IN');
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--navy)] tracking-tight">Notifications</h1>
          <p className="rw-muted mt-1">Stay updated with property and tenant activities</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button 
              onClick={markAllRead}
              className="rw-btn-secondary text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <CheckCircle size={18} className="text-[var(--stone)]" />
              Mark all as read
            </button>
          )}
        </div>
      </div>
      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
              activeTab === tab
                ? 'bg-[var(--navy)] text-white border-transparent'
                : 'bg-white text-[var(--ink-subtle)] border-[var(--gray-pale)] hover:border-[var(--stone-light)] hover:text-[var(--navy)]'
            }`}
          >
            {tab}
            {tab === 'Unread' && unreadCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-[var(--stone)] text-[10px] text-white">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="text-[var(--stone)] animate-spin" size={40} />
          <p className="rw-muted font-medium tracking-widest text-xs uppercase">Loading Notifications...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-20 rw-panel">
              <Bell size={48} className="mx-auto text-[var(--ink-subtle)] mb-4 opacity-50" />
              <p className="text-[var(--ink-subtle)] font-bold uppercase tracking-widest text-sm">No notifications found</p>
            </div>
          ) : (
            filtered.map(n => {
              const style = typeStyles[n.type] || typeStyles.payment;
              const Icon = style.icon;
              return (
                <div 
                  key={n.id} 
                  className={`rw-card p-5 transition-all flex items-start gap-5 relative group ${
                    n.read ? 'opacity-60 border-[var(--gray-pale)]' : 'border-[var(--stone-light)]'
                  }`}
                >
                  <div className={`p-4 rounded-xl ${style.bg} ${style.color} flex-shrink-0`}>
                    <Icon size={24} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-bold tracking-tight ${n.read ? 'text-[var(--ink-subtle)]' : 'text-[var(--navy)]'}`}>{n.title || 'Notification'}</h3>
                        <span className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest flex items-center gap-1.5">
                          <Clock size={12} />
                          {getTimeAgo(n.created_at)}
                        </span>
                     </div>
                     <p className={`text-sm leading-relaxed mb-0 ${n.read ? 'text-[var(--ink-subtle)]' : 'text-[var(--ink-muted)]'}`}>
                        {n.message}
                     </p>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button 
                       onClick={() => deleteNotif(n.id)}
                       className="p-2 text-[var(--ink-subtle)] hover:text-[#BE123C] hover:bg-[rgba(244,63,94,0.12)] rounded-lg transition-all"
                     >
                        <Trash2 size={16} />
                     </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
