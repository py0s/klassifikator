import { useState } from 'react'
import type { ClassifierObject, InfraBlock } from '../types'
import { ORBITS, CORES, getCoreId, getOrbitId } from '../constants'

interface Props {
  objects: ClassifierObject[]
  infraBlocks: InfraBlock[]
  onSelect: (obj: ClassifierObject) => void
}

export default function MatrixView({ objects, infraBlocks, onSelect }: Props) {
  // Which cores have infra expanded
  const [expandedCores, setExpandedCores] = useState<Set<string>>(new Set())
  // Which section chips are expanded (to show sub-items)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  // Hover on object => highlight its infraCodes
  const [litCodes, setLitCodes] = useState<string[]>([])

  function toggleCore(coreId: string) {
    setExpandedCores(prev => {
      const next = new Set(prev)
      next.has(coreId) ? next.delete(coreId) : next.add(coreId)
      return next
    })
  }

  function toggleSection(code: string) {
    setExpandedSections(prev => {
      const next = new Set(prev)
      next.has(code) ? next.delete(code) : next.add(code)
      return next
    })
  }

  // For a given core, get all infra blocks that have at least one section used in this core's objects
  function getInfraForCore(coreId: string) {
    const coreObjs = objects.filter(o => getCoreId(o.code) === coreId)
    const usedCodes = new Set(coreObjs.flatMap(o => o.infraCodes))

    return infraBlocks
      .map(block => ({
        ...block,
        sections: block.sections.filter(sec => usedCodes.has(sec.code)),
      }))
      .filter(block => block.sections.length > 0)
  }

  const numCols = ORBITS.length // 6 orbit columns

  return (
    <div className="matrix-wrap">
      <table className="matrix">
        <thead>
          <tr>
            <th style={{ width: 110 }} />
            {ORBITS.map(ob => (
              <th key={ob.id} style={{ color: ob.color }}>
                {ob.id.replace('O', 'О')} {ob.name}
                <br />
                <span style={{ fontWeight: 400, fontSize: '.48rem', opacity: 0.7 }}>{ob.range}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CORES.map(cr => {
            const coreObjs = objects.filter(o => getCoreId(o.code) === cr.id)
            const isExpanded = expandedCores.has(cr.id)
            const infraForCore = getInfraForCore(cr.id)

            return (
              <>
                {/* ── Основная строка ядра ── */}
                <tr key={cr.id} className="mx-core-row">
                  <td
                    className="core-label"
                    style={{ color: cr.color, cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => toggleCore(cr.id)}
                    title={isExpanded ? 'Свернуть инфраструктуру' : 'Развернуть инфраструктуру'}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '.35rem', flexWrap: 'nowrap' }}>
                      <span>{cr.emoji}</span>
                      <span style={{ flex: 1 }}>{cr.name}</span>
                      <span
                        className="mx-toggle"
                        style={{
                          transform: isExpanded ? 'rotate(90deg)' : 'none',
                          color: cr.color,
                          opacity: infraForCore.length ? 1 : 0.3,
                        }}
                      >▶</span>
                    </span>
                  </td>
                  {ORBITS.map(ob => {
                    const items = coreObjs.filter(o => getOrbitId(o.code) === ob.id)
                    return (
                      <td key={ob.id}>
                        {items.map(obj => {
                          return (
                            <div
                              key={obj.code}
                              className={`mx-item${obj.key ? ' mx-key' : ''}`}
                              onClick={() => onSelect(obj)}
                              onMouseEnter={() => setLitCodes(obj.infraCodes)}
                              onMouseLeave={() => setLitCodes([])}
                            >
                              <span className="mx-code" style={{ color: cr.color }}>
                                {obj.code.split('.').pop()}
                              </span>
                              <span className="mx-name">{obj.name}</span>
                            </div>
                          )
                        })}
                        {items.length > 0 && <span className="mx-count">{items.length}</span>}
                        {items.length === 0 && (
                          <span style={{ fontSize: '.48rem', color: 'var(--text3)' }}>—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>

                {/* ── Инфраструктурные строки (при раскрытии) ── */}
                {isExpanded && infraForCore.map(block => (
                  <tr key={`${cr.id}-${block.code}`} className="mx-infra-row">
                    {/* Левая ячейка: название блока */}
                    <td className="mx-infra-label">
                      <span className="mx-infra-block-name" style={{ color: cr.color }}>
                        {block.code}
                      </span>
                      <span className="mx-infra-block-full">{block.name}</span>
                    </td>
                    {/* Одна широкая ячейка, занимающая все орбиты */}
                    <td colSpan={numCols} className="mx-infra-cell">
                      <div className="mx-infra-chips">
                        {block.sections.map(sec => {
                          const isSecOpen = expandedSections.has(sec.code)
                          const secLit = litCodes.length > 0 && litCodes.includes(sec.code)
                          return (
                            <div key={sec.code} className={`mx-chip-wrap${secLit ? ' mx-chip-wrap--lit' : ''}`}>
                              <button
                                className={`mx-chip${isSecOpen ? ' mx-chip--open' : ''}${secLit ? ' mx-chip--lit' : ''}`}
                                onClick={() => toggleSection(sec.code)}
                                style={secLit ? { borderColor: cr.color, color: cr.color } : {}}
                              >
                                <span className="mx-chip-code">{sec.code}</span>
                                <span className="mx-chip-name">{sec.name}</span>
                                {sec.items.length > 0 && (
                                  <span className="mx-chip-chevron" style={{ transform: isSecOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
                                )}
                              </button>
                              {isSecOpen && (
                                <div className="mx-chip-items">
                                  {sec.items.map(item => (
                                    <div key={item.code} className="mx-chip-item">
                                      <span className="mx-chip-item-code">{item.code}</span>
                                      <span className="mx-chip-item-name">{item.name}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
