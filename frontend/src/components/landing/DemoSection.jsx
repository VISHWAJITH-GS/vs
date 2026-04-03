import React from 'react'
import LandingSection from './LandingSection'

const DemoSection = ({ onUploadClick, isAnalyzing, uploadLabel }) => {
  return (
    <LandingSection
      id="demo"
      eyebrow="Demo"
      title="Upload your resume and get instant career insights"
      subtitle="Supports PDF and TXT files. Upload once and continue analysis in the dashboard."
    >
      <button type="button" className="demo-dropzone" onClick={onUploadClick} disabled={isAnalyzing}>
        <span className="dropzone-icon">⇪</span>
        <strong>{isAnalyzing ? 'Analyzing your resume...' : 'Drop file here or click to upload'}</strong>
        <p>{uploadLabel}</p>
      </button>
    </LandingSection>
  )
}

export default DemoSection