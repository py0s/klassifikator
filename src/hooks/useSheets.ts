/* ═══════════════════════════════════════════════════════════
   useSheets.ts — Отправка данных в Google Sheets
   Используем GET + URL-параметры (единственный надёжный способ
   без CORS для Apps Script)
   ═══════════════════════════════════════════════════════════ */

const SHEETS_URL = import.meta.env.VITE_SHEETS_URL as string | undefined

export interface SheetsPayload {
  cardCode: string
  cardName: string
  user: string      // аббревиатура «Иванов И.И. · Нач. отдела»
  action: 'ok' | 'comment'
  comment?: string
}

export async function sendToSheets(payload: SheetsPayload): Promise<void> {
  if (!SHEETS_URL) {
    console.warn('[useSheets] VITE_SHEETS_URL не задан — данные не отправлены')
    return
  }

  const params = new URLSearchParams({
    timestamp: new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }),
    cardCode:  payload.cardCode,
    cardName:  payload.cardName,
    user:      payload.user,
    action:    payload.action,
    comment:   payload.comment ?? '',
  })

  try {
    // GET-запрос с параметрами — работает без CORS preflight
    await fetch(`${SHEETS_URL}?${params.toString()}`, {
      method: 'GET',
      mode: 'no-cors',
    })
  } catch (err) {
    console.error('[useSheets] Ошибка отправки:', err)
  }
}

