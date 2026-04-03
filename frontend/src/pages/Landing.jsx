import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCareer } from '../context/CareerContext'
import LandingNavbar from '../components/landing/LandingNavbar'
import HeroSection from '../components/landing/HeroSection'
import ProblemSection from '../components/landing/ProblemSection'
import SolutionSection from '../components/landing/SolutionSection'
import HowItWorksSection from '../components/landing/HowItWorksSection'
import DashboardPreviewSection from '../components/landing/DashboardPreviewSection'
import DemoSection from '../components/landing/DemoSection'
import InnovationSection from '../components/landing/InnovationSection'
import FinalCTASection from '../components/landing/FinalCTASection'
import LandingFooter from '../components/landing/LandingFooter'
import '../styles/landing.css'

const Landing = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const { uploadLabel, handleFileUpload, isAnalyzing, error, analysis } = useCareer()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  const handleUploadChange = async (event) => {
    await handleFileUpload(event)
    navigate('/dashboard')
  }

  const openUploadPicker = () => {
    if (!isAnalyzing) {
      fileInputRef.current?.click()
    }
  }

  const scrollToDemo = () => {
    const node = document.getElementById('demo')
    node?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="app-shell landing-page" id="home">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <div className="container hero-layout">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.txt"
          onChange={handleUploadChange}
          disabled={isAnalyzing}
          className="file-input"
        />

        <LandingNavbar onUploadClick={openUploadPicker} isAnalyzing={isAnalyzing} />

        <HeroSection
          onUploadClick={openUploadPicker}
          onViewDemo={scrollToDemo}
          isAnalyzing={isAnalyzing}
          uploadLabel={uploadLabel}
          analysis={analysis}
          error={error}
        />

        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <DashboardPreviewSection />
        <DemoSection onUploadClick={openUploadPicker} isAnalyzing={isAnalyzing} uploadLabel={uploadLabel} />
        <InnovationSection />
        <FinalCTASection onUploadClick={openUploadPicker} isAnalyzing={isAnalyzing} />
        <LandingFooter />
      </div>
    </div>
  )
}

export default Landing