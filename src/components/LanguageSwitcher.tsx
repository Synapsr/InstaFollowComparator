'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Globe } from 'lucide-react'
import { useTranslation } from '../contexts/I18nContext'
import { Language } from '../hooks/useI18n'

export default function LanguageSwitcher() {
  const { currentLanguage, setLanguage, availableLanguages } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLang = availableLanguages.find(lang => lang.code === currentLanguage)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const handleLanguageSelect = (languageCode: Language) => {
    setLanguage(languageCode)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm hover:shadow-md"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLang?.flag}</span>
        <span className="hidden sm:inline text-sm">{currentLang?.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 z-[9999] mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
            {availableLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${
                  currentLanguage === language.code 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
                {currentLanguage === language.code && (
                  <div className="ml-auto w-2 h-2 bg-primary-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}