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
