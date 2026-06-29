import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './store';
import { ThemeProvider } from './context/ThemeContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { authService } from './services/api';
import { setUser, logout } from './store/authSlice';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import AIShopping from './pages/AIShopping';
import MyAccountLayout from './pages/account/MyAccountLayout';
import Dashboard from './pages/account/Dashboard';
import ProfileInfo from './pages/account/ProfileInfo';
import AddressManager from './pages/account/AddressManager';
import Wishlist from './pages/account/Wishlist';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Styles
import './App.css';
import './index.css';

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return children;
};

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id';

  return (
    <Provider store={store}>
      <AuthInit>
        <ThemeProvider>
          <GoogleOAuthProvider clientId={googleClientId}>
            <Router>
              <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/verify-email/:token" element={<VerifyEmail />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/categories" element={<Products />} />
                  <Route path="/deals" element={<Products />} />
                  <Route path="/ai-shopping" element={<AIShopping />} />

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
                    <Route path="notifications" element={<div className="p-8">Notifications (Coming Soon)</div>} />
                    <Route path="security" element={<div className="p-8">Security (Coming in Phase 4)</div>} />
                    <Route path="settings" element={<div className="p-8">Settings (Coming Soon)</div>} />
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
                  <Route
                    path="*"
                    element={
                      <div className="container mx-auto px-4 py-20 text-center">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">404</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Page not found</p>
                      </div>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
          </GoogleOAuthProvider>
        </ThemeProvider>
      </AuthInit>
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
    </Provider>
  );
}

export default App;
