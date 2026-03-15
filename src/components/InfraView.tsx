/* ═══════════════════════════════════════════════════════════
   InfraView.tsx — Вид «Инфраструктурные слои»
   Все карточки без фильтра, клик → InfraDetailModal
   ═══════════════════════════════════════════════════════════ */

import type { InfraBlock, InfraSection } from '../types'
import { INFRA_BLOCK_ICONS } from '../constants'
import LucideIcon from './LucideIcon'
import { useTiltEffect } from '../hooks/useTiltEffect'

interface Props {
  infraBlocks: InfraBlock[]
  onInfraClick: (code: string) => void
}

function SectionCard({ section, blockCode, onInfraClick }: {
  section: InfraSection
  blockCode: string
  onInfraClick: (code: string) => void
}) {
  const { ref, handleMouseMove, handleMouseLeave } = useTiltEffect(5)
  return (
    <div
      ref={ref}
      className="infra-card"
      onClick={() => onInfraClick(section.code)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Placeholder для фото */}
      <div className="card-placeholder">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>
      <div className="infra-card-top">
        <span className="infra-card-code">{section.code}</span>
        <span className="infra-card-sub">{section.items.length} подвидов</span>
      </div>
      <div className="infra-card-name">{section.name}</div>
      {section.purpose && (
        <div className="infra-card-purpose">{section.purpose}</div>
      )}
    </div>
  )
}

export default function InfraView({ infraBlocks, onInfraClick }: Props) {
  return (
    <div className="infra-view">
      {infraBlocks.map(block => {
        const iconName = INFRA_BLOCK_ICONS[block.code]
        return (
          <div key={block.code}>
            <div className="infra-block-header">
              <div className="infra-block-icon">
                {iconName && <LucideIcon name={iconName} size={16} color="var(--accent)" strokeWidth={1.8} />}
              </div>
              <span className="infra-block-code">{block.code}</span>
              <span className="infra-block-title">{block.name}</span>
              <span className="infra-block-count">{block.sections.length} разделов</span>
              <div className="orbit-line" />
            </div>
            <div className="grid infra-grid">
              {block.sections.map(section => (
                <SectionCard
                  key={section.code}
                  section={section}
                  blockCode={block.code}
                  onInfraClick={onInfraClick}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
