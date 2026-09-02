'use client'

// Страница протокола первых недель (02.09.2026). Содержание — из PDF раздела
// «Протоколы первых недель», оформление — в стилистике сайта (тот же
// градиент primary→orange, скругления, шрифты). Кнопка «Разобрать мой случай»
// открывает ту же модалку, что и на главной.
import Link from 'next/link'
import { AlertTriangle, ArrowLeft, Download, BookOpen } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useRazbor } from '@/components/RazborModal'
import { PROTOKOLY, SVETOFOR, type Protokol } from '@/lib/protokoly'

const CVETA_SVETOFORA: Record<string, string> = {
  green: 'bg-green-50 border-green-200 text-green-900',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  red: 'bg-red-50 border-red-200 text-red-900',
}

function Razdel({ zag, children }: { zag: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{zag}</h2>
      {children}
    </section>
  )
}

function Spisok({ punkty }: { punkty: string[] }) {
  return (
    <ul className="space-y-2 text-gray-700 leading-relaxed">
      {punkty.map((p) => (
        <li key={p} className="flex">
          <span className="text-primary-500 mr-3 mt-1">•</span>
          <span>{p}</span>
        </li>
      ))}
    </ul>
  )
}

export default function ProtokolStranica({ protokol }: { protokol: Protokol }) {
  const { open } = useRazbor()
  const drugie = PROTOKOLY.filter((p) => p.slug !== protokol.slug)

  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <Link href="/#protocol" className="inline-flex items-center text-gray-500 hover:text-primary-600 transition-colors mb-8">
          <ArrowLeft size={18} className="mr-2" /> Все протоколы
        </Link>

        <p className="text-sm font-semibold tracking-wider text-primary-600 uppercase mb-3">
          Бесплатный протокол · силовая реабилитация
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">{protokol.h1}</h1>
        <p className="text-xl text-gray-600 mt-4">{protokol.podzagolovok}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={protokol.pdf}
            download
            className="inline-flex items-center bg-gradient-to-r from-primary-500 to-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
          >
            <Download className="mr-2" size={18} /> Скачать PDF
          </a>
          <button
            type="button"
            onClick={open}
            className="inline-flex items-center border-2 border-primary-500 text-primary-600 px-6 py-3 rounded-full font-bold hover:bg-primary-50 transition-colors"
          >
            Разобрать мой случай — бесплатно
          </button>
        </div>

        <div className="mt-10 space-y-4 text-lg text-gray-700 leading-relaxed">
          {protokol.vvod.map((a) => (
            <p key={a}>{a}</p>
          ))}
        </div>

        <section className="mt-10 rounded-3xl border-2 border-red-200 bg-red-50 p-6 md:p-8">
          <h2 className="flex items-center text-2xl font-bold text-red-900 mb-3">
            <AlertTriangle className="mr-3 text-red-600" size={26} /> Красные флаги — когда сразу к врачу
          </h2>
          <p className="text-red-900 mb-3">{protokol.krasnyeFlagi.vvod}</p>
          <ul className="space-y-1 text-red-900">
            {protokol.krasnyeFlagi.punkty.map((p) => (
              <li key={p} className="flex">
                <span className="mr-3">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-semibold text-red-900">{protokol.krasnyeFlagi.itog}</p>
        </section>

        {protokol.vazhno && (
          <Razdel zag={protokol.vazhno.zag}>
            <Spisok punkty={protokol.vazhno.punkty} />
          </Razdel>
        )}

        <Razdel zag={protokol.pervyeDni.zag}>
          <p className="text-gray-700 leading-relaxed mb-4">{protokol.pervyeDni.vvod}</p>
          <Spisok punkty={protokol.pervyeDni.punkty} />
        </Razdel>

        <Razdel zag="Дальше — главное">
          <p className="text-gray-700 leading-relaxed mb-4">{protokol.dalshe.vvod}</p>
          <Spisok punkty={protokol.dalshe.punkty} />
        </Razdel>

        <Razdel zag="Ориентир по неделям">
          <p className="text-gray-600 mb-6">Это рамка, а не жёсткий рецепт. Прогресс ведут симптомы и возможности, а не календарь.</p>
          <div className="space-y-4">
            {protokol.nedeli.map((n) => (
              <div key={n.zag} className="rounded-2xl border-2 border-primary-100 p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{n.zag}</h3>
                <p className="text-gray-700 leading-relaxed">{n.tekst}</p>
              </div>
            ))}
          </div>
        </Razdel>

        <Razdel zag="Светофор боли">
          <div className="grid gap-3">
            {SVETOFOR.map((s) => (
              <div key={s.zag} className={`rounded-2xl border-2 p-4 ${CVETA_SVETOFORA[s.cvet]}`}>
                <span className="font-bold">{s.zag}.</span> {s.tekst}
              </div>
            ))}
          </div>
        </Razdel>

        <Razdel zag="Главные ошибки первых недель">
          <Spisok punkty={protokol.oshibki} />
        </Razdel>

        <Razdel zag="Вопросы, которые задают чаще всего">
          <div className="space-y-5">
            {protokol.voprosy.map((v) => (
              <div key={v.q}>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{v.q}</h3>
                <p className="text-gray-700 leading-relaxed">{v.a}</p>
              </div>
            ))}
          </div>
        </Razdel>

        <Razdel zag="На чём это основано">
          <p className="text-gray-600 mb-3">Ключевые источники, на которые опираются эти рекомендации:</p>
          <ul className="space-y-2 text-sm text-gray-600">
            {protokol.istochniki.map((i) => (
              <li key={i} className="flex">
                <BookOpen size={16} className="mr-2 mt-1 flex-shrink-0 text-primary-500" />
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </Razdel>

        <section className="mt-14 rounded-3xl bg-gradient-to-r from-primary-500 to-orange-500 text-white p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Что дальше</h2>
          <p className="leading-relaxed mb-3">
            Этот протокол — ваш. Пользуйтесь свободно и делитесь с теми, кому он пригодится. Ничего взамен не требуется.
          </p>
          <p className="leading-relaxed mb-6">
            Но это общая карта. Ваш случай — это конкретный диагноз, ваша история и ваш спорт, и под вас протокол подбирается индивидуально.
            Если захотите такой разбор — мы смотрим конкретный случай бесплатно, без обязательств. Захотите продолжить с нами — продолжим; нет — протокол всё равно останется у вас.
          </p>
          <button
            type="button"
            onClick={open}
            className="inline-flex items-center bg-white text-primary-600 px-7 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Разобрать мой случай — бесплатно
          </button>
          <p className="mt-4 text-white/90 text-sm">Мы доводим до силы — не до «потерпите и поберегите».</p>
        </section>

        <p className="mt-8 text-sm text-gray-500 leading-relaxed">
          Это образовательный материал, а не диагноз и не персональная медицинская рекомендация. При красных флагах или любых сомнениях
          обратитесь к врачу или физиотерапевту.
        </p>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Другие протоколы</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {drugie.map((d) => (
              <Link key={d.slug} href={`/protokol/${d.slug}/`} className="rounded-2xl border-2 border-primary-100 p-5 hover:border-primary-400 transition-colors">
                <div className="font-bold text-gray-900">{d.h1}</div>
                <div className="text-gray-600 text-sm mt-1">{d.podzagolovok}</div>
              </Link>
            ))}
          </div>
          <p className="mt-6 text-gray-600">
            Программы и цены — <Link href="/#pricing" className="text-primary-600 font-semibold hover:underline">на главной</Link>.
          </p>
        </section>
      </article>

      <Footer />
    </main>
  )
}
