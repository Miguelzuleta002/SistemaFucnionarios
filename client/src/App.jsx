import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Guardia de rutas para proteger el Dashboard
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const NotFound = () => (
  <div className="app-layout" style={{ justifyContent: 'center', alignItems: 'center' }}>
    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
      <h1 style={{ color: 'var(--danger)', fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
      <p style={{ color: 'var(--text-muted)' }}>Página no encontrada</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Ruta Pública */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas Privadas */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
