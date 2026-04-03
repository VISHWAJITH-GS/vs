import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const API_BASE_URL = 'http://localhost:8000'
const STORAGE_KEYS = {
  draft: 'career_intelligence_draft_v1',
  revisions: 'career_intelligence_revisions_v1',
  compareRevisionId: 'career_intelligence_compare_revision_v1',
}

const emptyReport = {
  parsedResume: {
    name: '',
    headline: '',
    summary: '',
    skills: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    portfolioLinks: [],
  },
  resumeScore: {
    overall: 0,
    breakdown: {
      skills: 0,
      experience: 0,
      projects: 0,
      keywordMatch: 0,
      formatting: 0,
    },
    summary: '',
    strengths: [],
    weaknesses: [],
  },
  mistakes: [],
  skillGap: {
    targetRole: '',
    matched: [],
    missing: [],
    prioritySkills: [],
  },
  suggestions: [],
  rewrittenResume: {
    headline: '',
    summary: '',
    bulletPoints: [],
    fullText: '',
  },
  jobMatches: [],
  salaryInsights: [],
  careerRecommendations: [],
  coachStarter: [],
}

const CareerContext = createContext(null)

function safeReadJson(key, fallback) {
  if (typeof window === 'undefined') return fallback

  try {
    const rawValue = window.localStorage.getItem(key)
    return rawValue ? JSON.parse(rawValue) : fallback
  } catch {
    return fallback
  }
}

function safeWriteJson(key, value) {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage quota or serialization failures.
  }
}

function buildRevisionLabel(targetRole, analysis, revisionCount) {
  const candidateName = analysis?.parsedResume?.name?.trim()
  const coreLabel = candidateName || targetRole || 'Resume'
  return `${coreLabel} Revision ${revisionCount + 1}`
}

function cloneAnalysis(value) {
  return JSON.parse(JSON.stringify(value || emptyReport))
}

