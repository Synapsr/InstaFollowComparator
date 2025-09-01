'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, Shield, Zap, Github, Heart } from 'lucide-react'
import { processInstagramZip } from '../lib/instagram-parser'
import { ComparisonResult, UploadStatus } from '../types/instagram'
import { useTranslation } from '../contexts/I18nContext'
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function HomePage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    isUploading: false,
    progress: 0,
    message: ''
  })


  const handleExampleData = async () => {
    setUploadStatus({
      isUploading: true,
      progress: 25,
      message: t('home.upload.messages.loadingExample')
    })

    try {
      // Fetch the example ZIP file
      const response = await fetch('/example-instagram-data.zip')
      const blob = await response.blob()
      const file = new File([blob], 'example-instagram-data.zip', { type: 'application/zip' })
      
      setUploadStatus({
        isUploading: true,
        progress: 50,
        message: t('home.upload.messages.processingExample')
      })

      const result: ComparisonResult = await processInstagramZip(file)
      
      setUploadStatus({
        isUploading: true,
        progress: 100,
        message: t('home.upload.messages.exampleComplete')
      })

      sessionStorage.setItem('instagramComparison', JSON.stringify(result))
      
      setTimeout(() => {
        router.push('/results')
      }, 1000)

    } catch (error) {
      setUploadStatus({
        isUploading: false,
        progress: 0,
        message: '',
        error: error instanceof Error ? error.message : t('home.upload.errors.exampleFailed')
      })
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    
    if (!file || !file.name.endsWith('.zip')) {
      setUploadStatus({
        isUploading: false,
        progress: 0,
        message: '',
        error: t('home.upload.errors.invalidFile')
      })
      return
    }

    setUploadStatus({
      isUploading: true,
      progress: 25,
      message: t('home.upload.messages.processing')
    })

    try {
      const result: ComparisonResult = await processInstagramZip(file)
      
      setUploadStatus({
        isUploading: true,
        progress: 100,
        message: t('home.upload.messages.complete')
      })

      sessionStorage.setItem('instagramComparison', JSON.stringify(result))
      
      setTimeout(() => {
        router.push('/results')
      }, 1000)

    } catch (error) {
      setUploadStatus({
        isUploading: false,
        progress: 0,
        message: '',
        error: error instanceof Error ? error.message : t('home.upload.errors.processingFailed')
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-300 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gradient">{t('app.title')}</h1>
          </div>
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            <a 
              href={t('urls.github')}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline">{t('navigation.viewOnGithub')}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              {t('home.hero.title')}
              <span className="text-gradient block">{t('home.hero.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
          </div>

          {/* Demo Video Section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {t('home.demo.title')}
              </h3>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">
                {t('home.demo.description')}
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
                <video 
                  className="w-full h-full object-cover"
                  autoPlay 
                  muted 
                  loop
                  playsInline
                >
                  <source src="/demo.mp4" type="video/mp4" />
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <p className="text-white text-lg">
                      {t('home.demo.browserNotSupported')}
                    </p>
                  </div>
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="card max-w-2xl mx-auto text-center mb-16">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('home.upload.title')}
              </h3>
              <p className="text-gray-600 mb-8">
                {t('home.upload.subtitle')}
              </p>
            </div>

            <div className="relative">
              <input
                type="file"
                accept=".zip"
                onChange={handleFileUpload}
                disabled={uploadStatus.isUploading}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className={`btn-primary w-full cursor-pointer inline-block ${
                  uploadStatus.isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
{uploadStatus.isUploading ? t('home.upload.buttonProcessing') : t('home.upload.buttonUpload')}
              </label>
            </div>

            {/* Example File Button */}
            <div className="mt-3 text-center">
              <button
                onClick={handleExampleData}
                disabled={uploadStatus.isUploading}
                className={`text-sm text-gray-500 hover:text-primary-500 underline transition-colors ${
                  uploadStatus.isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
{t('home.upload.exampleData')}
              </button>
            </div>

            {/* Upload Progress */}
            {uploadStatus.isUploading && (
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-primary-300 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${uploadStatus.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{uploadStatus.message}</p>
              </div>
            )}

            {/* Error Message */}
            {uploadStatus.error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm">{uploadStatus.error}</p>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="card card-hover text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary-500" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('home.features.security.title')}</h4>
              <p className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: t('home.features.security.description') }}>
              </p>
            </div>

            <div className="card card-hover text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-orange-500" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('home.features.speed.title')}</h4>
              <p className="text-gray-600 text-sm">
                {t('home.features.speed.description')}
              </p>
            </div>

            <div className="card card-hover text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-primary-500" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('home.features.analysis.title')}</h4>
              <p className="text-gray-600 text-sm">
                {t('home.features.analysis.description')}
              </p>
            </div>
          </div>

          {/* How to Export */}
          <div className="card">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {t('home.howTo.title')}
            </h3>
            <div className="space-y-4 text-gray-600">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-semibold text-primary-500">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{t('home.howTo.steps.step1.title')}</p>
                  <p className="text-sm">{t('home.howTo.steps.step1.description')} <a href="https://accountscenter.instagram.com/info_and_permissions/dyi/" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600 underline">accountscenter.instagram.com/info_and_permissions/dyi/</a></p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-semibold text-primary-500">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{t('home.howTo.steps.step2.title')}</p>
                  <p className="text-sm">{t('home.howTo.steps.step2.description')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-semibold text-primary-500">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{t('home.howTo.steps.step3.title')}</p>
                  <p className="text-sm" dangerouslySetInnerHTML={{ __html: t('home.howTo.steps.step3.description') }}></p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-semibold text-primary-500">4</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{t('home.howTo.steps.step4.title')}</p>
                  <p className="text-sm" dangerouslySetInnerHTML={{ __html: t('home.howTo.steps.step4.description') }}></p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-800 text-sm" dangerouslySetInnerHTML={{ __html: t('home.howTo.tip') }}>
              </p>
            </div>

            {/* How-to Video */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                {t('home.howTo.video.title')}
              </h4>
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-900">
                <video 
                  className="w-full h-full object-cover"
                  autoPlay 
                  muted 
                  loop
                  playsInline
                >
                  <source src="/how-to.mp4" type="video/mp4" />
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <p className="text-white text-sm">
                      {t('home.howTo.video.browserNotSupported')}
                    </p>
                  </div>
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-gray-600">{t('footer.madeWith.prefix')}</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-gray-600">{t('footer.madeWith.suffix')}</span>
          </div>
          <p className="text-sm text-gray-500 mb-6" dangerouslySetInnerHTML={{ __html: t('footer.description') }}>
          </p>
          
          {/* Proudly created by */}
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