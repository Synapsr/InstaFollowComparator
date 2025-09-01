'use client'

import React, { createContext, useContext } from 'react'
import { useI18n, Language } from '../hooks/useI18n'

interface I18nContextType {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  t: (key: string, variables?: Record<string, string | number>) => string
  availableLanguages: { code: Language; name: string; flag: string }[]
}

const I18nContext = createContext<I18nContextType | null>(null)

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const i18n = useI18n()
  
  return (
    <I18nContext.Provider value={i18n}>
      {children}
    </I18nContext.Provider>
  )
}

export const useTranslation = () => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider')
  }
  return context
}