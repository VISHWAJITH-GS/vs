import React from 'react'
import OpportunitiesPage from '../components/dashboard/OpportunitiesPage'
import { useCareer } from '../context/CareerContext'

const Opportunities = () => {
  const { analysis, selectedJob, handleSelectJob } = useCareer()

  return (
    <OpportunitiesPage
      jobMatches={analysis.jobMatches}
      selectedJob={selectedJob}
      onSelectJob={handleSelectJob}
      salaryInsights={analysis.salaryInsights}
      careerRecommendations={analysis.careerRecommendations}
      analysis={analysis}
    />
  )
}

export default Opportunities