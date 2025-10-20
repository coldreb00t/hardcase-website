import Script from 'next/script'

export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": "https://hardcase.training/#organization",
    "name": "Hardcase",
    "alternateName": "HARDCASE",
    "description": "Профессиональная реабилитация после травм и операций, силовые тренировки, восстановление здоровья. Научный подход, индивидуальные программы.",
    "url": "https://hardcase.training",
    "logo": {
      "@type": "ImageObject",
      "url": "https://hardcase.training/images/hardcase-logo.png",
      "width": "600",
      "height": "200"
    },
    "image": "https://hardcase.training/images/hardcase-logo.png",
    "telephone": "+7-XXX-XXX-XX-XX",
    "email": "info@hardcase.training",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Москва",
      "addressCountry": "RU"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Россия"
    },
    "medicalSpecialty": [
      "Physical Therapy",
      "Sports Medicine",
      "Rehabilitation",
      "Orthopedics"
    ],
    "serviceType": [
      "Реабилитация после травм",
      "Реабилитация после операций",
      "Восстановление после разрыва связок",
      "Реабилитация колена",
      "Реабилитация плеча",
      "Реабилитация позвоночника",
      "Силовые тренировки",
      "Персональный тренинг",
      "Восстановление здоровья",
      "Спортивная реабилитация",
      "Онлайн тренировки",
      "Расчет КБЖУ"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "priceRange": "$$",
    "sameAs": [
      "https://www.youtube.com/@hardcasetraining",
      "https://t.me/HardCaseTraining"
    ],
    "founder": [
      {
        "@type": "Person",
        "@id": "https://hardcase.training/#maria-mostovaya",
        "name": "Мария Мостовая",
        "jobTitle": "Мастер-тренер, эксперт по реабилитации",
        "description": "15+ лет опыта в реабилитации и силовых тренировках. Сертифицированный специалист FISAF, Harvard Medical School.",
        "alumniOf": [
          {
            "@type": "Organization",
            "name": "Harvard Medical School"
          }
        ],
        "hasCredential": [
          {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "Сертификация",
            "name": "FISAF International Master Trainer",
            "recognizedBy": {
              "@type": "Organization",
              "name": "FISAF International"
            }
          },
          {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "Образование",
            "name": "Sports Medicine Certificate",
            "recognizedBy": {
              "@type": "Organization",
              "name": "Harvard Medical School"
            }
          }
        ],
        "worksFor": {
          "@id": "https://hardcase.training/#organization"
        }
      },
      {
        "@type": "Person",
        "@id": "https://hardcase.training/#artem-belov",
        "name": "Артём Белов",
        "jobTitle": "Силовой тренер, специалист по восстановлению",
        "description": "Эксперт в силовом тренинге и восстановлении после травм. Сертификация Europe Active, FPA.",
        "hasCredential": [
          {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "Сертификация",
            "name": "Europe Active Certified Trainer",
            "recognizedBy": {
              "@type": "Organization",
              "name": "Europe Active"
            }
          },
          {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "Сертификация",
            "name": "FPA Certified Professional",
            "recognizedBy": {
              "@type": "Organization",
              "name": "Fitness Professionals Association"
            }
          }
        ],
        "worksFor": {
          "@id": "https://hardcase.training/#organization"
        }
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Услуги реабилитации и тренировок",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Реабилитация после травм",
            "description": "Индивидуальная программа восстановления после травм и операций с научным подходом"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Силовые тренировки",
            "description": "Персональные силовые тренировки с контролем техники и прогресса"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Тестирование и анамнез",
            "description": "Комплексная оценка состояния здоровья и физической подготовки"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Расчет КБЖУ",
            "description": "Индивидуальный план питания с расчетом калорий, белков, жиров и углеводов"
          }
        }
      ]
    }
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://hardcase.training/#website",
    "url": "https://hardcase.training",
    "name": "Hardcase",
    "description": "Профессиональная реабилитация после травм и операций, силовые тренировки",
    "publisher": {
      "@id": "https://hardcase.training/#organization"
    },
    "inLanguage": "ru-RU"
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Главная",
        "item": "https://hardcase.training"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "О нас",
        "item": "https://hardcase.training#team"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Услуги",
        "item": "https://hardcase.training#services"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Контакты",
        "item": "https://hardcase.training#contact"
      }
    ]
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Как долго длится реабилитация после разрыва связок колена?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "В Hardcase программа реабилитации после разрыва связок колена обычно занимает 3-6 месяцев в зависимости от тяжести травмы и индивидуальных особенностей. Мы используем научно обоснованные методы и индивидуальный подход для каждого клиента, что позволяет достичь полного восстановления функций."
        }
      },
      {
        "@type": "Question",
        "name": "Где находится Hardcase?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hardcase работает онлайн по всему миру. Мы предоставляем персональные программы реабилитации и тренировок через видеосвязь с нашими экспертами. Это позволяет получать профессиональную помощь независимо от вашего местоположения."
        }
      },
      {
        "@type": "Question",
        "name": "Какие сертификаты есть у тренеров Hardcase?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Наши тренеры имеют международные сертификации: FISAF International, Harvard Medical School (Sports Medicine), Europe Active, FPA (Fitness Professionals Association). Все специалисты имеют 15+ лет опыта в реабилитации и силовых тренировках."
        }
      },
      {
        "@type": "Question",
        "name": "Можно ли заниматься онлайн после операции?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Да, онлайн-формат эффективен для реабилитации после операций. Наши эксперты проводят детальный анализ состояния, разрабатывают индивидуальную программу и контролируют выполнение упражнений через видеосвязь. Это позволяет безопасно восстанавливаться в комфортных домашних условиях."
        }
      },
      {
        "@type": "Question",
        "name": "Сколько стоят услуги Hardcase?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Стоимость зависит от выбранной программы и длительности сопровождения. Первая консультация включает комплексную оценку состояния, постановку целей и разработку индивидуального плана. Для получения точной информации о ценах свяжитесь с нами: info@hardcase.training"
        }
      },
      {
        "@type": "Question",
        "name": "Какие травмы лечит Hardcase?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hardcase специализируется на реабилитации после травм колена (разрыв ПКС, мениска), плеча (вращательная манжета), позвоночника, переломов, растяжений связок и восстановлении после операций (артроскопия, замена сустава и др.). Мы также работаем с послеродовой реабилитацией."
        }
      }
    ]
  }

  return (
    <>
      <Script
        id="schema-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="schema-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}

