// Метаданные страницы /privacy/: у клиентской страницы своих быть не может, поэтому
// они здесь (02.09.2026: у всех страниц сайта был один title на всех).
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Политика обработки персональных данных - Hardcase',
  description: 'Как Hardcase обрабатывает и защищает персональные данные клиентов сайта hardcase.training.',
  alternates: { canonical: 'https://hardcase.training/privacy/' },
  openGraph: { title: 'Политика обработки персональных данных - Hardcase', description: 'Как Hardcase обрабатывает и защищает персональные данные клиентов сайта hardcase.training.', url: 'https://hardcase.training/privacy/', siteName: 'Hardcase', locale: 'ru_RU', type: 'website' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
