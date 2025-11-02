import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '@/context/AuthContext';

// Layout
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Loading from '@/components/common/Loading';

// Pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Có lỗi xảy ra!</h1>
            <p className="text-gray-700 mb-4">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" />;

  return children;
}

// Public Route (redirect if logged in)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (user) return <Navigate to="/" />;

  return children;
}

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />

                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  }
                />

                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <RegisterPage />
                    </PublicRoute>
                  }
                />

                {/* 404 */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>

            <Footer />
          </div>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;