/* ═══════════════════════════════════════════════════════════
   SettingsModal.tsx — Модальное окно «ФИО / Должность»
   Глассморфизм, совпадает со стилем проекта
   ═══════════════════════════════════════════════════════════ */

import { useState, useEffect } from 'react'
import { useUser } from '../contexts/UserContext'

interface Props {
  open: boolean
  onClose: () => void
}

export default function SettingsModal({ open, onClose }: Props) {
  const { user, setUser } = useUser()
  const [name, setName] = useState(user.name)
  const [role, setRole] = useState(user.role)

  // Синхронизируем поля при открытии
  useEffect(() => {
    if (open) {
      setName(user.name)
      setRole(user.role)
    }
  }, [open, user])

  // Закрытие по Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const handleSave = () => {
    setUser({ name: name.trim(), role: role.trim() })
    onClose()
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup settings-popup" onClick={e => e.stopPropagation()}>
        <div className="popup-close" onClick={onClose}>✕</div>

        <div className="settings-header">
          <div className="settings-icon-big">⚙</div>
          <div className="settings-title">Настройки</div>
          <div className="settings-subtitle">Укажите данные для подписи комментариев</div>
        </div>

        <div className="settings-fields">
          <label className="settings-label">
            ФИО
            <input
              className="settings-input"
              type="text"
              placeholder="Иванов Иван Иванович"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </label>
          <label className="settings-label">
            Должность
            <input
              className="settings-input"
              type="text"
              placeholder="Начальник отдела"
              value={role}
              onChange={e => setRole(e.target.value)}
            />
          </label>

          {name.trim() && (
            <div className="settings-preview">
              Подпись: <strong>{abbr(name, role)}</strong>
            </div>
          )}
        </div>

        <button
          className="settings-save-btn"
          onClick={handleSave}
          disabled={!name.trim()}
        >
          Сохранить
        </button>
      </div>
    </div>
  )
}

function abbr(name: string, role: string): string {
  const parts = name.trim().split(/\s+/)
  let a = parts[0]
  if (parts[1]) a += ' ' + parts[1][0] + '.'
  if (parts[2]) a += parts[2][0] + '.'
  if (role) a += ' · ' + role
  return a
}
