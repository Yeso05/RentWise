import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Public
import Landing from './pages/Landing';
import Login from './pages/Login';

// Landlord pages
import LandlordDashboard    from './pages/landlord/Dashboard';
import LandlordProperties   from './pages/landlord/Properties';
import LandlordTenants      from './pages/landlord/Tenants';
import LandlordPayments     from './pages/landlord/Payments';
import LandlordMaintenance  from './pages/landlord/Maintenance';
import LandlordDocuments    from './pages/landlord/LeaseDocuments';
import LandlordNotifications from './pages/landlord/Notifications';

// Tenant pages
import TenantDashboard   from './pages/tenant/Dashboard';
import TenantPayments    from './pages/tenant/Payments';
import TenantDocuments   from './pages/tenant/Documents';
import TenantMaintenance from './pages/tenant/Maintenance';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/"      element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Landlord protected routes */}
        <Route
          path="/landlord"
          element={
            <ProtectedRoute allowedRole="Landlord">
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"     element={<LandlordDashboard />} />
          <Route path="properties"    element={<LandlordProperties />} />
          <Route path="tenants"       element={<LandlordTenants />} />
          <Route path="payments"      element={<LandlordPayments />} />
          <Route path="maintenance"   element={<LandlordMaintenance />} />
          <Route path="documents"     element={<LandlordDocuments />} />
          <Route path="notifications" element={<LandlordNotifications />} />
        </Route>

        {/* Tenant protected routes */}
        <Route
          path="/tenant"
          element={
            <ProtectedRoute allowedRole="Tenant">
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"   element={<TenantDashboard />} />
          <Route path="payments"    element={<TenantPayments />} />
          <Route path="maintenance" element={<TenantMaintenance />} />
          <Route path="documents"   element={<TenantDocuments />} />
        </Route>

        {/* Legacy /dashboard route — redirect based on role in localStorage */}
        <Route
          path="/dashboard"
          element={<RoleRedirect />}
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// Helper: redirect to correct portal based on stored role
function RoleRedirect() {
  const role = localStorage.getItem('rentwise_role');
  if (role === 'Tenant') return <Navigate to="/tenant/dashboard" replace />;
  return <Navigate to="/landlord/dashboard" replace />;
}

export default App;
