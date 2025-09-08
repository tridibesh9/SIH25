import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation  from './components/Navigation.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { Marketplace } from './pages/Marketplace.jsx';
import { ProjectDetail } from './pages/ProjectDetail.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Auth } from './pages/Auth.jsx';
import { AdminDashboard } from './pages/AdminDashboard.jsx';
import { Certificate } from './pages/Certificate.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/certificate/:id" element={<Certificate />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;