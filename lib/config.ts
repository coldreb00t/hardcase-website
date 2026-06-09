// Единая точка для ссылок на бесплатный разбор и бесплатный протокол.
// Значения можно задать при сборке через переменные окружения
// (NEXT_PUBLIC_RAZBOR_URL / NEXT_PUBLIC_PROTOCOL_URL) или прямо здесь.
//
// Сейчас стоят понятные плейсхолдеры — впиши реальные ссылки перед публикацией.

// TODO(owner): ссылка на бесплатный разбор случая
// (Telegram-аккаунт, бот или внешняя форма). Пример: 'https://t.me/HardCaseTraining'
export const RAZBOR_URL =
  process.env.NEXT_PUBLIC_RAZBOR_URL || '#razbor-placeholder'

// Endpoint бэкенда-relay формы разбора (на сервере, шлёт заявку в Telegram)
export const RAZBOR_API_URL =
  process.env.NEXT_PUBLIC_RAZBOR_API_URL || 'https://api.hardcase.training/razbor'

// Ссылки на PDF бесплатных протоколов первых недель после травмы (колено/плечо/спина).
// TODO(owner): впиши прямые ссылки на PDF. Колено («у нас есть») — задать первым.
export const PROTOCOL_KNEE_URL =
  process.env.NEXT_PUBLIC_PROTOCOL_KNEE_URL || '/protocols/hardcase_protocol_koleno.pdf'
export const PROTOCOL_SHOULDER_URL =
  process.env.NEXT_PUBLIC_PROTOCOL_SHOULDER_URL || '/protocols/hardcase_protocol_plecho.pdf'
export const PROTOCOL_BACK_URL =
  process.env.NEXT_PUBLIC_PROTOCOL_BACK_URL || '/protocols/hardcase_protocol_spina.pdf'

// Реквизиты оператора персональных данных — для Политики и Условий.
// Оператор — САМОЗАНЯТЫЙ (плательщик НПД), т.е. физлицо: ФИО + статус + ИНН физлица.
// У самозанятого нет ОГРН и юр.адреса.
// TODO(owner): впиши ФИО и личный ИНН. Плейсхолдеры [...] видны на странице — это сигнал заполнить.
export const OPERATOR = {
  // ФИО полностью того, на кого оформлена самозанятость (например, тренер)
  fullName: '[Фамилия Имя Отчество]',
  status: 'Самозанятый (плательщик налога на профессиональный доход)',
  inn: '[ИНН]',
  email: 'info@hardcase.training',
  site: 'hardcase.training',
}

// Дата вступления Политики/Условий в силу (обновить при изменениях)
export const LEGAL_EFFECTIVE_DATE = '9 июня 2026 г.'
