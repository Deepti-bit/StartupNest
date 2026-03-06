import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api, { setAccessToken } from './Services/api';

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

// Mentor Components
import StartupSubmissions from './MentorComponents/StartupSubmissions';
import ViewStartupProfiles from './MentorComponents/ViewStartupProfiles';
import StartupProfileForm from './MentorComponents/StartupProfileForm';
import EntrepreneurHome from './EntrepreneurComponents/EntrepreneurHomePage';

function App() {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const refreshStartup = async () => {
      try {
        const res = await api.get("/user/refresh");
        setAccessToken(res.data.accessToken);
      } catch (err) {
        console.log("No valid session found");
      } finally {
        setIsInitializing(false);
      }
    };
    refreshStartup();
  }, []);

  if (isInitializing) return <div>Loading Secure Session...</div>;
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<HomePage />} />


      <Route element={<PrivateRoute allowedRoles={['Admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={['Entrepreneur']} />}>
        <Route path="/entrepreneur/home" element={<EntrepreneurHome />} />
        <Route path="/entrepreneur/submit-idea" element={<SubmitIdea />} />
        <Route path="/entrepreneur/my-submissions" element={<MySubmissions />} />
        <Route path="/entrepreneur/opportunities" element={<ViewStartupOpportunities />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={['Mentor']} />}>
        <Route path="/mentor/dashboard" element={<StartupSubmissions />} />
        <Route path="/mentor/submissions" element={<StartupSubmissions />} />
        <Route path="/mentor/profiles" element={<ViewStartupProfiles />} />
        <Route path="/mentor/create-profile" element={<StartupProfileForm />} />
      </Route>

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;