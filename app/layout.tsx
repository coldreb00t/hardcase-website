import type { Metadata } from 'next'
import './globals.css'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Hardcase — Реабилитация после травм и операций | Силовые тренировки',
  description: 'Профессиональная реабилитация после травм колена, плеча, позвоночника. Силовые тренировки онлайн. Эксперты FISAF, Harvard, Europe Active. 15+ лет опыта. Hardcase — научный подход к здоровью.',
  keywords: 'реабилитация после травмы, реабилитация после операции, разрыв связок колена, восстановление после травмы, силовые тренировки, персональный тренер, спортивная медицина, физиотерапия, hardcase, реабилитация москва, онлайн реабилитация',
  openGraph: {
    title: 'Hardcase — Реабилитация после травм и операций',
    description: 'Профессиональная реабилитация и силовые тренировки с научным подходом. Эксперты FISAF, Harvard, Europe Active.',
    url: 'https://hardcase.training',
    siteName: 'Hardcase',
    images: [
      {
        url: 'https://hardcase.training/images/hardcase-logo.png',
        width: 1200,
        height: 630,
        alt: 'Hardcase Logo',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hardcase — Реабилитация после травм и операций',
    description: 'Профессиональная реабилитация и силовые тренировки с научным подходом',
    images: ['https://hardcase.training/images/hardcase-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/HardCase_Logos-15.png',
  },
  verification: {
    // Добавить после регистрации в Google Search Console
    // google: 'your-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Runtime configuration for static export
  // These values are embedded in HTML at build time
  // Safe to commit: ANON_KEY is a public key, security is via RLS in Supabase
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()) || 'https://waatdpjvzacdfnebskhf.supabase.co'
  const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhYXRkcGp2emFjZGZuZWJza2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NDQ0NzEsImV4cCI6MjA3NzAyMDQ3MX0.-h6DXM8Ck6O7AksK-kcnwm7OXEro6dlobv0DVFx9ndw'

  const envConfigScript = `
    window.__ENV__ = {
      NEXT_PUBLIC_SUPABASE_URL: '${supabaseUrl}',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: '${supabaseKey}'
    };
  `

  return (
    <html lang="ru">
      <head>
        {/* Inline runtime config - loaded before any React hydration */}
        <script dangerouslySetInnerHTML={{ __html: envConfigScript }} />
        <StructuredData />
      </head>
      <body>{children}</body>
    </html>
  )
}