export const CareerProvider = ({ children }) => {
  const initialDraft = safeReadJson(STORAGE_KEYS.draft, {
    resumeText: '',
    editableResumeText: '',
    targetRole: '',
    uploadLabel: 'Choose Resume PDF or TXT',
  })

  const [resumeText, setResumeText] = useState(initialDraft.resumeText || '')
  const [editableResumeText, setEditableResumeText] = useState(initialDraft.editableResumeText || '')
  const [targetRole, setTargetRole] = useState(initialDraft.targetRole || '')
  const [uploadLabel, setUploadLabel] = useState(initialDraft.uploadLabel || 'Choose Resume PDF or TXT')
  const [analysis, setAnalysis] = useState(emptyReport)
  const [savedRevisions, setSavedRevisions] = useState(() => safeReadJson(STORAGE_KEYS.revisions, []))
  const [compareRevisionId, setCompareRevisionId] = useState(() => safeReadJson(STORAGE_KEYS.compareRevisionId, ''))
  const [selectedJob, setSelectedJob] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Upload a resume, run analysis, and I will coach you through the next steps.' },
  ])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isRewriting, setIsRewriting] = useState(false)
  const [isChatting, setIsChatting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    safeWriteJson(STORAGE_KEYS.draft, {
      resumeText,
      editableResumeText,
      targetRole,
      uploadLabel,
    })
  }, [resumeText, editableResumeText, targetRole, uploadLabel])

  useEffect(() => {
    safeWriteJson(STORAGE_KEYS.revisions, savedRevisions)
  }, [savedRevisions])

  useEffect(() => {
    safeWriteJson(STORAGE_KEYS.compareRevisionId, compareRevisionId)
  }, [compareRevisionId])

  useEffect(() => {
    if (compareRevisionId && !savedRevisions.some((revision) => revision.id === compareRevisionId)) {
      setCompareRevisionId(savedRevisions[0]?.id || '')
    }
  }, [savedRevisions, compareRevisionId])

  const currentRevision = useMemo(
    () => ({
      id: 'current-draft',
      label: targetRole ? `Current: ${targetRole}` : 'Current Draft',
      targetRole,
      analysis,
    }),
    [analysis, targetRole]
  )

  const quickPrompts = analysis.coachStarter.length
    ? analysis.coachStarter
    : [
        'What should I improve first?',
        'How do I increase my resume score?',
        'Which role fits this profile best?',
      ]

  const clearReport = () => {
    setAnalysis(emptyReport)
    setSelectedJob('')
  }

  const analyzeResume = async (textToAnalyze = editableResumeText || resumeText) => {
    const trimmedText = typeof textToAnalyze === 'string' ? textToAnalyze.trim() : ''
    if (!trimmedText) {
      setError('Please upload or paste resume text before running analysis.')
      return
    }

    setIsAnalyzing(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: trimmedText, targetRole }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to analyze the resume.')
      }

      const report = await response.json()
      setAnalysis(report)
      setChatMessages([
        { role: 'assistant', content: 'The analysis is ready. Ask follow-up questions about score, rewrite, job fit, or salary.' },
      ])
    } catch (requestError) {
      setError(requestError.message || 'An error occurred during analysis.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    clearReport()
    setError('')
    setUploadLabel(file.name)

    const isTextFile = file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')

    try {
      let extractedText = ''

      if (isTextFile) {
        extractedText = await file.text()
      } else {
        const formData = new FormData()
        formData.append('file', file)

        const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          body: formData,
        })

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json().catch(() => ({}))
          throw new Error(errorData.error || 'File upload failed')
        }

        const uploadData = await uploadRes.json()
        extractedText = uploadData.text || ''
      }

      if (!extractedText.trim()) {
        throw new Error('No text could be extracted from the file.')
      }

      setResumeText(extractedText)
      setEditableResumeText(extractedText)
      await analyzeResume(extractedText)
    } catch (requestError) {
      setError(requestError.message || 'An error occurred while reading the resume.')
    }
  }

  const handleRewriteResume = async () => {
    const textToRewrite = editableResumeText || resumeText
    if (!textToRewrite.trim()) {
      setError('Upload or paste resume text before requesting a rewrite.')
      return
    }

    setIsRewriting(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/rewrite-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: textToRewrite,
          targetRole,
          focusAreas: analysis?.suggestions || [],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to rewrite resume.')
      }

      const responseData = await response.json()
      setAnalysis((current) => ({
        ...current,
        rewrittenResume: responseData.rewrittenResume || current.rewrittenResume,
      }))
    } catch (requestError) {
      setError(requestError.message || 'Unable to rewrite the resume.')
    } finally {
      setIsRewriting(false)
    }
  }

  const handleSelectJob = async (jobRole) => {
    setSelectedJob(jobRole)
    setTargetRole(jobRole)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: editableResumeText || resumeText, targetRole: jobRole }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to recalculate job fit.')
      }

      const report = await response.json()
      setAnalysis(report)
    } catch (requestError) {
      setError(requestError.message || 'Failed during deeper analysis.')
    }
  }

  const handleSendChat = async (message) => {
    const nextMessages = [...chatMessages, { role: 'user', content: message }]
    setChatMessages(nextMessages)
    setIsChatting(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/career-coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages,
          resumeText: editableResumeText || resumeText,
          targetRole,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Coach request failed.')
      }

      const coachData = await response.json()
      setChatMessages((current) => [
        ...current,
        { role: 'assistant', content: coachData.reply || 'I can help refine the resume and career plan.' },
      ])
    } catch (requestError) {
      setError(requestError.message || 'Failed to contact the career coach.')
      setChatMessages((current) => [...current, { role: 'assistant', content: 'The coach request failed. Please try again.' }])
    } finally {
      setIsChatting(false)
    }
  }

  const handleSaveRevision = () => {
    const currentText = editableResumeText || resumeText
    if (!currentText.trim()) {
      setError('Add resume text before saving a revision.')
      return
    }

    const revision = {
      id: `revision-${Date.now()}`,
      label: buildRevisionLabel(targetRole, analysis, savedRevisions.length),
      targetRole,
      resumeText: currentText,
      analysis: cloneAnalysis(analysis),
      savedAt: new Date().toISOString(),
    }

    setSavedRevisions((current) => [revision, ...current])
    setCompareRevisionId(revision.id)
    setError('')
  }

  const handleRestoreRevision = (revisionId) => {
    const revision = savedRevisions.find((item) => item.id === revisionId)
    if (!revision) return

    setResumeText(revision.resumeText || '')
    setEditableResumeText(revision.resumeText || '')
    setTargetRole(revision.targetRole || '')
    setAnalysis(revision.analysis || emptyReport)
    setSelectedJob('')
    setUploadLabel(`Restored: ${revision.label}`)
    setCompareRevisionId(revision.id)
    setError('')
  }

  const handleDeleteRevision = (revisionId) => {
    setSavedRevisions((current) => current.filter((revision) => revision.id !== revisionId))
  }

  const value = {
    uploadLabel,
    isAnalyzing,
    isRewriting,
    isChatting,
    targetRole,
    editableResumeText,
    resumeText,
    analysis,
    savedRevisions,
    compareRevisionId,
    currentRevision,
    selectedJob,
    chatMessages,
    quickPrompts,
    error,
    setTargetRole,
    setEditableResumeText,
    setCompareRevisionId,
    analyzeResume,
    handleFileUpload,
    handleRewriteResume,
    handleSelectJob,
    handleSendChat,
    handleSaveRevision,
    handleRestoreRevision,
    handleDeleteRevision,
  }

  return <CareerContext.Provider value={value}>{children}</CareerContext.Provider>
}

export function useCareer() {
  const value = useContext(CareerContext)
  if (!value) {
    throw new Error('useCareer must be used within CareerProvider')
  }
  return value
}
