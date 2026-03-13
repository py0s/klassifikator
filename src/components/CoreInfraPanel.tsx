/* ════════════════════════════════════════════════════════════════
   CoreInfraPanel.tsx — Аккордеон инфраструктуры на ядро

   Поведение:
   • Показывает все уникальные InfraSection, которые есть в объектах ядра
   • Hover на строку секции → раскрывает sub-items + вызывает onInfraHover(code)
   • Ряды подсвечиваются, если их код есть в hoveredCardInfraCodes
   • Клик по заголовку панели → полностью collapse/expand панель
   ════════════════════════════════════════════════════════════════ */

import { useState, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import type { ClassifierObject, InfraBlock, InfraSection } from '../types'

interface Props {
  coreId: string
  coreName: string
  coreColor: string
  objects: ClassifierObject[]
  infraBlocks: InfraBlock[]
  hoveredCardInfraCodes: string[]   // коды инфры карточки под курсором
  onInfraHover: (code: string | null) => void
}

export default function CoreInfraPanel({
  coreId, coreName, coreColor, objects, infraBlocks, hoveredCardInfraCodes, onInfraHover
}: Props) {
  const [open, setOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  // Все уникальные infraCodes, используемые в объектах данного ядра
  const usedCodes = useMemo(() => {
    const set = new Set<string>()
    objects.forEach(o => o.infraCodes.forEach(c => set.add(c)))
    return set
  }, [objects])

  // Найти InfraSection по коду
  const findSection = (code: string): InfraSection | null => {
    for (const block of infraBlocks) {
      const s = block.sections.find(s => s.code === code)
      if (s) return s
    }
    return null
  }

  // Собрать уникальные секции из usedCodes
  const sections = useMemo((): InfraSection[] => {
    const seen = new Set<string>()
    const result: InfraSection[] = []
    usedCodes.forEach(code => {
      const s = findSection(code)
      if (s && !seen.has(s.code)) {
        seen.add(s.code)
        result.push(s)
      }
    })
    return result.sort((a, b) => a.code.localeCompare(b.code))
  }, [usedCodes, infraBlocks])

  if (sections.length === 0) return null

  return (
    <div className="cip-wrap">
      {/* ── Заголовок-качелька ── */}
      <button
        className={`cip-header ${open ? 'cip-header--open' : ''}`}
        style={{ '--cip-color': coreColor } as React.CSSProperties}
        onClick={() => { setOpen(o => !o); setExpandedSection(null) }}
      >
        <span className="cip-header-label">
          <span className="cip-dot" style={{ background: coreColor }} />
          {coreName}
          <span className="cip-count">{sections.length} слоёв</span>
        </span>
        <ChevronDown
          size={13}
          className={`cip-chevron ${open ? 'cip-chevron--open' : ''}`}
          style={{ color: coreColor }}
        />
      </button>

      {/* ── Тело панели ── */}
      {open && (
        <div className="cip-body">
          {sections.map(sec => {
            const isHighlighted = hoveredCardInfraCodes.includes(sec.code)
            const isExpanded = expandedSection === sec.code

            return (
              <div
                key={sec.code}
                className={`cip-row ${isHighlighted ? 'cip-row--lit' : ''} ${isExpanded ? 'cip-row--expanded' : ''}`}
                onMouseEnter={() => {
                  onInfraHover(sec.code)
                  setExpandedSection(sec.code)
                }}
                onMouseLeave={() => {
                  onInfraHover(null)
                  setExpandedSection(null)
                }}
              >
                {/* Строка секции */}
                <div className="cip-sec-line">
                  <span
                    className="cip-sec-code"
                    style={{ color: isHighlighted ? coreColor : undefined }}
                  >
                    {sec.code}
                  </span>
                  <span className="cip-sec-name">{sec.name}</span>
                  {sec.items.length > 0 && (
                    <span className="cip-sub-count">{sec.items.length}</span>
                  )}
                </div>

                {/* Sub-items — раскрываются при hover */}
                {isExpanded && sec.items.length > 0 && (
                  <div className="cip-sub-items">
                    {sec.items.map(item => (
                      <div key={item.code} className="cip-sub-row">
                        <span className="cip-sub-code">{item.code}</span>
                        <span className="cip-sub-name">{item.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
