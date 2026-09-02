// Метаданные страницы /nutrition/: у клиентской страницы своих быть не может, поэтому
// они здесь (02.09.2026: у всех страниц сайта был один title на всех).
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Питание для восстановления и тренировок — Hardcase',
  description: 'Расчёт КБЖУ под цели и нагрузки, фотоотчёты питания и контроль прогресса как часть силовой реабилитации Hardcase.',
  alternates: { canonical: 'https://hardcase.training/nutrition/' },
  openGraph: { title: 'Питание для восстановления и тренировок — Hardcase', description: 'Расчёт КБЖУ под цели и нагрузки, фотоотчёты питания и контроль прогресса как часть силовой реабилитации Hardcase.', url: 'https://hardcase.training/nutrition/', siteName: 'Hardcase', locale: 'ru_RU', type: 'website' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
