import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Zeke - Your Privacy-First AI Analyst',
  description: 'Daily ZK & privacy insights on X. Pay-for-analysis with shielded Zcash. Your privacy-focused AI bot for zero-knowledge proofs, Zcash, and crypto analysis.',
  keywords: ['Zeke', 'privacy', 'Zcash', 'ZK proofs', 'crypto', 'AI', 'blockchain', 'zkSNARKs', 'zkSTARKs'],
  authors: [{ name: 'Zeke' }],
  openGraph: {
    title: 'Zeke - Your Privacy-First AI Analyst',
    description: 'Daily ZK & privacy insights on X. Pay-for-analysis with shielded Zcash.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zeke - Your Privacy-First AI Analyst',
    description: 'Daily ZK & privacy insights on X. Pay-for-analysis with shielded Zcash.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}



