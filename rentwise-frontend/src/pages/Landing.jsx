import { useNavigate } from 'react-router-dom';

const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad', 'Kolkata'];

export default function Landing() {
  const navigate = useNavigate();

  const handlePortalLogin = (event) => {
    event.preventDefault();
    navigate('/login');
  };

  const handleInitialize = () => {
    navigate('/login');
  };

  const handleOnboarding = () => {
    alert('Request Onboarding · Our authorization team will contact you to configure your Rental Authority Suite.');
  };

  const handleCityClick = (city) => {
    alert(`Authorized Node: ${city} · Full operational control active in this region.`);
  };

  return (
    <div className="rw-page">
      <div className="rw-container">
        <div className="rw-ambient-line" />

        <div className="rw-topnav">
          <div className="rw-brand">
            Rent<span>Wise</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/login" className="rw-portal-link" onClick={handlePortalLogin}>
              Portal Login
            </a>
          </div>
        </div>

        <div className="rw-hero">
          <span className="rw-label">Secure Private Management</span>
          <h1 className="rw-hero-title">
            Professional Rental<br />
            Authority Suite
          </h1>
          <p className="rw-hero-desc">
            The private ecosystem for high-yield property management. Secure your assets, streamline settlements, and maintain total operational control.
          </p>
          <div className="rw-button-row">
            <button className="rw-btn-primary" onClick={handleInitialize}>
              Initialize Portal
            </button>
            <button className="rw-btn-secondary" onClick={handleOnboarding}>
              Request Onboarding
            </button>
          </div>
        </div>

        <div className="rw-feature-grid">
          <div className="rw-feature-card">
            <h3>Asset Sovereignty</h3>
            <p>Complete control over your property portfolio with secure verified lease management.</p>
          </div>
          <div className="rw-feature-card">
            <h3>Yield Optimization</h3>
            <p>Automated settlement ledger and instant financial reporting for maximum operational efficiency.</p>
          </div>
          <div className="rw-feature-card">
            <h3>Identity Verification</h3>
            <p>Rigorous counterpart screening and secure document vault for all property transactions.</p>
          </div>
        </div>

        <div className="rw-nodes">
          <div className="rw-nodes-heading">Authorized Nodes Across India</div>
          <div className="rw-cities">
            {cities.map((city) => (
              <span key={city} className="rw-city" onClick={() => handleCityClick(city)}>
                {city}
              </span>
            ))}
          </div>
        </div>

        <div className="rw-footer">
          <div className="rw-footer-left">
            <div className="rw-footer-r">R</div>
            <span className="rw-footer-company">RentWise Private Management</span>
          </div>
          <div className="rw-footer-copy">© 2026 RentWise. All Rights Reserved.</div>
          <div className="rw-footer-secure">Private Suite</div>
        </div>
      </div>
    </div>
  );
}
