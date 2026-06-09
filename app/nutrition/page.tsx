'use client'

import { motion } from 'framer-motion'
import { Calculator, Camera, FileText, ArrowLeft } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useRazbor } from '@/components/RazborModal'

export default function NutritionPage() {
  const { open } = useRazbor()
  const services = [
    {
      icon: Calculator,
      title: 'Расчёт КБЖУ',
      description: 'Персональные рекомендации по калорийности и соотношению белков, жиров и углеводов под твои цели и нагрузки',
      gradient: 'from-primary-500 to-orange-500',
    },
    {
      icon: Camera,
      title: 'Фотоотчёты питания',
      description: 'Визуальный контроль рациона с рекомендациями по корректировке',
      gradient: 'from-orange-500 to-primary-600',
    },
    {
      icon: FileText,
      title: 'Контроль прогресса',
      description: 'Регулярный анализ изменений и корректировка плана питания под результат',
      gradient: 'from-primary-600 to-orange-600',
    },
  ]

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navigation />

      <section className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href="/"
            className="inline-flex items-center text-gray-500 hover:text-primary-500 transition-colors mb-8"
          >
            <ArrowLeft size={18} className="mr-2" />
            На главную
          </a>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Питание и <span className="text-primary-500">состав тела</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Дополнительный модуль для тех, кому помимо тренировок нужна работа с питанием и составом тела.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-white border-2 border-gray-100 hover:border-primary-200 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${service.gradient} mb-6 self-start`}>
                  <service.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed flex-grow">{service.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={open}
              className="inline-block bg-gradient-to-r from-primary-500 to-orange-500 text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Разобрать мой случай
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
