import { Building2, MapPin, Bath, BedDouble, Square, IndianRupee, Plus, Search, Filter, MoreVertical, ArrowRight, X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LandlordProperties() {
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `http://localhost:5000/api/properties/${editingId}`
        : 'http://localhost:5000/api/properties';
      
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rent: parseInt(formData.rent)
        }),
      });
      if (res.ok) {
        closeModal();
        fetchProperties();
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} property:`, error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      title: '',
      location: '',
      rent: '',
      status: 'vacant',
      landlord_email: user.email || ''
    });
  };

  const handleAddNew = () => {
    closeModal();
    setShowModal(true);
  };

  const handleEditClick = (property) => {
    setActiveDropdown(null);
    setFormData({
      title: property.title,
      location: property.location,
      rent: property.rent.toString(),
      status: property.status,
      landlord_email: user.email || ''
    });
    setIsEditing(true);
    setEditingId(property.id);
    setShowModal(true);
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      try {
        await fetch(`http://localhost:5000/api/properties/${id}`, { method: 'DELETE' });
        fetchProperties();
        setActiveDropdown(null);
      } catch (error) {
        console.error("Error deleting property:", error);
      }
    }
  };

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--navy)] tracking-tight">Property Portfolio</h1>
          <p className="rw-muted mt-1">Manage and monitor all your rental assets</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="rw-btn-primary text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Property
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-subtle)]" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or address..."
            className="rw-input rw-input-icon-left"
          />
        </div>
        <button className="rw-btn-secondary text-sm font-medium flex items-center gap-2">
          <Filter size={18} className="text-[var(--stone)]" />
          Filter Portfolio
        </button>
      </div>

      {/* Property Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="text-[var(--stone)] animate-spin" size={40} />
          <p className="rw-muted font-medium tracking-widest text-xs uppercase">Syncing Portfolio...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="rw-panel p-20 text-center">
          <div className="w-20 h-20 bg-[rgba(28,47,63,0.05)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 size={40} className="text-[var(--ink-subtle)]" />
          </div>
          <h3 className="text-2xl font-bold text-[var(--navy)] mb-2">No Assets Found</h3>
          <p className="rw-muted max-w-xs mx-auto mb-8">You haven't added any properties to your portfolio yet. Initialize your first asset to get started.</p>
          <button 
            onClick={handleAddNew}
            className="rw-btn-primary text-xs uppercase tracking-widest"
          >
            Initialize First Asset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="rw-card group hover:border-[var(--stone-light)] transition-all flex flex-col h-full overflow-hidden">
              {/* Property Image */}
              <div className="relative h-56 w-full overflow-hidden">
                <img src={`https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600`} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4">
                  <span className={`rw-pill ${
                    property.status?.toLowerCase() === 'occupied' ? 'rw-pill-emerald' : 'rw-pill-stone'
                  }`}>
                    {property.status}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div className="bg-white/90 px-3 py-1.5 rounded-xl border border-[var(--gray-pale)] text-[var(--navy)] flex items-center gap-1.5 shadow-md">
                      <IndianRupee size={16} className="text-[var(--stone)]" />
                      <span className="text-xl font-bold tracking-tight">{property.rent.toLocaleString()}</span>
                      <span className="text-[10px] text-[var(--ink-subtle)] font-bold ml-1 uppercase">/Mo</span>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2 relative">
                  <h3 className="text-xl font-bold text-[var(--navy)] tracking-tight group-hover:text-[var(--stone)] transition-colors">{property.title}</h3>
                  <div className="relative">
                    <button onClick={() => toggleDropdown(property.id)} className="text-[var(--ink-subtle)] hover:text-[var(--navy)] transition-colors">
                        <MoreVertical size={20} />
                    </button>
                    {activeDropdown === property.id && (
                      <div className="absolute right-0 top-6 w-32 bg-white rounded-lg shadow-lg border border-[var(--gray-pale)] py-2 z-10 animate-fade-in-up">
                        <button onClick={() => handleEditClick(property)} className="w-full text-left px-4 py-2 text-xs font-bold text-[var(--navy)] hover:bg-[rgba(181,155,114,0.12)] transition-colors">
                          Edit Asset
                        </button>
                        <button onClick={() => handleDeleteProperty(property.id)} className="w-full text-left px-4 py-2 text-xs font-bold text-[#BE123C] hover:bg-[rgba(244,63,94,0.12)] transition-colors">
                          Delete Asset
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="rw-muted text-sm flex items-center gap-2 mb-6">
                  <MapPin size={14} className="text-[var(--stone)]" />
                  {property.location}
                </p>

                <div className="grid grid-cols-3 gap-4 pt-6 mt-auto border-t border-[var(--gray-pale)]">
                  <div className="flex flex-col items-center gap-1">
                      <BedDouble size={18} className="text-[var(--ink-subtle)]" />
                      <span className="text-xs font-bold text-[var(--navy)]">3 Beds</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 border-x border-[var(--gray-pale)]">
                      <Bath size={18} className="text-[var(--ink-subtle)]" />
                      <span className="text-xs font-bold text-[var(--navy)]">2 Baths</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                      <Square size={18} className="text-[var(--ink-subtle)]" />
                      <span className="text-xs font-bold text-[var(--navy)]">1,200 ft²</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button onClick={() => setSelectedProperty(property)} className="w-full rw-btn-secondary text-xs uppercase tracking-widest flex items-center justify-center gap-2">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[rgba(28,47,63,0.25)] backdrop-blur-sm">
           <div className="w-full max-w-lg rw-panel p-10 animate-fade-in-up relative">
              <button 
                onClick={closeModal}
                className="absolute top-6 right-6 p-2 rounded-lg text-[var(--ink-subtle)] hover:text-[var(--navy)] transition-all"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold text-[var(--navy)] mb-8 text-left">
                {isEditing ? 'Edit Asset Details' : 'Initialize New Asset'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                 <div>
                    <label className="rw-label-text mb-2 block">Property Title</label>
                    <input 
                      type="text" 
                      name="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. Sea View Apartment" 
                      className="rw-input" 
                      required
                    />
                 </div>
                 <div>
                    <label className="rw-label-text mb-2 block">Location Node</label>
                    <input 
                      type="text" 
                      name="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g. Marine Drive, Mumbai" 
                      className="rw-input" 
                      required
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="rw-label-text mb-2 block">Monthly Yield (₹)</label>
                       <input 
                        type="number" 
                        name="rent"
                        value={formData.rent}
                        onChange={(e) => setFormData({...formData, rent: e.target.value})}
                        placeholder="85000" 
                        className="rw-input" 
                        required
                       />
                    </div>
                    <div>
                       <label className="rw-label-text mb-2 block">Asset Status</label>
                       <select 
                        name="status"
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="rw-select appearance-none h-[54px]"
                       >
                          <option value="vacant">Vacant</option>
                          <option value="occupied">Occupied</option>
                          <option value="maintenance">Maintenance</option>
                       </select>
                    </div>
                 </div>
                 <button 
                  type="submit"
                  className="w-full rw-btn-primary mt-6 uppercase tracking-widest text-xs"
                >
                  {isEditing ? 'Save Changes' : 'Authorize Initialization'}
                </button>
              </form>
           </div>
        </div>
      )}

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[rgba(28,47,63,0.25)] backdrop-blur-sm">
           <div className="w-full max-w-2xl rw-panel p-10 animate-fade-in-up relative overflow-y-auto max-h-[90vh] custom-scrollbar">
              <button 
                onClick={() => setSelectedProperty(null)}
                className="absolute top-6 right-6 p-2 rounded-lg text-[var(--ink-subtle)] hover:text-[var(--navy)] transition-all"
              >
                <X size={20} />
              </button>
              
              <div className="flex gap-6 mb-8 items-start">
                 <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                    <img src={`https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600`} alt={selectedProperty.title} className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <div className="flex items-center gap-3 mb-2">
                       <h2 className="text-2xl font-bold text-[var(--navy)]">{selectedProperty.title}</h2>
                       <span className={`rw-pill ${selectedProperty.status?.toLowerCase() === 'occupied' ? 'rw-pill-emerald' : 'rw-pill-stone'}`}>
                          {selectedProperty.status}
                       </span>
                    </div>
                    <p className="rw-muted text-sm flex items-center gap-2">
                      <MapPin size={14} className="text-[var(--stone)]" />
                      {selectedProperty.location}
                    </p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                 <div className="bg-[rgba(28,47,63,0.03)] p-6 rounded-xl border border-[var(--gray-pale)] flex flex-col justify-center items-center text-center">
                    <span className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase tracking-widest mb-2">Monthly Yield</span>
                    <div className="flex items-center gap-1.5 text-2xl font-bold text-[var(--navy)]">
                       <IndianRupee size={20} className="text-[var(--stone)]" />
                       {selectedProperty.rent.toLocaleString()}
                    </div>
                 </div>
                 
                 <div className="bg-[rgba(28,47,63,0.03)] p-6 rounded-xl border border-[var(--gray-pale)] grid grid-cols-2 gap-4">
                     <div className="flex flex-col items-center justify-center text-center">
                         <BedDouble size={20} className="text-[var(--stone)] mb-2" />
                         <span className="text-xs font-bold text-[var(--navy)]">3 Beds</span>
                     </div>
                     <div className="flex flex-col items-center justify-center text-center border-l border-[var(--gray-pale)]">
                         <Bath size={20} className="text-[var(--stone)] mb-2" />
                         <span className="text-xs font-bold text-[var(--navy)]">2 Baths</span>
                     </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <h3 className="font-bold text-[var(--navy)] text-sm uppercase tracking-widest mb-4">Financial Overview</h3>
                 <div className="flex justify-between items-center py-3 border-b border-[var(--gray-pale)]">
                    <span className="text-sm font-bold text-[var(--ink-subtle)]">Property ID</span>
                    <span className="text-sm font-bold text-[var(--navy)]">PROP-{selectedProperty.id}</span>
                 </div>
                 <div className="flex justify-between items-center py-3 border-b border-[var(--gray-pale)]">
                    <span className="text-sm font-bold text-[var(--ink-subtle)]">Landlord Email</span>
                    <span className="text-sm font-bold text-[var(--navy)]">{selectedProperty.landlord_email}</span>
                 </div>
                 <div className="flex justify-between items-center py-3 border-b border-[var(--gray-pale)]">
                    <span className="text-sm font-bold text-[var(--ink-subtle)]">Created Date</span>
                    <span className="text-sm font-bold text-[var(--navy)]">{new Date(selectedProperty.created_at).toLocaleDateString('en-IN')}</span>
                 </div>
              </div>

              <button 
                onClick={() => setSelectedProperty(null)}
                className="w-full rw-btn-primary mt-8 uppercase tracking-widest text-xs"
              >
                Close Asset Details
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
