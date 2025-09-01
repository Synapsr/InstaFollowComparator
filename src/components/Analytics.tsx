'use client'

import Script from 'next/script'

export default function Analytics() {
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID

  // Only render if both environment variables are present
  if (!umamiUrl || !umamiWebsiteId) {
    return null
  }

  return (
    <Script
      src={umamiUrl}
      data-website-id={umamiWebsiteId}
      strategy="afterInteractive"
      async
    />
  )
}