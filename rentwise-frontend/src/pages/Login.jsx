import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User, Eye, EyeOff } from 'lucide-react';

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
      localStorage.setItem("rentwise_name", data.user.name);
      localStorage.setItem("rentwise_role", data.user.role);

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
    <div className="rw-page rw-login-shell">
      <div className="rw-login-grid">
        <section className="rw-login-hero">
          <div className="rw-login-kicker">Secure Portal</div>
          <div className="rw-login-brand">
            Rent<span>Wise</span>
          </div>
          <h1 className="rw-login-title">Sign in to your management workspace.</h1>
          <p className="rw-login-subtitle">
            Manage leases, payments, maintenance, and tenant communication from a single, verified portal.
          </p>

          <ul className="rw-login-list">
            <li>Role-based access for landlords and tenants.</li>
            <li>Document vault with verified lease records.</li>
            <li>Maintenance tracking with status approvals.</li>
          </ul>

          <div className="rw-login-support">Need access? Contact your property administrator.</div>
        </section>

        <section className="rw-login-panel rw-panel">
          <div className="rw-login-panel-inner">
            <div className="rw-login-panel-header">
              <div className="w-16 h-16 border border-[var(--stone)] text-[var(--navy)] rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-5">
                R
              </div>
              <h1 className="rw-login-panel-title">Welcome back</h1>
              <p className="rw-login-panel-subtitle">Use your approved credentials to enter.</p>
            </div>

            <div className="flex gap-2 mb-8 justify-center">
              <button onClick={() => setMockUser('Landlord')} className="rw-btn-ghost text-[9px] uppercase tracking-[0.3em]">
                Mock Landlord
              </button>
              <button onClick={() => setMockUser('Tenant')} className="rw-btn-ghost text-[9px] uppercase tracking-[0.3em]">
                Mock Tenant
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="rw-label-text mb-2 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-subtle)]" size={18} />
                  <input
                    type="text"
                    placeholder="Aarthi / Rahul"
                    className="rw-input rw-input-icon-left"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="rw-label-text mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-subtle)]" size={18} />
                  <input
                    type="email"
                    placeholder="name@gmail.com"
                    className="rw-input rw-input-icon-left"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="rw-label-text mb-2 block">Access Token</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-subtle)]" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="rw-input rw-input-icon-left rw-input-icon-right"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--ink-subtle)] hover:text-[var(--navy)] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="rw-label-text mb-2 block">Portal Role</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('Landlord')}
                    className={role === 'Landlord' ? 'rw-btn-primary' : 'rw-btn-secondary'}
                  >
                    Landlord
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('Tenant')}
                    className={role === 'Tenant' ? 'rw-btn-primary' : 'rw-btn-secondary'}
                  >
                    Tenant
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full rw-btn-primary mt-2 flex items-center justify-center gap-3">
                <span className="text-xs uppercase tracking-widest font-semibold">Login</span>
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-10 pt-6 border-t border-[var(--gray-pale)] text-center">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--ink-subtle)]">
                By logging in you agree to our <span className="text-[var(--ink-muted)]">Service Nodes Protocol</span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
