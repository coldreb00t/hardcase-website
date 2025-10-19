import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hardcase — Профессиональная команда специалистов',
  description: 'Команда Hardcase объединяет профессионалов с глубокими знаниями в сфере здоровья, спорта и физической реабилитации. Инновационный подход, научная обоснованность, персонализация.',
  keywords: 'hardcase, фитнес, спорт, реабилитация, персональный тренер, здоровье, тренировки',
  icons: {
    icon: '/images/HardCase_Logos-15.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}

