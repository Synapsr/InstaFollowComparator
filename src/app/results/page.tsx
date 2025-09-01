'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Users, UserPlus, UserMinus, Heart, ExternalLink, Download, Share2, UserCheck, Clock, UserX, Send, Search, X } from 'lucide-react'
import { ComparisonResult, InstagramUser } from '../../types/instagram'
import { useTranslation } from '../../contexts/I18nContext'
import LanguageSwitcher from '../../components/LanguageSwitcher'

export default function ResultsPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [results, setResults] = useState<ComparisonResult | null>(null)
  const [activeTab, setActiveTab] = useState<'mutual' | 'youFollow' | 'theyFollow' | 'closeFriends' | 'pending' | 'recentRequests' | 'unfollowed'>('mutual')
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const storedResults = sessionStorage.getItem('instagramComparison')
    if (storedResults) {
      setResults(JSON.parse(storedResults))
    } else {
      router.push('/')
    }
    setLoading(false)
  }, [router])

  const handleExportData = () => {
    if (!results) return
    
    const data = {
      generatedAt: new Date().toISOString(),
      statistics: {
        totalFollowers: results.totalFollowers,
        totalFollowing: results.totalFollowing,
        mutualFollows: results.mutualFollows.length,
        youFollowButNotBack: results.youFollowButNotBack.length,
        theyFollowButNotBack: results.theyFollowButNotBack.length
      },
      relationships: results
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `instagram-follow-analysis-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    if (!results) return
    
    const shareText = t('results.share.text', {
      mutualCount: results.mutualFollows.length,
      youFollowCount: results.youFollowButNotBack.length,
      theyFollowCount: results.theyFollowButNotBack.length,
      url: window.location.origin
    })
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('results.share.title'),
          text: shareText
        })
      } catch (error) {
        console.log('Share failed:', error)
      }
    } else {
      navigator.clipboard.writeText(shareText)
      alert(t('results.share.copied'))
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filterUsers = (users: InstagramUser[], query: string): InstagramUser[] => {
    if (!query.trim()) return users
    const lowercaseQuery = query.toLowerCase()
    return users.filter(user => 
      user.value.toLowerCase().includes(lowercaseQuery)
    )
  }

  const getCurrentUsers = (): InstagramUser[] => {
    if (!results) return []
    
    let users: InstagramUser[] = []
    switch (activeTab) {
      case 'mutual':
        users = results.mutualFollows
        break
      case 'youFollow':
        users = results.youFollowButNotBack
        break
      case 'theyFollow':
        users = results.theyFollowButNotBack
        break
      case 'closeFriends':
        users = results.closeFriends || []
        break
      case 'pending':
        users = results.pendingFollowRequests || []
        break
      case 'recentRequests':
        users = results.recentFollowRequests || []
        break
      case 'unfollowed':
        users = results.recentlyUnfollowed || []
        break
    }
    
    return filterUsers(users, searchQuery)
  }

  const handleTabChange = (tabKey: typeof activeTab) => {
    setActiveTab(tabKey)
    setSearchQuery('') // Clear search when switching tabs for better UX
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search with Ctrl+F or Cmd+F
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        const searchInput = document.getElementById('search-input')
        if (searchInput) {
          searchInput.focus()
        }
      }
      // Clear search with Escape
      if (e.key === 'Escape' && searchQuery) {
        setSearchQuery('')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [searchQuery])

  const HighlightedText = ({ text, highlight }: { text: string, highlight: string }) => {
    if (!highlight.trim()) {
      return <span>{text}</span>
    }

    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)

    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) ? (
            <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    )
  }

  const UserList = ({ users, icon, emptyMessage }: { 
    users: InstagramUser[], 
    icon: React.ReactNode,
    emptyMessage: string 
  }) => (
    <div className="space-y-3">
      {users.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            {icon}
          </div>
          <p>{emptyMessage}</p>
        </div>
      ) : (
        users.map((user) => (
          <div key={user.value} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-300 rounded-full flex items-center justify-center text-white font-semibold">
                {user.value.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  @<HighlightedText text={user.value} highlight={searchQuery} />
                </p>
                <p className="text-sm text-gray-500">
                  {t('results.user.since', { date: formatDate(user.timestamp) })}
                </p>
              </div>
            </div>
            <a
              href={user.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-primary-500 hover:text-primary-600 transition-colors"
            >
              <span className="text-sm">{t('results.user.view')}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ))
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-orange-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('results.loading')}</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-orange-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{t('results.noResults')}</p>
          <button 
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            {t('results.goBackHome')}
          </button>
        </div>
      </div>
    )
  }

  const tabConfig = [
    {
      key: 'mutual' as const,
      label: t('results.tabs.mutual'),
      count: results.mutualFollows.length,
      icon: <Heart className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      key: 'youFollow' as const,
      label: t('results.tabs.youFollow'),
      count: results.youFollowButNotBack.length,
      icon: <UserMinus className="w-5 h-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      key: 'theyFollow' as const,
      label: t('results.tabs.theyFollow'),
      count: results.theyFollowButNotBack.length,
      icon: <UserPlus className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    // Additional tabs for optional data
    ...(results.closeFriends && results.closeFriends.length > 0 ? [{
      key: 'closeFriends' as const,
      label: t('results.tabs.closeFriends'),
      count: results.closeFriends.length,
      icon: <UserCheck className="w-5 h-5" />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    }] : []),
    ...(results.pendingFollowRequests && results.pendingFollowRequests.length > 0 ? [{
      key: 'pending' as const,
      label: t('results.tabs.pending'),
      count: results.pendingFollowRequests.length,
      icon: <Send className="w-5 h-5" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    }] : []),
    ...(results.recentFollowRequests && results.recentFollowRequests.length > 0 ? [{
      key: 'recentRequests' as const,
      label: t('results.tabs.recentRequests'),
      count: results.recentFollowRequests.length,
      icon: <Clock className="w-5 h-5" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    }] : []),
    ...(results.recentlyUnfollowed && results.recentlyUnfollowed.length > 0 ? [{
      key: 'unfollowed' as const,
      label: t('results.tabs.unfollowed'),
      count: results.recentlyUnfollowed.length,
      icon: <UserX className="w-5 h-5" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    }] : [])
  ]

  const activeConfig = tabConfig.find(tab => tab.key === activeTab)!

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-orange-50">
      {/* Header */}
      <header className="px-6 py-4 bg-white/70 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t('results.backToHome')}</span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{t('results.shareButton')}</span>
            </button>
            <button
              onClick={handleExportData}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{t('results.exportButton')}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Statistics Overview */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {t('results.title')}
            </h1>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="card text-center">
                <Users className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-900">{results.totalFollowers}</p>
                <p className="text-sm text-gray-600">{t('results.stats.totalFollowers')}</p>
              </div>
              <div className="card text-center">
                <UserPlus className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-900">{results.totalFollowing}</p>
                <p className="text-sm text-gray-600">{t('results.stats.totalFollowing')}</p>
              </div>
              <div className="card text-center">
                <Heart className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-900">{results.mutualFollows.length}</p>
                <p className="text-sm text-gray-600">{t('results.stats.mutualFollows')}</p>
              </div>
              <div className="card text-center">
                <div className="w-8 h-8 text-primary-500 mx-auto mb-3 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-primary-500"></div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {((results.mutualFollows.length / Math.max(results.totalFollowing, 1)) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">{t('results.stats.followBackRate')}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4">
              {tabConfig.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.key
                      ? `${tab.color} ${tab.bgColor} ${tab.borderColor} border-2`
                      : 'text-gray-600 bg-white border-2 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    activeTab === tab.key ? 'bg-white/50' : 'bg-gray-100'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="card">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${activeConfig.bgColor}`}>
                  <div className={activeConfig.color}>
                    {activeConfig.icon}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {activeConfig.label} ({searchQuery ? getCurrentUsers().length : activeConfig.count})
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {activeTab === 'mutual' && t('results.descriptions.mutual')}
                    {activeTab === 'youFollow' && t('results.descriptions.youFollow')}
                    {activeTab === 'theyFollow' && t('results.descriptions.theyFollow')}
                    {activeTab === 'closeFriends' && t('results.descriptions.closeFriends')}
                    {activeTab === 'pending' && t('results.descriptions.pending')}
                    {activeTab === 'recentRequests' && t('results.descriptions.recentRequests')}
                    {activeTab === 'unfollowed' && t('results.descriptions.unfollowed')}
                  </p>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="relative max-w-sm w-full lg:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="search-input"
                  type="text"
                  placeholder={t('results.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-20 py-2.5 border border-gray-300 rounded-lg bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm focus:shadow-md"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  {searchQuery ? (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mr-2 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-md hover:bg-gray-100"
                      title={t('results.search.clearSearch')}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : (
                    <div className="mr-3 text-xs text-gray-400 hidden sm:block">
                      ⌘F
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Search Results Info */}
            {searchQuery && (
              <div className="mb-4 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  {getCurrentUsers().length > 0 ? (
                    <span dangerouslySetInnerHTML={{ __html: t('results.search.found', { count: getCurrentUsers().length, query: searchQuery, plural: getCurrentUsers().length !== 1 ? 's' : '' }) }}></span>
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: t('results.search.notFound', { query: searchQuery }) }}></span>
                  )}
                </p>
              </div>
            )}

            <div className="max-h-96 overflow-y-auto">
              <UserList
                users={getCurrentUsers()}
                icon={activeConfig.icon}
                emptyMessage={searchQuery 
                  ? t('results.empty.searchNoResults', { query: searchQuery })
                  : activeTab === 'mutual' ? t('results.empty.mutual')
                  : activeTab === 'youFollow' ? t('results.empty.youFollow')
                  : activeTab === 'theyFollow' ? t('results.empty.theyFollow')
                  : activeTab === 'closeFriends' ? t('results.empty.closeFriends')
                  : activeTab === 'pending' ? t('results.empty.pending')
                  : activeTab === 'recentRequests' ? t('results.empty.recentRequests')
                  : t('results.empty.unfollowed')
                }
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-500 text-sm mb-3">{t('footer.proudlyCreatedBy')}</p>
            <svg className="w-48 h-auto opacity-80 mx-auto" viewBox="0 0 598.01 152.21">
              <path className="fill-gray-400" d="m73.32,58.71c-5.77-2.7-12.63-4.37-20.58-5.01l-12.87-1.11c-6.46-.53-11.34-2.44-14.62-5.72-3.28-3.28-4.92-7.04-4.92-11.28,0-3.71.93-7.18,2.78-10.41,1.85-3.23,4.66-5.85,8.42-7.86,3.76-2.01,8.5-3.02,14.22-3.02s10.75,1.06,14.46,3.18c3.71,2.12,6.43,4.82,8.18,8.1,1.75,3.28,2.62,6.78,2.62,10.49h15.57c0-7.41-1.72-13.8-5.16-19.15-3.44-5.35-8.24-9.51-14.38-12.47C60.9,1.48,53.81,0,45.76,0s-15.31,1.51-21.45,4.53c-6.15,3.02-10.94,7.18-14.38,12.47-3.44,5.3-5.16,11.49-5.16,18.59,0,9,3.07,16.26,9.21,21.77,6.14,5.51,14.35,8.69,24.63,9.53l12.87,1.11c7.94.74,13.98,2.68,18.11,5.8,4.13,3.13,6.2,7.07,6.2,11.84,0,3.92-1.06,7.55-3.18,10.88-2.12,3.34-5.4,6.04-9.85,8.1-4.45,2.07-10.17,3.1-17.16,3.1-7.52,0-13.48-1.16-17.87-3.5-4.4-2.33-7.52-5.24-9.37-8.74-1.85-3.5-2.78-6.99-2.78-10.49H0C0,92.1,1.8,98.46,5.4,104.07c3.6,5.62,8.79,10.01,15.57,13.19,6.78,3.18,14.99,4.77,24.63,4.77,9.11,0,17.1-1.54,23.99-4.61,6.89-3.07,12.23-7.36,16.05-12.87,3.81-5.5,5.72-11.81,5.72-18.91,0-6.25-1.57-11.62-4.69-16.13-3.13-4.5-7.57-8.1-13.35-10.8Z"></path>
              <path className="fill-gray-400" d="m140.58,104.54h-3.31l-24.62-70.23h-15.57l30.35,82.94h9.38l-2.08,6.99c-1.06,3.5-2.41,6.3-4.05,8.42-1.64,2.12-3.71,3.63-6.2,4.53-2.49.9-5.54,1.35-9.13,1.35h-12.23v13.66h11.28c5.82,0,10.94-.82,15.33-2.46,4.39-1.64,8.13-4.24,11.2-7.79,3.07-3.55,5.45-8.13,7.15-13.74l28.28-93.9h-14.93l-20.84,70.23Z"></path>
              <path className="fill-gray-400" d="m231.65,31.78h-.64c-7.1,0-12.98,1.51-17.64,4.53-4.66,3.02-8.13,7.42-10.41,13.19-.58,1.46-1.08,3.01-1.51,4.64v-19.81h-12.08v84.84h15.25v-50.68c0-6.89,2.07-12.39,6.2-16.52s9.53-6.2,16.21-6.2,11.54,1.99,15.25,5.96c3.71,3.97,5.56,9.24,5.56,15.81v51.64h15.25v-48.46c0-12.6-2.57-22.24-7.71-28.92-5.14-6.67-13.06-10.01-23.75-10.01Z"></path>
              <path className="fill-gray-400" d="m331.91,36.46c-5.51-2.07-12.61-3.1-21.29-3.1-2.54,0-5.19.03-7.94.08-2.76.06-5.43.16-8.02.32-2.6.16-5.06.35-7.39.56v13.35c2.33-.21,5.08-.37,8.26-.48,3.18-.1,6.51-.21,10.01-.32,3.5-.1,6.88-.16,10.17-.16,5.82,0,10.25,1.48,13.27,4.45,3.02,2.97,4.53,7.36,4.53,13.19v2.06h-21.45c-7.31,0-13.56,1.03-18.75,3.1-5.19,2.07-9.14,5.11-11.84,9.14-2.7,4.03-4.05,9.06-4.05,15.09s1.24,10.8,3.73,14.93c2.49,4.13,6.04,7.28,10.65,9.45,4.61,2.17,10.09,3.26,16.44,3.26,5.93,0,10.99-1.06,15.17-3.18,4.18-2.12,7.47-5.22,9.85-9.3,1.14-1.96,2.06-4.16,2.78-6.57v16.82h12.08v-53.7c0-7.94-1.33-14.24-3.97-18.91-2.65-4.66-6.73-8.02-12.23-10.09Zm-1.99,64.19c-2.17,3.13-4.9,5.35-8.18,6.67-3.28,1.33-6.73,1.99-10.33,1.99-6.15,0-10.86-1.43-14.14-4.29-3.28-2.86-4.93-6.62-4.93-11.28s1.64-8.47,4.93-11.44c3.28-2.96,8-4.45,14.14-4.45h22.08v9.85c-.21,5.51-1.4,9.83-3.57,12.95Z"></path>
              <path className="fill-gray-400" d="m445.19,44.49c-3.6-4.03-7.92-7.2-12.95-9.53-5.03-2.33-10.62-3.5-16.76-3.5s-12.23,1.38-17.64,4.13c-5.4,2.76-9.77,7.02-13.11,12.79-1.15,1.99-2.12,4.2-2.94,6.58v-20.65h-12.08v116.62h15.25v-44.54c3.47,5.29,7.75,9.19,12.87,11.65,5.51,2.65,11.28,3.97,17.32,3.97s11.57-1.17,16.6-3.5c5.03-2.33,9.37-5.51,13.03-9.53,3.65-4.02,6.49-8.68,8.5-13.98,2.01-5.3,3.02-10.91,3.02-16.84v-2.86c0-5.93-.95-11.54-2.86-16.84-1.91-5.3-4.66-9.96-8.26-13.98Zm-7.63,48.86c-2.33,4.82-5.62,8.58-9.85,11.28-4.24,2.7-9.22,4.05-14.94,4.05-4.98,0-9.64-1.11-13.98-3.34-4.35-2.22-7.84-5.4-10.49-9.53-2.65-4.13-3.97-9.11-3.97-14.94v-7.31c0-6.04,1.3-11.2,3.89-15.49,2.59-4.29,6.06-7.57,10.41-9.85,4.34-2.28,9.06-3.42,14.14-3.42,5.72,0,10.7,1.35,14.94,4.05,4.23,2.7,7.52,6.44,9.85,11.2,2.33,4.77,3.5,10.33,3.5,16.68s-1.17,11.78-3.5,16.6Z"></path>
              <path className="fill-gray-400" d="m527.65,77.46c-5.51-4.08-12.82-6.59-21.93-7.55l-9.22-.95c-4.98-.53-8.55-1.75-10.72-3.65-2.17-1.91-3.26-4.45-3.26-7.63,0-3.71,1.53-6.78,4.61-9.21,3.07-2.44,7.57-3.65,13.5-3.65s10.41,1.19,13.43,3.57c3.02,2.38,4.58,5.27,4.69,8.66h14.3c-.21-8.37-3.28-14.67-9.22-18.91-5.93-4.23-13.66-6.35-23.2-6.35-6.35,0-11.97,1.03-16.84,3.1-4.87,2.07-8.69,5.03-11.44,8.9-2.76,3.87-4.13,8.5-4.13,13.9,0,7.2,2.54,12.79,7.63,16.76,5.08,3.97,11.65,6.38,19.7,7.23l9.21.95c5.93.64,10.22,1.93,12.87,3.89,2.65,1.96,3.97,4.69,3.97,8.18,0,3.92-1.8,7.23-5.4,9.93-3.6,2.7-8.79,4.05-15.57,4.05-7.52,0-12.84-1.45-15.97-4.37-3.13-2.91-4.79-6.01-5-9.29h-14.3c.21,8.26,3.36,14.78,9.45,19.54,6.09,4.77,14.7,7.15,25.82,7.15,6.89,0,12.97-1.14,18.27-3.42,5.3-2.28,9.45-5.45,12.47-9.53,3.02-4.08,4.53-8.76,4.53-14.06,0-7.41-2.76-13.16-8.26-17.24Z"></path>
              <path className="fill-gray-400" d="m595.15,33.55c-10.91,0-19.09,2.89-24.55,8.66-3.96,4.19-6.46,10.15-7.55,17.82v-25.53h-12.08v41.15h11.63v43.69h15.25v-43.69h-11.63v-2.23c0-8.47,2.28-14.96,6.83-19.46,4.55-4.5,11.07-6.75,19.54-6.75h5.4v-13.66h-2.86Z"></path>
            </svg>
          </div>
        </div>
      </footer>
    </div>
  )
}