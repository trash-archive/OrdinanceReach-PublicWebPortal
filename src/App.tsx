import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AIChatbot } from './components/ui/AIChatbot';
import { HomePage } from './pages/HomePage';
import { OrdinancesPage } from './pages/OrdinancesPage';
import { OrdinanceDetailPage } from './pages/OrdinanceDetailPage';
import { BarangaysPage } from './pages/BarangaysPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AboutPage } from './pages/AboutPage';

/** Global chatbot — shown on all pages except ordinance detail (which has its own context-aware one) */
const GlobalChatbot: React.FC = () => {
  const location = useLocation();
  const isDetailPage = /^\/ordinances\/[^/]+/.test(location.pathname);
  if (isDetailPage) return null;
  return <AIChatbot theme="navy" />;
};

const App: React.FC = () => (
  <BrowserRouter>
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ordinances" element={<OrdinancesPage />} />
          <Route path="/ordinances/:id" element={<OrdinanceDetailPage />} />
          <Route path="/barangays" element={<BarangaysPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* /help redirects to /about which contains the FAQ */}
          <Route path="/help" element={<Navigate to="/about" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <GlobalChatbot />
    </div>
  </BrowserRouter>
);

export default App;
