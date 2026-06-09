'use client'

import { ArrowLeft } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { OPERATOR, LEGAL_EFFECTIVE_DATE } from '@/lib/config'

export default function TermsPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white">
      <Navigation />

      <section className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href="/"
            className="inline-flex items-center text-gray-500 hover:text-primary-500 transition-colors mb-8"
          >
            <ArrowLeft size={18} className="mr-2" />
            На главную
          </a>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Условия использования
          </h1>
          <p className="text-gray-500 mb-10">Дата вступления в силу: {LEGAL_EFFECTIVE_DATE}</p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            {/* Медицинский дисклеймер — выделен */}
            <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Важно: о характере услуг</h2>
              <p>
                Информация на Сайте и бесплатный разбор носят информационно-консультационный характер,
                не являются медицинской услугой, постановкой диагноза или назначением лечения и не заменяют
                очной консультации врача. При острой боли, после операции или травмы обязательно
                проконсультируйтесь с лечащим врачом. Решения о тренировках и нагрузке вы принимаете
                самостоятельно с учётом рекомендаций ваших врачей.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Общие положения</h2>
              <p className="mb-3">
                Настоящие Условия регулируют использование сайта {OPERATOR.site} (далее — Сайт) и связанных
                с ним сервисов, предоставляемых {OPERATOR.fullName} (статус: {OPERATOR.status.toLowerCase()})
                (далее — Исполнитель).
              </p>
              <p>
                Используя Сайт, вы подтверждаете, что ознакомились с настоящими Условиями и{' '}
                <a href="/privacy" className="text-primary-600 hover:underline">Политикой обработки персональных данных</a>{' '}
                и принимаете их.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Предмет</h2>
              <p>
                Сайт предоставляет информацию об услугах силовой реабилитации и сопровождения тренировок после
                травм, а также возможность обратиться за бесплатным разбором случая. Бесплатный разбор ни к чему
                не обязывает и не является публичной офертой на оказание платных услуг. Условия платных услуг
                согласовываются отдельно.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Бесплатные материалы</h2>
              <p>
                Бесплатные материалы (в т.ч. протокол первых недель после травмы) предоставляются «как есть»,
                в общеинформационных целях. Они не учитывают индивидуальные противопоказания и не заменяют
                консультацию специалиста. Исполнитель не несёт ответственности за результаты их самостоятельного
                применения без учёта рекомендаций врача.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Интеллектуальная собственность</h2>
              <p>
                Все материалы Сайта (тексты, изображения, логотип, дизайн) защищены законодательством об
                интеллектуальной собственности. Использование без письменного согласия Исполнителя не допускается,
                за исключением личного некоммерческого ознакомления.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Ограничение ответственности</h2>
              <p>
                Исполнитель не гарантирует конкретного результата восстановления — он зависит от характера травмы,
                индивидуальных особенностей и соблюдения рекомендаций. Исполнитель не несёт ответственности за вред,
                возникший вследствие самостоятельных действий пользователя в нарушение рекомендаций врача или
                полученных рекомендаций.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Персональные данные</h2>
              <p>
                Обработка персональных данных осуществляется в соответствии с{' '}
                <a href="/privacy" className="text-primary-600 hover:underline">Политикой обработки персональных данных</a>.
                Обращаясь за разбором, вы даёте согласие на обработку предоставленных вами данных в указанных в
                Политике целях.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Изменение Условий</h2>
              <p>
                Исполнитель вправе изменять настоящие Условия. Актуальная редакция всегда доступна на Сайте по
                адресу {OPERATOR.site}/terms. Изменения вступают в силу с момента публикации.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Реквизиты и контакты</h2>
              <div className="bg-gray-50 border-l-4 border-primary-400 rounded-r-xl p-5 space-y-1">
                <p><b>ФИО:</b> {OPERATOR.fullName}</p>
                <p><b>Статус:</b> {OPERATOR.status}</p>
                <p><b>ИНН:</b> {OPERATOR.inn}</p>
                <p>
                  <b>Электронная почта:</b>{' '}
                  <a href={`mailto:${OPERATOR.email}`} className="text-primary-600 hover:underline">{OPERATOR.email}</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
