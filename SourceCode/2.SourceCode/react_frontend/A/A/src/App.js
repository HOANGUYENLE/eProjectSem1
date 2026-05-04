import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AppointmentsPage from './pages/AppointmentsPage';
import ReschedulesPage from './pages/ReschedulesPage';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Appointments', path: '/appointments' },
    { label: 'Reschedule', path: '/reschedules' },
  ];

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate('/')}>
        <div className="nav-logo">⚖</div>
        <span className="nav-brand-name">Legal<em>Ease</em></span>
      </div>

      <ul className="nav-links">
        {links.map(l => (
          <li
            key={l.path}
            className={`nav-link ${
              location.pathname === l.path ||
              (l.path !== '/' && location.pathname.startsWith(l.path))
                ? 'active'
                : ''
            }`}
            onClick={() => navigate(l.path)}
          >
            {l.label}
          </li>
        ))}
      </ul>

      <div className="nav-right">
        <button className="nav-icon-btn" title="Notifications">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="notif-dot" />
        </button>

        <div className="nav-user">
          <div className="user-ava">C</div>
          <span>Customer</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="page-wrap">
        <Navbar />
        <Routes>
          <Route path="/"             element={<AppointmentsPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/reschedules"  element={<ReschedulesPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
