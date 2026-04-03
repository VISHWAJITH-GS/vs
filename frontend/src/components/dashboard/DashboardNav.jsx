import React from 'react';
import { NavLink } from 'react-router-dom'

const pages = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/insights', label: 'Insights', end: true },
  { to: '/dashboard/opportunities', label: 'Opportunities', end: true },
  { to: '/dashboard/vault', label: 'Vault', end: true },
  { to: '/dashboard/coach', label: 'Coach', end: true },
];

const DashboardNav = () => {
  return (
    <nav className="dashboard-nav glass-panel">
      {pages.map((page) => (
        <NavLink
          key={page.to}
          to={page.to}
          end={page.end}
          className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}
        >
          {page.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default DashboardNav;
