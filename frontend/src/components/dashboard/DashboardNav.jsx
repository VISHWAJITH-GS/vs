import React from 'react';

const pages = [
  { id: 'overview', label: 'Overview' },
  { id: 'insights', label: 'Insights' },
  { id: 'opportunities', label: 'Opportunities' },
  { id: 'coach', label: 'Coach' },
];

const DashboardNav = ({ currentPage }) => {
  return (
    <nav className="dashboard-nav glass-panel">
      {pages.map((page) => (
        <a
          key={page.id}
          href={`#${page.id}`}
          className={`nav-pill ${currentPage === page.id ? 'active' : ''}`}
        >
          {page.label}
        </a>
      ))}
    </nav>
  );
};

export default DashboardNav;
