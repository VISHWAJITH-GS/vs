import React from 'react'
import { useLocation } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import DashboardNav from '../components/dashboard/DashboardNav'
import Navbar from '../components/Navbar'
import StatCard from '../components/dashboard/StatCard'
import { useCareer } from '../context/CareerContext'

const DashboardLayout = () => {
  const location = useLocation()
  const { analysis, savedRevisions } = useCareer()

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

  const heroStats = [
    {
      label: 'Resume score',
      value: `${analysis.resumeScore.overall || 0}/100`,
      detail: analysis.resumeScore.summary || 'Run analysis to generate a score.',
    },
    {
      label: 'Job matches',
      value: `${Array.isArray(analysis.jobMatches) ? analysis.jobMatches.length : 0}`,
      detail: 'Relevant roles generated from the current profile.',
    },
    {
      label: 'Saved revisions',
      value: `${savedRevisions.length}`,
      detail: 'Drafts stored locally for later comparison.',
    },
  ]

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <div className="container hero-layout">
        <header className="hero-panel glass-panel">
          <div className="hero-copy">
            <p className="eyebrow">AI Career Intelligence Platform</p>
            <h1 className="glass-title">Resume to Role Intelligence</h1>
            <p className="glass-subtitle">
              Analyze resume quality, inspect role fit, save revisions, and coach your next career move.
            </p>
          </div>

          <div className="hero-metrics">
            {heroStats.map((item) => (
              <StatCard key={item.label} label={item.label} value={item.value} detail={item.detail} />
            ))}
          </div>
        </header>

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