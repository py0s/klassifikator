/* ═══════════════════════════════════════════════════════════
   InfraDetailModal.tsx — Детальное окно инфраструктурной секции
   
   Открывается при клике на инфра-чип (например СВ.01).
   Показывает все подвиды: СВ.01.01, СВ.01.02, и т.д.
   с названием и техническими характеристиками.
   ═══════════════════════════════════════════════════════════ */

import { useEffect } from 'react'
import type { InfraSection } from '../types'

interface Props {
  section: InfraSection
  onClose: () => void
}

export default function InfraDetailModal({ section, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="infra-detail-overlay" onClick={onClose}>
      <div className="infra-detail" onClick={e => e.stopPropagation()}>
        <div className="infra-detail-head">
          <div>
            <div className="infra-detail-code">{section.code}</div>
            <div className="infra-detail-name">{section.name}</div>
            <div className="infra-detail-purpose">{section.purpose}</div>
          </div>
          <div className="popup-close" onClick={onClose} style={{ position: 'static', flexShrink: 0 }}>✕</div>
        </div>
        <div className="infra-detail-body">
          {section.items.map(item => (
            <div key={item.code} className="infra-item-row">
              <div className="infra-item-code">{item.code}</div>
              <div className="infra-item-name">{item.name}</div>
              <div className="infra-item-specs">{item.specs}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
