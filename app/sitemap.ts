// Карта сайта строится из тех же массивов, что и сами страницы (05.09.2026).
// До этого public/sitemap.xml велась руками и отстала: три новые страницы
// в неё не попали, а значит, поиск бы их не нашёл. Механизм вместо рук.
import type { MetadataRoute } from 'next'
import { PROTOKOLY } from '@/lib/protokoly'
import { RAZBORY } from '@/lib/razbory'

const SAJT = 'https://hardcase.training'
const PRAVLENO = new Date('2026-09-05')

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const stranicy: MetadataRoute.Sitemap = [
    { url: `${SAJT}/`, lastModified: PRAVLENO, changeFrequency: 'weekly', priority: 1 },
    { url: `${SAJT}/nutrition/`, lastModified: new Date('2026-06-10'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SAJT}/privacy/`, lastModified: new Date('2026-06-10'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SAJT}/terms/`, lastModified: new Date('2026-06-10'), changeFrequency: 'yearly', priority: 0.3 },
  ]
  for (const p of [...PROTOKOLY, ...RAZBORY]) {
    stranicy.push({
      url: `${SAJT}/protokol/${p.slug}/`,
      lastModified: PRAVLENO,
      changeFrequency: 'monthly',
      priority: 0.9,
    })
  }
  return stranicy
}
