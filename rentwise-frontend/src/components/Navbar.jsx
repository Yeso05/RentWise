import { Search, Bell, Menu, LogOut, CheckCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="h-20 bg-white/40 backdrop-blur-xl border-b border-white/40 shadow-sm sticky top-0 z-50 flex items-center justify-between px-8 py-2 transition-all duration-300">
      
      {/* Left side: Mobile Menu + Branding  */}
      <div className="flex items-center space-x-4">
        <button className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-white/60 transition-colors">
          <Menu size={24} />
        </button>

        {/* Brand Logo - Added here for common navbar requirement */}
        <div className="hidden lg:flex items-center space-x-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            R
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 group-hover:from-brand-600 group-hover:to-indigo-500 transition-all duration-300">
            RentWise
          </span>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden lg:flex items-center bg-white/60 border border-white/50 rounded-2xl px-4 py-2.5 w-96 shadow-inner focus-within:shadow-md focus-within:bg-white transition-all duration-300 group">
        <Search size={18} className="text-slate-400 group-focus-within:text-brand-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Search properties, tenants, or payments..." 
          className="bg-transparent border-none outline-none px-3 w-full text-sm text-slate-700 placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Right side: Tools, Profile, Role */}
      <div className="flex items-center space-x-5">
        
        {/* Role Display */}
        <div className="hidden md:flex items-center space-x-2 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full text-emerald-700 shadow-sm">
           <CheckCircle size={16} className="text-emerald-500"/>
           <span className="text-xs font-bold uppercase tracking-wider">Landlord</span>
        </div>

        {/* Notifications Icon */}
        <button className="relative p-2.5 rounded-xl bg-white/60 hover:bg-white text-slate-600 hover:text-brand-600 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group border border-white/40">
          <Bell size={20} className="group-hover:animate-wiggle" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-white"></span>
        </button>

        {/* Profile Section */}
        <div className="flex items-center space-x-3 cursor-pointer group px-2 py-1.5 rounded-full hover:bg-white/60 transition-colors border border-transparent hover:border-white/50">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-slate-800 group-hover:text-brand-600 transition-colors">Vikram Sharma</p>
            <p className="text-xs font-medium text-slate-500">Property Owner</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-200 to-indigo-100 p-0.5 shadow-sm group-hover:shadow-md transition-shadow">
            <img 
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Vikram&backgroundColor=eeedf4" 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover bg-white"
            />
          </div>
        </div>
        
        {/* Logout Button */}
        <button className="flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100 transition-all duration-300 group">
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold hidden xl:block">Logout</span>
        </button>

      </div>
    </header>
  );
}
