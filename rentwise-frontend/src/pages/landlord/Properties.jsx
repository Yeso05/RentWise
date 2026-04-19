import { Building2, MapPin, Bath, BedDouble, Square, IndianRupee, Plus, Search, Filter, Home, MoreVertical, ArrowRight, X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LandlordProperties() {
  const [showModal, setShowModal] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("rentwise_user") || "{}");

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    rent: '',
    status: 'vacant',
    landlord_email: user.email || ''
  });

  const fetchProperties = async () => {
    if (!user.email) return;
    try {
      const res = await fetch(`http://localhost:5000/api/properties/${user.email}`);
      const data = await res.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rent: parseInt(formData.rent)
        }),
      });
      if (res.ok) {
        setShowModal(false);
        fetchProperties();
        setFormData({
          title: '',
          location: '',
          rent: '',
          status: 'vacant',
          landlord_email: user.email
        });
      }
    } catch (error) {
      console.error("Error adding property:", error);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Property Portfolio</h1>
          <p className="text-slate-400 mt-1">Manage and monitor all your rental assets</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3 active-gradient rounded-xl text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-accent/20 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Property
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-accent transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or address..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-brand-accent transition-all"
          />
        </div>
        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2">
          <Filter size={18} className="text-brand-accent" />
          Filter Portfolio
        </button>
      </div>

      {/* Property Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="text-brand-accent animate-spin" size={40} />
          <p className="text-slate-400 font-medium tracking-widest text-xs uppercase">Syncing Portfolio...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="glass-card rounded-2xl border border-white/5 p-20 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 size={40} className="text-slate-600" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No Assets Found</h3>
          <p className="text-slate-400 max-w-xs mx-auto mb-8">You haven't added any properties to your portfolio yet. Initialize your first asset to get started.</p>
          <button 
            onClick={() => setShowModal(true)}
            className="px-8 py-4 active-gradient rounded-xl text-white text-xs font-bold uppercase tracking-widest"
          >
            Initialize First Asset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="glass-card rounded-2xl border border-white/5 group hover:border-brand-accent/20 transition-all flex flex-col h-full overflow-hidden">
              {/* Property Image */}
              <div className="relative h-56 w-full overflow-hidden">
                <img src={`https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600`} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/10 shadow-xl ${
                    property.status?.toLowerCase() === 'occupied' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-brand-accent/20 text-brand-accent'
                  }`}>
                    {property.status}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div className="bg-brand-bg/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white flex items-center gap-1.5 shadow-2xl">
                      <IndianRupee size={16} className="text-brand-cyan" />
                      <span className="text-xl font-bold tracking-tight">{property.rent.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">/Mo</span>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-brand-accent transition-colors">{property.title}</h3>
                  <button className="text-slate-500 hover:text-white transition-colors">
                      <MoreVertical size={20} />
                  </button>
                </div>
                <p className="text-slate-400 text-sm flex items-center gap-2 mb-6">
                  <MapPin size={14} className="text-brand-accent" />
                  {property.location}
                </p>

                <div className="grid grid-cols-3 gap-4 pt-6 mt-auto border-t border-white/5">
                  <div className="flex flex-col items-center gap-1">
                      <BedDouble size={18} className="text-slate-500" />
                      <span className="text-xs font-bold text-white">3 Beds</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 border-x border-white/5">
                      <Bath size={18} className="text-slate-500" />
                      <span className="text-xs font-bold text-white">2 Baths</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                      <Square size={18} className="text-slate-500" />
                      <span className="text-xs font-bold text-white">1,200 ft²</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button className="w-full py-3 bg-white/5 hover:bg-brand-accent text-white rounded-xl text-xs font-bold uppercase tracking-widest border border-white/5 hover:border-brand-accent transition-all flex items-center justify-center gap-2">
                    View Assets & Details
                    <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-bg/80 backdrop-blur-md">
           <div className="w-full max-w-lg glass-card p-10 rounded-2xl border border-white/10 shadow-2xl animate-fade-in-up relative">
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 rounded-lg bg-white/5 text-slate-500 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold text-white mb-8 text-left">Initialize New Asset</h2>
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                 <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Property Title</label>
                    <input 
                      type="text" 
                      name="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. Sea View Apartment" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-brand-accent transition-all" 
                      required
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Location Node</label>
                    <input 
                      type="text" 
                      name="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g. Marine Drive, Mumbai" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-brand-accent transition-all" 
                      required
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Monthly Yield (₹)</label>
                       <input 
                        type="number" 
                        name="rent"
                        value={formData.rent}
                        onChange={(e) => setFormData({...formData, rent: e.target.value})}
                        placeholder="85000" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-brand-accent transition-all" 
                        required
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Asset Status</label>
                       <select 
                        name="status"
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-brand-accent transition-all appearance-none h-[54px] bg-slate-900/50"
                       >
                          <option value="vacant" className="bg-slate-900 text-white">Vacant</option>
                          <option value="occupied" className="bg-slate-900 text-white">Occupied</option>
                          <option value="maintenance" className="bg-slate-900 text-white">Maintenance</option>
                       </select>
                    </div>
                 </div>
                 <button 
                  type="submit"
                  className="w-full py-4 active-gradient text-white font-bold rounded-xl shadow-lg mt-6 uppercase tracking-widest text-xs"
                >
                  Authorize Initialization
                </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
