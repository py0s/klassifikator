/* ═══════════════════════════════════════════════════════════
   SatelliteView.tsx — Вид «Спутники»
   Все карточки спутников, фильтрация по группам (ЗА/ОЖ/СР/КУ/ТД)
   ═══════════════════════════════════════════════════════════ */

import { useState } from 'react'
import type { SatelliteGroup } from '../types'
import { useTiltEffect } from '../hooks/useTiltEffect'

interface Props {
  groups: SatelliteGroup[]
}

function SatCard({ item, color }: { item: { code: string; name: string; desc: string }; color: string }) {
  const { ref, handleMouseMove, handleMouseLeave } = useTiltEffect(6)
  return (
    <div
      ref={ref}
      className="sat-card"
      style={{ '--sat-color': color } as React.CSSProperties}
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
      <div className="sat-card-stripe" style={{ background: color }} />
      <div className="sat-card-body">
        <div className="sat-card-code" style={{ color }}>{item.code}</div>
        <div className="sat-card-name">{item.name}</div>
        {item.desc && <div className="sat-card-desc">{item.desc}</div>}
      </div>
    </div>
  )
}

export default function SatelliteView({ groups }: Props) {
  const [activeGroup, setActiveGroup] = useState<string>('all')

  const filtered = activeGroup === 'all'
    ? groups
    : groups.filter(g => g.group === activeGroup)

  const totalCount = groups.reduce((s, g) => s + g.items.length, 0)

  return (
    <div className="sat-view">
      {/* Фильтр по группам */}
      <div className="sat-filters">
        <button
          className={`sat-fbtn ${activeGroup === 'all' ? 'act' : ''}`}
          onClick={() => setActiveGroup('all')}
        >
          Все <span className="sat-fbtn-count">{totalCount}</span>
        </button>
        {groups.map(g => (
          <button
            key={g.group}
            className={`sat-fbtn ${activeGroup === g.group ? 'act' : ''}`}
            style={activeGroup === g.group ? { background: g.color, borderColor: g.color } : { '--sat-color': g.color } as React.CSSProperties}
            onClick={() => setActiveGroup(g.group)}
          >
            <span className="sat-fbtn-dot" style={{ background: g.color }} />
            {g.group} · {g.groupName}
            <span className="sat-fbtn-count">{g.items.length}</span>
          </button>
        ))}
      </div>

      {/* Карточки по группам */}
      {filtered.map(g => (
        <div key={g.group}>
          <div className="sat-group-label">
            <span className="sat-group-tag" style={{ background: g.color }}>{g.group}</span>
            <span className="sat-group-name">{g.groupName}</span>
            <span className="sat-group-count">{g.items.length} спутников</span>
            <div className="orbit-line" />
          </div>
          <div className="grid sat-grid">
            {g.items.map((item, i) => (
              <SatCard
                key={item.code}
                item={item}
                color={g.color}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
