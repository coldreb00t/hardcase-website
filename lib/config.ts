// Единая точка для ссылок на бесплатный разбор и бесплатный протокол.
// Значения можно задать при сборке через переменные окружения
// (NEXT_PUBLIC_RAZBOR_URL / NEXT_PUBLIC_PROTOCOL_URL) или прямо здесь.
//
// Сейчас стоят понятные плейсхолдеры — впиши реальные ссылки перед публикацией.

// TODO(owner): ссылка на бесплатный разбор случая
// (Telegram-аккаунт, бот или внешняя форма). Пример: 'https://t.me/HardCaseTraining'
export const RAZBOR_URL =
  process.env.NEXT_PUBLIC_RAZBOR_URL || '#razbor-placeholder'

// TODO(owner): прямая ссылка на PDF протокола первых недель после травмы колена
export const PROTOCOL_URL =
  process.env.NEXT_PUBLIC_PROTOCOL_URL || '#protocol-placeholder'
