import React from 'react'
import RevisionVault from '../components/dashboard/RevisionVault'
import { useCareer } from '../context/CareerContext'

const Vault = () => {
  const {
    savedRevisions,
    currentRevision,
    compareRevisionId,
    setCompareRevisionId,
    handleSaveRevision,
    editableResumeText,
    resumeText,
    handleRestoreRevision,
    handleDeleteRevision,
  } = useCareer()

  return (
    <div className="page-stack">
      <RevisionVault
        revisions={savedRevisions}
        currentRevision={currentRevision}
        compareRevisionId={compareRevisionId}
        onCompareRevisionChange={setCompareRevisionId}
        onSaveCurrent={handleSaveRevision}
        canSaveCurrent={Boolean((editableResumeText || resumeText).trim())}
        onRestoreRevision={handleRestoreRevision}
        onDeleteRevision={handleDeleteRevision}
      />
    </div>
  )
}

export default Vault