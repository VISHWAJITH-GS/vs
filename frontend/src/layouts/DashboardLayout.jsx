import React from 'react'
import { useLocation } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import DashboardNav from '../components/dashboard/DashboardNav'
import Navbar from '../components/Navbar'

const DashboardLayout = () => {
  const location = useLocation()

  const pageMeta = {
    '/dashboard': {
      title: 'Overview',
      copy: 'Overview keeps upload and resume parsing together for rapid iteration.',
    },
    '/dashboard/insights': {
      title: 'Insights',
      copy: 'Review mistakes, skill radar coverage, and practical suggestions to close gaps.',
    },
    '/dashboard/opportunities': {
      title: 'Opportunities',
      copy: 'Explore best-fit roles, salary ranges, and recommended pathways.',
    },
    '/dashboard/vault': {
      title: 'Vault',
      copy: 'Compare saved drafts, restore previous revisions, and track score changes over time.',
    },
    '/dashboard/coach': {
      title: 'Coach',
      copy: 'Use rewrite and chat coaching tools to turn feedback into stronger resume content.',
    },
  }

  const currentMeta = pageMeta[location.pathname] || pageMeta['/dashboard']

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <div className="container hero-layout">
        <Navbar />
        <DashboardNav />

        <section className="page-banner glass-panel">
          <div>
            <p className="eyebrow">Current page</p>
            <h2 className="page-title">{currentMeta.title}</h2>
          </div>
          <p className="page-banner-copy">{currentMeta.copy}</p>
        </section>

        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout