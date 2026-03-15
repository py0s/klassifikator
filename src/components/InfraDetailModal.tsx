/* ═══════════════════════════════════════════════════════════
   InfraDetailModal.tsx — Детальное окно инфраструктурной секции
   
   Открывается при клике на инфра-чип (например СВ.01).
   Показывает код, название и назначение раздела.
   Подпунктов нет — раздел является конечным элементом.
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

        {/* Photo placeholder */}
        <div className="popup-photo-placeholder">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.4">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span style={{ fontSize: '.65rem', opacity: 0.4, marginTop: '6px' }}>Фото появится здесь</span>
        </div>

        <div className="infra-detail-head">
          <div>
            <div className="infra-detail-code">{section.code}</div>
            <div className="infra-detail-name">{section.name}</div>
            {section.purpose && (
              <div className="infra-detail-purpose">{section.purpose}</div>
            )}
          </div>
          <div className="popup-close" onClick={onClose} style={{ position: 'static', flexShrink: 0 }}>✕</div>
        </div>
      </div>
    </div>
  )
}
