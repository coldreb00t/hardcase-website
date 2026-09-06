import type { Metadata } from 'next'
import './globals.css'
import StructuredData from '@/components/StructuredData'
import CookieBanner from '@/components/CookieBanner'
import { RazborProvider } from '@/components/RazborModal'

export const metadata: Metadata = {
  metadataBase: new URL('https://hardcase.training'),
  alternates: { canonical: 'https://hardcase.training/' },
  title: 'Hardcase - Силовая реабилитация после травм | Возврат к тренировкам',
  description: 'Возвращаем активных людей к тренировкам после травм колена, спины, плеча. Доказательно, по этапам, без «забудь про спорт». Сертифицированные тренеры FISAF, Europe Active, FPA.',
  keywords: 'силовая реабилитация, реабилитация после травмы, возврат к тренировкам, травма колена, травма спины, травма плеча, реабилитация после операции, разрыв связок колена, восстановление спортсмена, онлайн реабилитация',
  openGraph: {
    title: 'Hardcase - Силовая реабилитация после травм',
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
    title: 'Hardcase - Силовая реабилитация после травм',
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
    yandex: '88ea1dabe8b7f03f',
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
        {/* Яндекс.Метрика, счётчик 112318522. Поставлен 06.09 по слову владельца.
            Стоит в конце body, чтобы не задерживать отрисовку. Раскрытие в политике
            конфиденциальности внесено ТОЙ ЖЕ правкой: сайт и документ не должны
            расходиться ни на минуту, а вебвизор пишет действия посетителя. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=112318522', 'ym');

    ym(112318522, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});`,
          }}
        />
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/112318522" style={{ position: 'absolute', left: '-9999px' }} alt="" />
          </div>
        </noscript>
      </body>
    </html>
  )
}

