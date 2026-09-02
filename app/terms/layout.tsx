// Метаданные страницы /terms/: у клиентской страницы своих быть не может, поэтому
// они здесь (02.09.2026: у всех страниц сайта был один title на всех).
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Условия использования — Hardcase',
  description: 'Условия использования сайта и услуг Hardcase: онлайн силовая реабилитация после травм.',
  alternates: { canonical: 'https://hardcase.training/terms/' },
  openGraph: { title: 'Условия использования — Hardcase', description: 'Условия использования сайта и услуг Hardcase: онлайн силовая реабилитация после травм.', url: 'https://hardcase.training/terms/', siteName: 'Hardcase', locale: 'ru_RU', type: 'website' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
