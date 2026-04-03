import React from 'react'
import OverviewPage from '../components/dashboard/OverviewPage'
import { useCareer } from '../context/CareerContext'

const Overview = () => {
  const {
    uploadLabel,
    isAnalyzing,
    isRewriting,
    targetRole,
    editableResumeText,
    resumeText,
    analysis,
    error,
    setTargetRole,
    setEditableResumeText,
    handleFileUpload,
    analyzeResume,
    handleRewriteResume,
    handleSaveRevision,
  } = useCareer()

  return (
    <OverviewPage
      workflowProps={{
        uploadLabel,
        isAnalyzing,
        isRewriting,
        targetRole,
        onTargetRoleChange: setTargetRole,
        editableResumeText,
        onResumeTextChange: setEditableResumeText,
        onFileUpload: handleFileUpload,
        onAnalyze: () => analyzeResume(),
        onRewrite: handleRewriteResume,
        onSaveRevision: handleSaveRevision,
        canSaveRevision: Boolean((editableResumeText || resumeText).trim()),
        error,
      }}
      parsedResume={analysis.parsedResume}
      resumeScore={analysis.resumeScore}
      skills={analysis.parsedResume.skills}
      matchedSkills={analysis.skillGap.matched}
      missingSkills={analysis.skillGap.missing}
    />
  )
}

export default Overview