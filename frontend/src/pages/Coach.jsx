import React from 'react'
import CoachPage from '../components/dashboard/CoachPage'
import { useCareer } from '../context/CareerContext'

const Coach = () => {
  const {
    analysis,
    handleRewriteResume,
    isRewriting,
    hasRequestedRewrite,
    chatMessages,
    handleSendChat,
    quickPrompts,
    isChatting,
  } = useCareer()

  return (
    <CoachPage
      rewrittenResume={analysis.rewrittenResume}
      onRewrite={handleRewriteResume}
      loadingRewrite={isRewriting}
      hasRequestedRewrite={hasRequestedRewrite}
      messages={chatMessages}
      onSend={handleSendChat}
      quickPrompts={quickPrompts}
      loading={isChatting}
    />
  )
}

export default Coach