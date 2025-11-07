import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ErrorBoundary from '../components/ErrorBoundary'
import { I18nProvider } from '../contexts/I18nContext'
import Analytics from '../components/Analytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Who Unfollowed You on Instagram? - Discover for Free & Safe',
  description: 'Find out who unfollowed you on Instagram, who to unfollow back, and discover your true Instagram friends. 100% free, private & safe. No account risk, no login required.',
  keywords: 'instagram unfollowers, who unfollowed me instagram, instagram followers tracker, unfollow instagram, instagram analytics free, who doesn\'t follow back, instagram mutual followers, instagram relationships, safe instagram tool, instagram follower checker',
  authors: [{ name: 'InstaFollow Comparator' }],
  openGraph: {
    title: 'Who Unfollowed You on Instagram? - Free & Safe',
    description: 'Discover who unfollowed you, who to unfollow, and your real Instagram friends. 100% free, private & secure. Zero account risk.',
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
        <Analytics />
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