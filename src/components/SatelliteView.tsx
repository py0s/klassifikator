/* ═══════════════════════════════════════════════════════════
   SatelliteView.tsx — Вид «Спутники»
   Все карточки спутников, фильтрация по группам (ЗА/ОЖ/СР/КУ)
   Клик по карточке → попап с деталями
   ═══════════════════════════════════════════════════════════ */

import { useState, useEffect } from 'react'
import type { SatelliteGroup, SatelliteItem } from '../types'
import { useTiltEffect } from '../hooks/useTiltEffect'
import CardComment from './CardComment'

interface Props {
  groups: SatelliteGroup[]
}

/* ─── Карточка спутника ─────────────────────────────────── */
function SatCard({
  item,
  color,
  onClick,
}: {
  item: SatelliteItem
  color: string
  onClick: () => void
}) {
  const { ref, handleMouseMove, handleMouseLeave } = useTiltEffect(6)
  return (
    <div
      ref={ref}
      className="sat-card"
      style={{ '--sat-color': color, cursor: 'pointer' } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
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
      <CardComment cardCode={item.code} cardName={item.name} />
    </div>
  )
}

/* ─── Попап деталей спутника ─────────────────────────────── */
function SatPopup({
  item,
  color,
  groupName,
  onClose,
}: {
  item: SatelliteItem
  color: string
  groupName: string
  onClose: () => void
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="popup-close" onClick={onClose}>✕</div>

        {/* Photo placeholder */}
        <div className="popup-photo-placeholder">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.4">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span style={{ fontSize: '.65rem', opacity: 0.4, marginTop: '6px' }}>Фото появится здесь</span>
        </div>

        {/* Header */}
        <div className="popup-head">
          <div className="popup-code-big" style={{ color }}>{item.code}</div>
          <div className="popup-title-big">{item.name}</div>
        </div>

        <div className="popup-body">
          {/* Stats */}
          <div className="popup-stats">
            <div className="ps">
              <div className="ps-lbl">Группа</div>
              <div className="ps-val">
                <span
                  style={{
                    display: 'inline-block',
                    background: color,
                    color: '#fff',
                    borderRadius: '4px',
                    padding: '1px 7px',
                    fontSize: '.7rem',
                    fontWeight: 600,
                  }}
                >
                  {item.code.split('.')[0]}
                </span>
                {' '}{groupName}
              </div>
            </div>
            {item.orbits && (
              <div className="ps">
                <div className="ps-lbl">Орбиты</div>
                <div className="ps-val">{item.orbits}</div>
              </div>
            )}
          </div>

          {/* Description */}
          {item.desc && (
            <>
              <div className="popup-section">Описание</div>
              <div className="popup-desc-full">{item.desc}</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Главный компонент ──────────────────────────────────── */
export default function SatelliteView({ groups }: Props) {
  const [activeGroup, setActiveGroup] = useState<string>('all')
  const [selected, setSelected] = useState<{ item: SatelliteItem; color: string; groupName: string } | null>(null)

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
            {g.items.map((item) => (
              <SatCard
                key={item.code}
                item={item}
                color={g.color}
                onClick={() => setSelected({ item, color: g.color, groupName: g.groupName })}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Попап */}
      {selected && (
        <SatPopup
          item={selected.item}
          color={selected.color}
          groupName={selected.groupName}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
