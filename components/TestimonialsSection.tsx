'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Алексей Иванов',
      role: 'Предприниматель',
      image: '/images/testimonials/client1.jpg',
      rating: 5,
      text: 'Лучшие тренеры, с которыми я работал! Индивидуальный подход, внимание к деталям и реальные результаты. За 6 месяцев сбросил 20 кг и чувствую себя на 10 лет моложе.',
    },
    {
      name: 'Мария Соколова',
      role: 'Врач',
      image: '/images/testimonials/client2.jpg',
      rating: 5,
      text: 'После рождения ребенка думала, что никогда не вернусь в форму. Команда Hardcase доказала обратное! Профессионализм, поддержка 24/7 и научный подход к тренировкам.',
    },
    {
      name: 'Дмитрий Петров',
      role: 'IT-директор',
      image: '/images/testimonials/client3.jpg',
      rating: 5,
      text: 'Сидячая работа сказывалась на здоровье. Благодаря программе реабилитации забыл о болях в спине. Рекомендую всем, кто много работает за компьютером!',
    },
    {
      name: 'Екатерина Волкова',
      role: 'Дизайнер',
      image: '/images/testimonials/client4.jpg',
      rating: 5,
      text: 'Впервые тренировки приносят удовольствие! Тренер учитывает все мои пожелания, а результаты видны уже через месяц. Спасибо за мотивацию и профессионализм!',
    },
    {
      name: 'Сергей Орлов',
      role: 'Спортсмен',
      image: '/images/testimonials/client5.jpg',
      rating: 5,
      text: 'Готовился к соревнованиям по пауэрлифтингу. Мария помогла улучшить технику и увеличить показатели. Взял личный рекорд благодаря грамотному тренировочному плану!',
    },
    {
      name: 'Ольга Белова',
      role: 'Менеджер',
      image: '/images/testimonials/client6.jpg',
      rating: 5,
      text: 'Онлайн-формат оказался очень удобным! Могу тренироваться в любое время, а контроль техники через видео не уступает очным тренировкам. Результат отличный!',
    },
  ]

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Отзывы <span className="text-primary-500">клиентов</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Более 500 довольных клиентов доверяют нам своё здоровье и достижение целей
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-primary-200">
                <Quote size={48} />
              </div>

              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 leading-relaxed mb-6 relative z-10">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl mr-4">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

