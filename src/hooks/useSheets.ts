/* ═══════════════════════════════════════════════════════════
   useSheets.ts — Отправка данных в Google Sheets
   через Apps Script Web App (POST)
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

  const body = JSON.stringify({
    ...payload,
    timestamp: new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }),
  })

  try {
    await fetch(SHEETS_URL, {
      method: 'POST',
      // Apps Script требует no-cors для анонимных запросов
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
  } catch (err) {
    console.error('[useSheets] Ошибка отправки:', err)
  }
}
