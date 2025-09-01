import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ErrorBoundary from '../components/ErrorBoundary'
import { I18nProvider } from '../contexts/I18nContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InstaFollow Comparator',
  description: 'Compare Instagram followers and following to see who you follow but doesn\'t follow you back, and vice versa',
  keywords: 'instagram, followers, following, comparison, social-media, analytics',
  authors: [{ name: 'InstaFollow Comparator' }],
  openGraph: {
    title: 'InstaFollow Comparator',
    description: 'Compare Instagram followers and following to see who you follow but doesn\'t follow you back, and vice versa',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <I18nProvider>
          <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-orange-50">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </I18nProvider>
      </body>
    </html>
  )
}