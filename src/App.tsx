import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy, Component, ReactNode } from 'react';
import { AuthProvider, RequireAuth } from './contexts/AuthContext';
import { QuoteFormProvider } from './contexts/QuoteFormContext';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  isChunkError: boolean;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, isChunkError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const isChunkError = error.message.includes('Failed to fetch dynamically imported module') ||
                         error.message.includes('Loading chunk') ||
                         error.message.includes('ChunkLoadError');
    return { hasError: true, error, isChunkError };
  }

  componentDidCatch(error: Error) {
    const isChunkError = error.message.includes('Failed to fetch dynamically imported module') ||
                         error.message.includes('Loading chunk') ||
                         error.message.includes('ChunkLoadError');

    if (isChunkError) {
      const lastReload = sessionStorage.getItem('chunk_error_reload');
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload) > 10000) {
        sessionStorage.setItem('chunk_error_reload', now.toString());
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white p-8 shadow-sm border border-slate-200">
            <h1 className="text-xl font-semibold text-slate-900 mb-2">
              {this.state.isChunkError ? 'Update Available' : 'Something went wrong'}
            </h1>
            <p className="text-slate-600 mb-4">
              {this.state.isChunkError
                ? 'A new version of the app is available. Please refresh to continue.'
                : 'The application encountered an error. Please refresh the page.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-slate-900 text-white py-2.5 px-4 font-medium hover:bg-slate-800 transition-colors"
            >
              Refresh Page
            </button>
            {this.state.error && !this.state.isChunkError && (
              <pre className="mt-4 text-xs text-red-600 bg-red-50 p-3 overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const PublicSite = lazy(() => import('./pages/PublicSite'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminLeads = lazy(() => import('./pages/admin/AdminLeads'));
const LeadDetails = lazy(() => import('./pages/admin/LeadDetails'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
