import { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, Search, X, ArrowRight, MapPin, Filter, Plus, Loader2 } from 'lucide-react';

export default function LandlordTenants() {
  const [showModal, setShowModal] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    property_id: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTenantForMessage, setSelectedTenantForMessage] = useState(null);
  const [selectedTenantForProfile, setSelectedTenantForProfile] = useState(null);
  const [messageContent, setMessageContent] = useState('');

  const user = JSON.parse(localStorage.getItem("rentwise_user") || "{}");

  useEffect(() => {
    fetchTenants();
    fetchProperties();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTenants = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tenants');
      const data = await res.json();
      setTenants(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/properties/${user.email}`);
      const data = await res.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          property_id: parseInt(formData.property_id)
        })
      });

      if (res.ok) {
        setShowModal(false);
        fetchTenants();
        setFormData({
          full_name: '',
          email: '',
          password: '',
          property_id: ''
        });
      }
    } catch (error) {
      console.error('Error adding tenant:', error);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getPropertyName = (propertyId) => {
    const prop = properties.find(p => p.id === propertyId);
    return prop ? prop.title : 'N/A';
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    setSelectedTenantForMessage(null);
    setMessageContent('');
  };

  const filteredTenants = tenants.filter(t => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return t.full_name.toLowerCase().includes(q) || 
           t.email.toLowerCase().includes(q) ||
           getPropertyName(t.property_id).toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--navy)] tracking-tight">Tenant Directory</h1>
          <p className="rw-muted mt-1">Manage active residents and guest profiles</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="rw-btn-primary text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <Plus size={18} />
          Assign New Tenant
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-subtle)]" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, property or contact..."
            className="rw-input rw-input-icon-left"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="rw-btn-secondary text-sm font-medium flex items-center gap-2">
          <Filter size={18} className="text-[var(--stone)]" />
          Filter Database
        </button>
      </div>

      {/* Tenant Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="text-[var(--stone)] animate-spin" size={40} />
          <p className="rw-muted font-medium tracking-widest text-xs uppercase">Loading Tenants...</p>
        </div>
      ) : tenants.length === 0 ? (
        <div className="rw-panel p-20 text-center">
          <div className="w-20 h-20 bg-[rgba(28,47,63,0.05)] rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin size={40} className="text-[var(--ink-subtle)]" />
          </div>
          <h3 className="text-2xl font-bold text-[var(--navy)] mb-2">No Tenants Found</h3>
          <p className="rw-muted max-w-xs mx-auto mb-8">You haven't assigned any tenants yet. Add your first tenant to get started.</p>
          <button 
            onClick={() => setShowModal(true)}
            className="rw-btn-primary text-xs uppercase tracking-widest"
          >
            Assign First Tenant
          </button>
        </div>
      ) : filteredTenants.length === 0 ? (
        <div className="rw-panel p-20 text-center">
          <p className="rw-muted">No tenants found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTenants.map((tenant) => (
            <div key={tenant.id} className="rw-card p-6 group hover:border-[var(--stone-light)] transition-all">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-xl bg-[rgba(181,155,114,0.12)] flex items-center justify-center text-[var(--navy)] font-bold text-xl group-hover:scale-110 transition-transform">
                  {tenant.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <span className="rw-pill rw-pill-emerald">Active</span>
              </div>
              
              <h3 className="text-xl font-bold text-[var(--navy)] mb-2 group-hover:text-[var(--stone)] transition-colors">{tenant.full_name}</h3>
              <p className="rw-muted text-sm flex items-center gap-2 mb-6">
                <MapPin size={14} className="text-[var(--stone)]" />
                {getPropertyName(tenant.property_id)}
              </p>

              <div className="space-y-4 border-t border-[var(--gray-pale)] pt-6 mb-8">
                <div className="flex items-center gap-3 text-[var(--ink-subtle)] hover:text-[var(--navy)] transition-colors">
                  <Mail size={16} className="text-[var(--stone)]" />
                  <span className="text-xs font-semibold">{tenant.email}</span>
                </div>
                <div className="flex items-center gap-3 text-[var(--ink-subtle)]">
                  <Calendar size={16} className="text-[var(--stone)]" />
                  <span className="text-xs font-semibold uppercase tracking-widest">Joined {formatDate(tenant.created_at)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setSelectedTenantForProfile(tenant)} className="flex-1 rw-btn-secondary text-xs uppercase tracking-widest">
                  Profile
                </button>
                <button onClick={() => setSelectedTenantForMessage(tenant)} className="flex-1 rw-btn-primary text-xs uppercase tracking-widest">
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Onboarding Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[rgba(28,47,63,0.25)] backdrop-blur-sm">
          <div className="w-full max-w-2xl rw-panel p-10 animate-fade-in-up relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-2 rounded-lg text-[var(--ink-subtle)] hover:text-[var(--navy)] transition-all"
            >
              <X size={20} />
            </button>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[var(--navy)] tracking-tight">Initialize Resident Identity</h2>
              <p className="rw-muted text-sm mt-1">Deploy new tenant node after offline agreement</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="rw-label-text mb-2 block">Legal Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Rahul Verma" 
                    className="rw-input"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="rw-label-text mb-2 block">Email Node</label>
                  <input 
                    type="email" 
                    placeholder="rahul@gmail.com" 
                    className="rw-input"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="rw-label-text mb-2 block">Dashboard Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="rw-input"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="rw-label-text mb-2 block">Assign Asset</label>
                  <select 
                    className="rw-select appearance-none"
                    value={formData.property_id}
                    onChange={(e) => setFormData({...formData, property_id: e.target.value})}
                    required
                  >
                    <option value="">Select a property</option>
                    {properties.map(prop => (
                      <option key={prop.id} value={prop.id}>{prop.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full rw-btn-primary mt-6 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                <span>Authorize & Initialize Identity</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {selectedTenantForMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[rgba(28,47,63,0.25)] backdrop-blur-sm">
          <div className="w-full max-w-lg rw-panel p-10 animate-fade-in-up relative">
            <button 
              onClick={() => setSelectedTenantForMessage(null)}
              className="absolute top-6 right-6 p-2 rounded-lg text-[var(--ink-subtle)] hover:text-[var(--navy)] transition-all"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-[var(--navy)] tracking-tight mb-2">Send Message</h2>
            <p className="rw-muted text-sm mb-6">To: {selectedTenantForMessage.full_name}</p>
            <form onSubmit={handleSendMessage}>
              <textarea 
                className="rw-input resize-none h-32 mb-6"
                placeholder="Type your message here..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                required
              />
              <button type="submit" className="w-full rw-btn-primary uppercase tracking-widest text-xs flex justify-center items-center gap-2">
                <span>Send Message</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {selectedTenantForProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[rgba(28,47,63,0.25)] backdrop-blur-sm">
          <div className="w-full max-w-lg rw-panel p-10 animate-fade-in-up relative">
            <button 
              onClick={() => setSelectedTenantForProfile(null)}
              className="absolute top-6 right-6 p-2 rounded-lg text-[var(--ink-subtle)] hover:text-[var(--navy)] transition-all"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-[rgba(181,155,114,0.12)] flex items-center justify-center text-[var(--navy)] font-black text-3xl">
                {selectedTenantForProfile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[var(--navy)]">{selectedTenantForProfile.full_name}</h2>
                <p className="text-xs font-bold text-[var(--ink-subtle)] uppercase tracking-widest mt-1">Status: <span className="text-[#0F766E]">Active</span></p>
              </div>
            </div>

            <div className="space-y-4">
               <div className="bg-[rgba(28,47,63,0.03)] p-4 rounded-xl border border-[var(--gray-pale)] flex justify-between">
                  <span className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest">Email</span>
                  <span className="text-sm font-bold text-[var(--navy)]">{selectedTenantForProfile.email}</span>
               </div>
               <div className="bg-[rgba(28,47,63,0.03)] p-4 rounded-xl border border-[var(--gray-pale)] flex justify-between">
                  <span className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest">Assigned Asset</span>
                  <span className="text-sm font-bold text-[var(--navy)]">{getPropertyName(selectedTenantForProfile.property_id)}</span>
               </div>
               <div className="bg-[rgba(28,47,63,0.03)] p-4 rounded-xl border border-[var(--gray-pale)] flex justify-between">
                  <span className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest">Joined</span>
                  <span className="text-sm font-bold text-[var(--navy)]">{formatDate(selectedTenantForProfile.created_at)}</span>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
