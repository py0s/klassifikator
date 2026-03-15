/* ═══════════════════════════════════════════════════════════
   ObjectCard.tsx — Карточка объекта

   Ключевое поведение:
   • Клик по карточке → открывает попап с полной инфраструктурой
   • Наведение на infra-chip → подсвечивает ВСЕ карточки с этим кодом
   • Клик по infra-chip → открывает детальное окно инфраструктуры
   • Наведение на карточку → CoreInfraPanel подсвечивает слои этой карточки
   ═══════════════════════════════════════════════════════════ */

import type { ClassifierObject } from '../types'
import { findCore } from '../constants'
import LucideIcon from './LucideIcon'
import { useTiltEffect } from '../hooks/useTiltEffect'

interface Props {
  obj: ClassifierObject
  hoveredInfraCode: string | null
  onClick: () => void
  onInfraHover: (code: string | null) => void
  onInfraClick: (code: string) => void
  onCardHover: (codes: string[]) => void
  onCardLeave: () => void
}

export default function ObjectCard({ obj, hoveredInfraCode, onClick, onInfraHover, onInfraClick, onCardHover, onCardLeave }: Props) {
  const core = findCore(obj.code)
  const { ref, handleMouseMove, handleMouseLeave } = useTiltEffect(7)

  const isHighlighted = hoveredInfraCode
    ? obj.infraCodes.includes(hoveredInfraCode)
    : false

  return (
    <div
      ref={ref}
      className={`card ${isHighlighted ? 'hovered-infra' : ''}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={(e) => { handleMouseLeave(); onCardLeave() }}
      onMouseEnter={() => onCardHover(obj.infraCodes)}
    >
      {/* Placeholder для будущего изображения */}
      <div className="card-placeholder">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>

      {/* Цветная полоска ядра */}
      {core && <div className="card-core-stripe" style={{ background: core.color }} />}

      <div className="card-top">
        <div className="card-icon">
          {core ? (
            <LucideIcon name={core.icon} size={22} color={core.color} strokeWidth={1.8} />
          ) : null}
        </div>
        <div>
          <div className="card-code" style={{ color: core?.color }}>
            {obj.code}
          </div>
          <div className="card-name">{obj.name}</div>
        </div>
      </div>

      <div className="card-pills">
        {obj.key && <span className="pill key">Ключевое ядро</span>}
        <span className="pill">{obj.norm}</span>
        {obj.area !== '—' && <span className="pill">{obj.area}</span>}
        <span className="pill">{obj.season}</span>
      </div>

      <div className="card-desc">{obj.desc}</div>

      {obj.infraCodes.length > 0 && (
        <div className="card-infra-chips">
          {obj.infraCodes.map(code => (
            <span
              key={code}
              className={`infra-chip ${hoveredInfraCode === code ? 'highlighted' : ''}`}
              onMouseEnter={(e) => { e.stopPropagation(); onInfraHover(code) }}
              onMouseLeave={(e) => { e.stopPropagation(); onInfraHover(null) }}
              onClick={(e) => { e.stopPropagation(); onInfraClick(code) }}
              title={`Инфраструктура: ${code}`}
            >
              {code}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
