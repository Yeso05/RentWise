import { Search, Bell, Menu, LogOut, CheckCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="h-20 bg-white border-b border-[var(--gray-pale)] shadow-sm sticky top-0 z-50 flex items-center justify-between px-8 py-2">
      
      {/* Left side: Mobile Menu + Branding  */}
      <div className="flex items-center space-x-4">
        <button className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-white/60 transition-colors">
          <Menu size={24} />
        </button>

        {/* Brand Logo - Added here for common navbar requirement */}
        <div className="hidden lg:flex items-center space-x-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-2xl border border-[var(--stone)] flex items-center justify-center text-[var(--navy)] font-bold text-xl">
            R
          </div>
          <span className="text-2xl font-bold text-[var(--navy)]">RentWise</span>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden lg:flex items-center bg-[rgba(28,47,63,0.03)] border border-[var(--gray-pale)] rounded-2xl px-4 py-2.5 w-96 shadow-inner focus-within:shadow-sm focus-within:bg-white transition-all duration-300 group">
        <Search size={18} className="text-[var(--ink-subtle)] group-focus-within:text-[var(--navy)] transition-colors" />
        <input 
          type="text" 
          placeholder="Search properties, tenants, or payments..." 
          className="bg-transparent border-none outline-none px-3 w-full text-sm text-[var(--ink)] placeholder:text-[var(--ink-subtle)] font-medium"
        />
      </div>

      {/* Right side: Tools, Profile, Role */}
      <div className="flex items-center space-x-5">
        
        {/* Role Display */}
          <div className="hidden md:flex items-center space-x-2 bg-[rgba(181,155,114,0.12)] border border-[var(--stone-light)] px-3 py-1.5 rounded-full text-[var(--navy)] shadow-sm">
            <CheckCircle size={16} className="text-[var(--navy)]"/>
            <span className="text-xs font-bold uppercase tracking-wider">Landlord</span>
        </div>

        {/* Notifications Icon */}
        <button className="relative p-2.5 rounded-xl bg-[rgba(28,47,63,0.03)] hover:bg-[rgba(181,155,114,0.12)] text-[var(--ink-subtle)] hover:text-[var(--navy)] shadow-sm transition-all duration-300 border border-[var(--gray-pale)]">
          <Bell size={20} className="group-hover:animate-wiggle" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--stone)] rounded-full ring-2 ring-white"></span>
        </button>

        {/* Profile Section */}
        <div className="flex items-center space-x-3 cursor-pointer group px-2 py-1.5 rounded-full hover:bg-[rgba(28,47,63,0.03)] transition-colors border border-transparent hover:border-[var(--gray-pale)]">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-[var(--navy)]">Vikram Sharma</p>
            <p className="text-xs font-medium text-[var(--ink-subtle)]">Property Owner</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[rgba(28,47,63,0.06)] p-0.5 shadow-sm group-hover:shadow-md transition-shadow">
            <img 
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Vikram&backgroundColor=eeedf4" 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover bg-white"
            />
          </div>
        </div>
        
        {/* Logout Button */}
        <button className="flex items-center space-x-2 px-3 py-2 rounded-xl text-[var(--ink-subtle)] hover:bg-[rgba(244,63,94,0.12)] hover:text-[#BE123C] border border-transparent transition-all duration-300 group">
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold hidden xl:block">Logout</span>
        </button>

      </div>
    </header>
  );
}
