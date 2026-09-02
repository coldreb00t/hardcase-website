// Страницы протоколов: /protokol/koleno/, /protokol/plecho/, /protokol/spina/.
// Серверная обёртка: у неё метаданные на каждую страницу (title, description,
// canonical, Open Graph) и разметка статьи для поиска; содержимое рисует
// клиентский компонент (там модалка разбора).
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProtokolStranica from '@/components/ProtokolStranica'
import { PROTOKOLY, protokolPoSlug } from '@/lib/protokoly'

const SAJT = 'https://hardcase.training'

export function generateStaticParams() {
  return PROTOKOLY.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = protokolPoSlug(params.slug)
  if (!p) return {}
  const url = `${SAJT}/protokol/${p.slug}/`
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: url },
    openGraph: {
      title: p.title,
      description: p.description,
      url,
      siteName: 'Hardcase',
      locale: 'ru_RU',
      type: 'article',
      images: [{ url: `${SAJT}/images/hardcase-logo.png`, width: 1200, height: 630, alt: 'Hardcase' }],
    },
  }
}

export default function Page({ params }: { params: { slug: string } }) {
  const p = protokolPoSlug(params.slug)
  if (!p) notFound()
  const url = `${SAJT}/protokol/${p.slug}/`
  // Разметка статьи и вопросов-ответов: только то, что есть на странице.
  const razmetka = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': url,
        url,
        name: p.title,
        description: p.description,
        inLanguage: 'ru',
        about: { '@type': 'MedicalCondition', name: `Травма ${p.travma}` },
        author: { '@type': 'Organization', name: 'Hardcase', url: SAJT },
        publisher: { '@type': 'Organization', name: 'Hardcase', url: SAJT },
        dateModified: '2026-09-02',
      },
      {
        '@type': 'FAQPage',
        mainEntity: p.voprosy.map((v) => ({
          '@type': 'Question',
          name: v.q,
          acceptedAnswer: { '@type': 'Answer', text: v.a },
        })),
      },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(razmetka) }} />
      <ProtokolStranica protokol={p} />
    </>
  )
}
