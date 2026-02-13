import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicSite from './pages/PublicSite';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLeads from './pages/admin/AdminLeads';
import LeadDetails from './pages/admin/LeadDetails';
import { AuthProvider, RequireAuth } from './contexts/AuthContext';
import { QuoteFormProvider } from './contexts/QuoteFormContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <QuoteFormProvider>
                <PublicSite />
              </QuoteFormProvider>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="leads/:id" element={<LeadDetails />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
