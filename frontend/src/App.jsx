import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import React, { useEffect, useState, Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './store';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { authService } from './services/api';
import { setUser, logout } from './store/authSlice';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import NotFound from './pages/NotFound';
import ActionFeedback from './pages/ActionFeedback';
import StaticPage from './pages/StaticPage';
import CompareBar from './components/ui/CompareBar';

// Lazy-loaded Pages
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const AIShopping = lazy(() => import('./pages/AIShopping'));
const MyAccountLayout = lazy(() => import('./pages/account/MyAccountLayout'));
const Dashboard = lazy(() => import('./pages/account/Dashboard'));
const ProfileInfo = lazy(() => import('./pages/account/ProfileInfo'));
const AddressManager = lazy(() => import('./pages/account/AddressManager'));
const Wishlist = lazy(() => import('./pages/account/Wishlist'));
const Notifications = lazy(() => import('./pages/account/Notifications'));
const Security = lazy(() => import('./pages/account/Security'));
const Settings = lazy(() => import('./pages/account/Settings'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Compare = lazy(() => import('./pages/Compare'));

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import NetworkStatus from './components/NetworkStatus';
import { FullscreenLoader } from './components/ui/Loader';
import { usePageTracking } from './hooks/useAnalytics';

// Styles
import './App.css';
import './index.css';

const PageTracker = () => {
  usePageTracking();
  return null;
};

const AuthInit = ({ children }) => {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await authService.getCurrentUser();
        if (response.success && response.user) {
          dispatch(setUser(response.user));
        }
      } catch (error) {
        // Silently fail if user is not logged in or token is invalid
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();

    // Listen for unauthorized events to trigger Redux logout
    const handleUnauthorized = () => {
      dispatch(logout());
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [dispatch]);

  if (isInitializing) {
    return <FullscreenLoader text="Initializing App..." />;
  }

  return children;
};

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id';

  return (
    <Provider store={store}>
      <HelmetProvider>
      <ErrorBoundary>
        <AuthInit>
          <ThemeProvider>
            <CurrencyProvider>
              <GoogleOAuthProvider clientId={googleClientId}>
                <Router>
              <PageTracker />
              <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
              <NetworkStatus />
              <Navbar />
              <main className="flex-1">
                <Suspense fallback={<FullscreenLoader text="Loading..." />}>
                  <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/verify-email/:token" element={<VerifyEmail />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                  <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
                  <Route path="/categories" element={<Products />} />
                  <Route path="/deals" element={<Products />} />
                  <Route path="/ai-shopping" element={<AIShopping />} />
                  <Route path="/feedback" element={<ActionFeedback />} />
                  
                  {/* Static Info Pages */}
                  <Route path="/about" element={<StaticPage />} />
                  <Route path="/contact" element={<StaticPage />} />
                  <Route path="/privacy" element={<StaticPage />} />
                  <Route path="/terms" element={<StaticPage />} />
                  <Route path="/faq" element={<StaticPage />} />
                  <Route path="/support" element={<StaticPage />} />

                  {/* Protected Routes */}
                  <Route
                    path="/account"
                    element={
                      <ProtectedRoute>
                        <MyAccountLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="profile" element={<ProfileInfo />} />
                    <Route path="addresses" element={<AddressManager />} />
                    <Route path="wishlist" element={<Wishlist />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="security" element={<Security />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders/:id"
                    element={
                      <ProtectedRoute>
                        <OrderDetails />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                </Suspense>
              </main>
              <Footer />
              <CompareBar />
              <ToastContainer position="bottom-right" autoClose={4000} hideProgressBar={true} />
            </div>
            </Router>
            </GoogleOAuthProvider>
            </CurrencyProvider>
          </ThemeProvider>
        </AuthInit>
      </ErrorBoundary>
      </HelmetProvider>
    </Provider>
  );
}

export default App;
