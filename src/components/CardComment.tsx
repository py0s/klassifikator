/* ═══════════════════════════════════════════════════════════
   CardComment.tsx — Виджет «ОК / Комментарий» под карточкой
   ═══════════════════════════════════════════════════════════ */

import { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import { sendToSheets } from '../hooks/useSheets'

interface Props {
  cardCode: string
  cardName: string
}

type State = 'idle' | 'typing' | 'done_ok' | 'done_comment'

export default function CardComment({ cardCode, cardName }: Props) {
  const { abbr, isSet } = useUser()
  const [state, setState] = useState<State>('idle')
  const [text, setText] = useState('')

  const handleOk = (e: React.MouseEvent) => {
    e.stopPropagation()
    sendToSheets({ cardCode, cardName, user: abbr, action: 'ok' })
    setState('done_ok')
  }

  const handleSend = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!text.trim()) return
    sendToSheets({ cardCode, cardName, user: abbr, action: 'comment', comment: text.trim() })
    setState('done_comment')
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    setText('')
    setState('idle')
  }

  // Если ФИО не заполнено — ничего не показываем
  if (!isSet) return null

  if (state === 'done_ok') {
    return (
      <div className="cc-done cc-ok" onClick={e => e.stopPropagation()}>
        <span className="cc-done-icon">✓</span>
        <span className="cc-done-abbr">{abbr}</span>
      </div>
    )
  }

  if (state === 'done_comment') {
    return (
      <div className="cc-done cc-comment-done" onClick={e => e.stopPropagation()}>
        <span className="cc-done-icon">💬</span>
        <span className="cc-done-abbr">{abbr}</span>
      </div>
    )
  }

  if (state === 'typing') {
    return (
      <div className="cc-typing" onClick={e => e.stopPropagation()}>
        <textarea
          className="cc-textarea"
          placeholder="Введите комментарий…"
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
          autoFocus
          onClick={e => e.stopPropagation()}
        />
        <div className="cc-typing-btns">
          <button className="cc-btn cc-send" onClick={handleSend}>Отправить</button>
          <button className="cc-btn cc-cancel" onClick={handleCancel}>Отмена</button>
        </div>
      </div>
    )
  }

  // idle
  return (
    <div className="cc-idle" onClick={e => e.stopPropagation()}>
      <button className="cc-btn-ok" onClick={handleOk}>✓ ОК</button>
      <button className="cc-btn-comment" onClick={() => setState('typing')}>+ Комментарий</button>
    </div>
  )
}
