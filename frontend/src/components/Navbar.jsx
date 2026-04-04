import React from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/dashboard', label: 'Dashboard', end: false },
]

const Navbar = () => {
  return (
    <nav className="site-nav glass-panel">
      <NavLink to="/" className="site-brand" end>
        <span className="brand-mark" />
        <span>Career Intelligence</span>
      </NavLink>

      <div className="site-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `site-link ${isActive ? 'active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default Navbar