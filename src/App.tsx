import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { OrdinancesPage } from './pages/OrdinancesPage';
import { OrdinanceDetailPage } from './pages/OrdinanceDetailPage';
import { BarangaysPage } from './pages/BarangaysPage';

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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  </BrowserRouter>
);

export default App;
