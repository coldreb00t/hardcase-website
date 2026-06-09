import type { Metadata } from 'next'
import './globals.css'
import StructuredData from '@/components/StructuredData'
import CookieBanner from '@/components/CookieBanner'
import { RazborProvider } from '@/components/RazborModal'

export const metadata: Metadata = {
  title: 'Hardcase — Силовая реабилитация после травм | Возврат к тренировкам',
  description: 'Возвращаем активных людей к тренировкам после травм колена, спины, плеча. Доказательно, по этапам, без «забудь про спорт». Сертифицированные тренеры FISAF, Europe Active, FPA.',
  keywords: 'силовая реабилитация, реабилитация после травмы, возврат к тренировкам, травма колена, травма спины, травма плеча, реабилитация после операции, разрыв связок колена, восстановление спортсмена, онлайн реабилитация',
  openGraph: {
    title: 'Hardcase — Силовая реабилитация после травм',
    description: 'Возвращаем активных людей к тренировкам после травм и боли. Доказательно, по этапам.',
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
    title: 'Hardcase — Силовая реабилитация после травм',
    description: 'Возвращаем активных людей к тренировкам после травм и боли. Доказательно, по этапам.',
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
  return (
    <html lang="ru">
      <head>
        <StructuredData />
      </head>
      <body>
        <RazborProvider>
          {children}
          <CookieBanner />
        </RazborProvider>
      </body>
    </html>
  )
}

