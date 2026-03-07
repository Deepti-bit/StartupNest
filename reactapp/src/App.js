import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import api, { setAccessToken } from './Services/api';
import { AuthProvider, useAuth } from './context/authContext';

// Public Components
import Login from './Components/Login';
import Signup from './Components/Signup';
import HomePage from './Components/HomePage';
import ErrorPage from './Components/ErrorPage';
import PrivateRoute from './Components/PrivateRoute';

// Admin Components
import AdminDashboard from './Admin/AdminDashboard';

// Entrepreneur Components
import SubmitIdea from './EntrepreneurComponents/SubmitIdea';
import MySubmissions from './EntrepreneurComponents/MySubmissions';
import ViewStartupOpportunities from './EntrepreneurComponents/ViewStartupOpportunities';
import EntrepreneurHome from './EntrepreneurComponents/EntrepreneurHomePage';

// Mentor Components
import StartupSubmissions from './MentorComponents/StartupSubmissions';
import ViewStartupProfiles from './MentorComponents/ViewStartupProfiles';
import StartupProfileForm from './MentorComponents/StartupProfileForm';

function AppContent() {
  const [isInitializing, setIsInitializing] = useState(true);
  const { setUser } = useAuth(); 

  useEffect(() => {
    const refreshStartup = async () => {
      try {
        // 1. Ask backend for a new token using the HttpOnly cookie
        const res = await api.get("/user/refresh");
        
        // DEBUG: See exactly what your backend is sending
        console.log("Session Restore Data:", res.data);

        setAccessToken(res.data.accessToken);

        // 2. Map data carefully (Handles nested 'user' object or flat response)
        const userData = {
          role: res.data.role || res.data.user?.role,
          userName: res.data.userName || res.data.user?.userName || res.data.name || res.data.user?.name,
          userId: res.data.ID || res.data._id || res.data.user?.id || res.data.user?._id
        };

        setUser(userData);
        console.log("Secure session restored for:", userData.userName);
      } catch (err) {
        console.log("No active session found.");
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    refreshStartup();
  }, [setUser]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-center">
        <div>
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Securing Session</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* --- ADMIN ROUTES --- */}
      <Route element={<PrivateRoute allowedRoles={['Admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

      {/* --- ENTREPRENEUR ROUTES --- */}
      <Route element={<PrivateRoute allowedRoles={['Entrepreneur']} />}>
        <Route path="/entrepreneur/home" element={<EntrepreneurHome />} />
        <Route path="/entrepreneur/submit-idea" element={<SubmitIdea />} />
        <Route path="/entrepreneur/my-submissions" element={<MySubmissions />} />
        <Route path="/entrepreneur/opportunities" element={<ViewStartupOpportunities />} />
      </Route>

      {/* --- MENTOR ROUTES --- */}
      <Route element={<PrivateRoute allowedRoles={['Mentor']} />}>
        <Route path="/mentor/dashboard" element={<StartupSubmissions />} />
        <Route path="/mentor/submissions" element={<StartupSubmissions />} />
        <Route path="/mentor/profiles" element={<ViewStartupProfiles />} />
        <Route path="/mentor/create-profile" element={<StartupProfileForm />} />
      </Route>

      {/* --- 404 --- */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;