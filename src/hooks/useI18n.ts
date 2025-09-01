import { useState, useEffect, useCallback } from 'react'

// Import all translations
import en from '../locales/en.json'
import fr from '../locales/fr.json'
import de from '../locales/de.json'
import es from '../locales/es.json'
import zh from '../locales/zh.json'

export type Language = 'en' | 'fr' | 'de' | 'es' | 'zh'
export type TranslationKey = string

const translations = {
  en,
  fr,
  de,
  es,
  zh
} as const

const STORAGE_KEY = 'preferred-language'

// Detect browser language and map to supported languages
const detectBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en'
  
  const browserLang = navigator.language.toLowerCase()
  
  // Map browser languages to supported languages
  if (browserLang.startsWith('fr')) return 'fr'
  if (browserLang.startsWith('de')) return 'de' 
  if (browserLang.startsWith('es')) return 'es'
  if (browserLang.startsWith('zh')) return 'zh'
  
  // Default to English
  return 'en'
}

// Get nested translation value
const getNestedValue = (obj: Record<string, unknown>, path: string): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = path.split('.').reduce((current: any, key: string) => current?.[key], obj)
  return typeof result === 'string' ? result : path
}

export const useI18n = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en'
    
    // Check localStorage first, then browser language
    const saved = localStorage.getItem(STORAGE_KEY) as Language
    if (saved && saved in translations) {
      return saved
    }
    
    return detectBrowserLanguage()
  })

  // Save language preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, currentLanguage)
    }
  }, [currentLanguage])

  // Translation function
  const t = useCallback((key: TranslationKey, variables?: Record<string, string | number>): string => {
    let translation = getNestedValue(translations[currentLanguage], key)
    
    // Replace variables in translation
    if (variables) {
      Object.entries(variables).forEach(([varKey, value]) => {
        translation = translation.replace(new RegExp(`{${varKey}}`, 'g'), String(value))
      })
    }
    
    return translation
  }, [currentLanguage])

  // Change language function
  const setLanguage = useCallback((language: Language) => {
    setCurrentLanguage(language)
  }, [])

  // Get available languages
  const availableLanguages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ]

  return {
    currentLanguage,
    setLanguage,
    t,
    availableLanguages
  }
}