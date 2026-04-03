import React from 'react'
import InsightsPage from '../components/dashboard/InsightsPage'
import { useCareer } from '../context/CareerContext'

const Insights = () => {
  const { analysis, isAnalyzing } = useCareer()

  return (
    <InsightsPage
      mistakes={analysis.mistakes}
      matchedSkills={analysis.skillGap.matched}
      missingSkills={analysis.skillGap.missing}
      suggestions={analysis.suggestions}
      isAnalyzing={isAnalyzing}
    />
  )
}

export default Insights