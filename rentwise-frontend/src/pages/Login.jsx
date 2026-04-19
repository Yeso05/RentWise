import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, UserCog, UserCircle2, User, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [role, setRole] = useState('Landlord');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) return;

    try {
      console.log("Verifying backend connectivity...");
      
      // 1. Verify backend reachability
      try {
        const healthCheck = await fetch("http://localhost:5000/api/health");
        if (!healthCheck.ok) throw new Error();
      } catch (err) {
        console.error("BACKEND UNREACHABLE:", err);
        alert("CRITICAL ERROR: The auth server (localhost:5000) is not reachable. Please ensure the backend is running.");
        return;
      }

      console.log("Initiating login sequence...");

      // 2. Perform login request
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim()
        })
      });

      const data = await response.json();
      console.log("LOGIN RESPONSE RECEIVED:", data);

      if (!response.ok) {
        throw new Error(data.error || "Login authorization failed");
      }

      // 3. Store session data
      localStorage.setItem("rentwise_token", data.token);
      localStorage.setItem("rentwise_user", JSON.stringify(data.user));
      localStorage.setItem("rentwise_name", data.user.full_name);

      // 4. Role-based navigation (handling capitalized roles from DB)
      const userRole = data.user.role?.toLowerCase();
      
      if (userRole === "landlord") {
        navigate("/landlord/dashboard");
      } else if (userRole === "tenant") {
        navigate("/tenant/dashboard");
      } else {
        throw new Error("Unknown user role detected");
      }

    } catch (error) {
      console.error("LOGIN SYSTEM ERROR:", error);
      if (error.message === "Failed to fetch") {
        alert("NETWORK ERROR: Connection refused. Ensure backend is running on http://localhost:5000");
      } else {
        alert(error.message);
      }
    }
  };

  const setMockUser = (userType) => {
    if (userType === 'Landlord') {
      setName('Aarthi');
      setEmail('aarthi@gmail.com');
      setPassword('password123');
      setRole('Landlord');
    } else {
      setName('Rahul');
      setEmail('rahul@gmail.com');
      setPassword('password123');
      setRole('Tenant');
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10 glass-card p-10 rounded-2xl border border-white/5 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-brand-accent rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-6 shadow-lg shadow-brand-accent/20">
            R
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome to RentWise</h1>
          <p className="text-slate-500 font-medium text-sm">Internal Portal Access</p>
        </div>

        {/* Mock user shortcuts */}
        <div className="flex gap-2 mb-8 justify-center">
            <button onClick={() => setMockUser('Landlord')} className="px-3 py-1 bg-white/5 border border-white/5 hover:border-brand-accent/30 rounded-lg text-[9px] font-bold text-slate-500 uppercase tracking-widest transition-all">Mock Landlord</button>
            <button onClick={() => setMockUser('Tenant')} className="px-3 py-1 bg-white/5 border border-white/5 hover:border-brand-accent/30 rounded-lg text-[9px] font-bold text-slate-500 uppercase tracking-widest transition-all">Mock Tenant</button>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Full Name</label>
            <div className="relative">
               <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
               <input
                type="text"
                placeholder="Aarthi / Rahul"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-brand-accent transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Email Address</label>
            <div className="relative">
               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
               <input
                type="email"
                placeholder="name@gmail.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-brand-accent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Access Token</label>
            <div className="relative">
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
               <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white focus:outline-none focus:border-brand-accent transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
             <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Portal Role</label>
             <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('Landlord')}
                  className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    role === 'Landlord' 
                      ? 'active-gradient border-transparent shadow-lg shadow-brand-accent/20' 
                      : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
                  }`}
                >
                  Landlord
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Tenant')}
                  className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    role === 'Tenant' 
                      ? 'active-gradient border-transparent shadow-lg shadow-brand-accent/20' 
                      : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
                  }`}
                >
                  Tenant
                </button>
             </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 active-gradient text-white font-bold rounded-xl shadow-lg shadow-brand-accent/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 mt-4"
          >
            <span className="text-xs uppercase tracking-widest font-black">Login</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed">
                By logging in you agree to our <span className="text-slate-500">Service Nodes Protocol</span>
            </p>
        </div>
      </div>
    </div>
  );
}
