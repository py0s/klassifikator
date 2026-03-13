import { useState } from 'react'
import type { ClassifierObject, InfraBlock, InfraSection } from '../types'
import { ORBITS, CORES, getCoreId, getOrbitId } from '../constants'
import LucideIcon from './LucideIcon'
import InfraDetailModal from './InfraDetailModal'

interface Props {
  objects: ClassifierObject[]
  infraBlocks: InfraBlock[]
  onSelect: (obj: ClassifierObject) => void
}

export default function MatrixView({ objects, infraBlocks, onSelect }: Props) {
  const [expandedCores, setExpandedCores] = useState<Set<string>>(new Set())
  // Popup for infra section detail
  const [popupSection, setPopupSection] = useState<InfraSection | null>(null)
  // Hover on object => highlight its infraCodes and satCodes
  const [litCodes, setLitCodes] = useState<string[]>([])
  const [litSatCodes, setLitSatCodes] = useState<string[]>([])

  function toggleCore(coreId: string) {
    setExpandedCores(prev => {
      const next = new Set(prev)
      next.has(coreId) ? next.delete(coreId) : next.add(coreId)
      return next
    })
  }

  function openInfraPopup(secCode: string) {
    for (const block of infraBlocks) {
      const sec = block.sections.find(s => s.code === secCode)
      if (sec) { setPopupSection(sec); return }
    }
  }

  function getInfraForCore(coreId: string) {
    const coreObjs = objects.filter(o => getCoreId(o.code) === coreId)
    const usedCodes = new Set(coreObjs.flatMap(o => o.infraCodes))
    return infraBlocks
      .map(block => ({ ...block, sections: block.sections.filter(sec => usedCodes.has(sec.code)) }))
      .filter(block => block.sections.length > 0)
  }

  function getSatsForCore(coreId: string) {
    const coreObjs = objects.filter(o => getCoreId(o.code) === coreId)
    const seen = new Set<string>()
    const result: { code: string; name: string }[] = []
    for (const obj of coreObjs) {
      for (const sat of obj.sats) {
        if (!seen.has(sat.code)) { seen.add(sat.code); result.push(sat) }
      }
    }
    return result
  }

  const numCols = ORBITS.length

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
            const satsForCore = getSatsForCore(cr.id)
            const hasExpandable = infraForCore.length > 0 || satsForCore.length > 0

            return (
              <>
                {/* ── Основная строка ядра ── */}
                <tr key={cr.id} className="mx-core-row">
                  <td
                    className="core-label"
                    style={{ color: cr.color, cursor: hasExpandable ? 'pointer' : 'default', userSelect: 'none' }}
                    onClick={() => hasExpandable && toggleCore(cr.id)}
                    title={isExpanded ? 'Свернуть' : 'Развернуть инфра-слои и спутники'}
                  >
                    <span style={{ display: 'flex', flexDirection: 'column', gap: '.2rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                        <LucideIcon name={cr.icon} size={14} color={cr.color} />
                        <span style={{ flex: 1 }}>{cr.name}</span>
                        {hasExpandable && (
                          <span className="mx-toggle" style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', color: cr.color }}>▶</span>
                        )}
                      </span>
                      {hasExpandable && (
                        <span style={{
                          fontSize: '.42rem',
                          color: 'var(--text3)',
                          opacity: 0.55,
                          textTransform: 'uppercase',
                          letterSpacing: '.04em',
                          whiteSpace: 'normal',
                          lineHeight: 1.3,
                        }}>
                          спутники и инфраструктурные слои
                        </span>
                      )}
                    </span>
                  </td>
                  {ORBITS.map(ob => {
                    const items = coreObjs.filter(o => getOrbitId(o.code) === ob.id)
                    return (
                      <td key={ob.id}>
                        {items.map(obj => (
                          <div
                            key={obj.code}
                            className="mx-item"
                            onClick={() => onSelect(obj)}
                            onMouseEnter={() => {
                              setLitCodes(obj.infraCodes)
                              setLitSatCodes(obj.sats.map(s => s.code))
                            }}
                            onMouseLeave={() => { setLitCodes([]); setLitSatCodes([]) }}
                          >
                            <span className="mx-code" style={{ color: cr.color }}>
                              {obj.code.split('.').pop()}
                            </span>
                            <span className="mx-name">{obj.name}</span>
                          </div>
                        ))}
                        {items.length > 0 && <span className="mx-count">{items.length}</span>}
                        {items.length === 0 && <span style={{ fontSize: '.48rem', color: 'var(--text3)' }}>—</span>}
                      </td>
                    )
                  })}
                </tr>

                {/* ── Инфраструктурные строки ── */}
                {isExpanded && infraForCore.map(block => (
                  <tr key={`${cr.id}-${block.code}`} className="mx-infra-row">
                    <td className="mx-infra-label">
                      <span className="mx-infra-block-name" style={{ color: cr.color }}>{block.code}</span>
                      <span className="mx-infra-block-full">{block.name}</span>
                    </td>
                    <td colSpan={numCols} className="mx-infra-cell">
                      <div className="mx-infra-chips">
                        {block.sections.map(sec => {
                          const secLit = litCodes.length > 0 && litCodes.includes(sec.code)
                          return (
                            <button
                              key={sec.code}
                              className={`mx-chip${secLit ? ' mx-chip--lit' : ''}`}
                              onClick={() => openInfraPopup(sec.code)}
                              style={secLit ? { borderColor: cr.color, color: cr.color } : {}}
                            >
                              <span className="mx-chip-code">{sec.code}</span>
                              <span className="mx-chip-name">{sec.name}</span>
                            </button>
                          )
                        })}
                      </div>
                    </td>
                  </tr>
                ))}

                {/* ── Строка спутников ── */}
                {isExpanded && satsForCore.length > 0 && (
                  <tr key={`${cr.id}-sats`} className="mx-infra-row mx-sats-row">
                    <td className="mx-infra-label">
                      <span className="mx-infra-block-name" style={{ color: cr.color }}>СП</span>
                      <span className="mx-infra-block-full">Спутники</span>
                    </td>
                    <td colSpan={numCols} className="mx-infra-cell">
                      <div className="mx-infra-chips">
                        {satsForCore.map(sat => {
                          const satLit = litSatCodes.length > 0 && litSatCodes.includes(sat.code)
                          return (
                            <div
                              key={sat.code}
                              className={`mx-chip mx-sat-chip${satLit ? ' mx-chip--lit' : ''}`}
                              style={satLit ? { borderColor: cr.color, color: cr.color } : {}}
                            >
                              <span className="mx-chip-code">{sat.code}</span>
                              <span className="mx-chip-name">{sat.name}</span>
                            </div>
                          )
                        })}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )
          })}
        </tbody>
      </table>

      {/* ── Popup инфра-секции ── */}
      {popupSection && (
        <InfraDetailModal section={popupSection} onClose={() => setPopupSection(null)} />
      )}
    </div>
  )
}
