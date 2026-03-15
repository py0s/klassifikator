/* ═══════════════════════════════════════════════════════════
   OrbitView.tsx — Вид «Орбиты»
   Карточки орбит → клик → список объектов этой орбиты
   ═══════════════════════════════════════════════════════════ */

import { useState } from 'react'
import type { ClassifierObject } from '../types'
import { ORBITS, getOrbitId } from '../constants'
import { useTiltEffect } from '../hooks/useTiltEffect'
import ObjectCard from './ObjectCard'
import CardComment from './CardComment'
import type { InfraBlock } from '../types'

interface Props {
  objects: ClassifierObject[]
  infraBlocks: InfraBlock[]
  hoveredInfraCode: string | null
  onSelect: (obj: ClassifierObject) => void
  onInfraHover: (code: string | null) => void
  onInfraClick: (code: string) => void
  onCardHover: (codes: string[]) => void
  onCardLeave: () => void
}

function OrbitCard({ orbit, count, onClick }: {
  orbit: typeof ORBITS[0]
  count: number
  onClick: () => void
}) {
  const { ref, handleMouseMove, handleMouseLeave } = useTiltEffect(6)
  return (
    <div
      ref={ref}
      className="orbit-card"
      style={{ '--orbit-color': orbit.color, '--orbit-bg': orbit.bg } as React.CSSProperties}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Placeholder зона */}
      <div className="card-placeholder">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>

      <div className="orbit-card-body">
        <div className="orbit-card-id" style={{ color: orbit.color }}>
          {orbit.id.replace('O', 'О')}
        </div>
        <div className="orbit-card-name">{orbit.name}</div>
        <div className="orbit-card-range">{orbit.range}</div>
        <div className="orbit-card-footer">
          <span className="orbit-card-count">{count} объектов</span>
          <span className="orbit-card-cta">Смотреть →</span>
        </div>
      </div>

      <CardComment cardCode={orbit.id} cardName={orbit.name} />

      {/* Цветная полоска снизу */}
      <div className="orbit-card-stripe" style={{ background: orbit.color }} />
    </div>
  )
}

export default function OrbitView({
  objects,
  infraBlocks,
  hoveredInfraCode,
  onSelect,
  onInfraHover,
  onInfraClick,
  onCardHover,
  onCardLeave,
}: Props) {
  const [selectedOrbit, setSelectedOrbit] = useState<string | null>(null)

  const selectedOrbitDef = ORBITS.find(o => o.id === selectedOrbit)
  const filteredObjects = selectedOrbit
    ? objects.filter(obj => getOrbitId(obj.code) === selectedOrbit)
    : []

  if (selectedOrbit && selectedOrbitDef) {
    return (
      <div className="orbit-detail-view">
        {/* Back button */}
        <div className="orbit-detail-header">
          <button className="orbit-back-btn" onClick={() => setSelectedOrbit(null)}>
            ← Все орбиты
          </button>
          <div className="orbit-detail-info">
            <span className="orbit-tag" style={{ background: selectedOrbitDef.color }}>
              {selectedOrbitDef.id.replace('O', 'О')} {selectedOrbitDef.name}
            </span>
            <span className="orbit-detail-range">{selectedOrbitDef.range}</span>
            <span className="orbit-detail-count">{filteredObjects.length} объектов</span>
          </div>
        </div>

        {/* Карточки объектов этой орбиты */}
        <div className="grid" style={{ padding: '.5rem 1.5rem 1.5rem' }}>
          {filteredObjects.map(obj => (
            <ObjectCard
              key={obj.code}
              obj={obj}
              hoveredInfraCode={hoveredInfraCode}
              onClick={() => onSelect(obj)}
              onInfraHover={onInfraHover}
              onInfraClick={onInfraClick}
              onCardHover={onCardHover}
              onCardLeave={onCardLeave}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="orbit-view">
      <div className="grid orbit-grid" style={{ padding: '.5rem 1.5rem 1.5rem', maxWidth: 1500, margin: '0 auto' }}>
        {ORBITS.map(orbit => {
          const count = objects.filter(obj => getOrbitId(obj.code) === orbit.id).length
          return (
            <OrbitCard
              key={orbit.id}
              orbit={orbit}
              count={count}
              onClick={() => setSelectedOrbit(orbit.id)}
            />
          )
        })}
      </div>
    </div>
  )
}
