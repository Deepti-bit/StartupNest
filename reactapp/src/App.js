import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import AdminDashboard from './Admin/AdminDashboard';
// WRONG PATH
// CORRECT PATH (based on Page 22 of your PDF)
import EntrepreneurNavbar from './EntrepreneurComponents/EntrepreneurNavbar';

// API and Auth
import api, { setAccessToken } from './Services/api';

// Components
import Login from './Components/Login';
import Signup from './Components/Signup';

// Dummy Components for Entrepreneur modules (Replace with your actual files later)
const Home = () => <div className="p-20 text-white text-center"><h1>Welcome to Entrepreneur Home</h1></div>;
const MentorOpportunities = () => <div className="p-20 text-white text-center"><h1>Available Mentor Opportunities</h1></div>;
const MySubmissions = () => <div className="p-20 text-white text-center"><h1>My Startup Submissions</h1></div>;

// --- 1. PROTECTED ROUTE WRAPPER ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem('role');
  const tokenExistsInLocalStorage = !!role; 

  if (!tokenExistsInLocalStorage) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await api.get('/user/refresh');
        setAccessToken(res.data.accessToken);
      } catch (err) {
        console.log("No active session found.");
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.clear();
        }
      } finally {
        setIsInitializing(false);
      }
    };
    initAuth();
  }, []);

  if (isInitializing) {
    return (
      <div className="h-screen w-full bg-[#002a5c] flex flex-col items-center justify-center text-white">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-2xl"
        >
          <span className="text-[#002a5c] font-black text-2xl">S</span>
        </motion.div>
        <div className="flex items-center gap-2 text-blue-200 font-bold text-xs uppercase tracking-[0.3em]">
          <Loader2 className="animate-spin" size={14} /> Initializing Ecosystem
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {/* Public Routes */}
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />

          {/* --- ENTREPRENEUR ROUTES (NAVBAR ADDED HERE) --- */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute allowedRoles={['Entrepreneur']}>
                <EntrepreneurNavbar /> {/* Navbar stays fixed at top */}
                <PageWrapper><Home /></PageWrapper> {/* Page content animates below */}
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/mentor-opportunities" 
            element={
              <ProtectedRoute allowedRoles={['Entrepreneur']}>
                <EntrepreneurNavbar />
                <PageWrapper><MentorOpportunities /></PageWrapper>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/my-submissions" 
            element={
              <ProtectedRoute allowedRoles={['Entrepreneur']}>
                <EntrepreneurNavbar />
                <PageWrapper><MySubmissions /></PageWrapper>
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <PageWrapper><AdminDashboard /></PageWrapper>
              </ProtectedRoute>
            }
          />

          {/* Default Redirection */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

// --- 4. ANIMATION WRAPPER FOR PAGES ---
const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

export default App;