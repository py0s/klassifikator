/* ═══════════════════════════════════════════════════════════
   ObjectPopup.tsx — Попап объекта
   
   Открывается при клике на карточку.
   Внизу — панель инфраструктуры: все инфра-секции объекта.
   Клик по секции → открывает InfraDetailModal с подвидами.
   ═══════════════════════════════════════════════════════════ */

import { useEffect } from 'react'
import type { ClassifierObject, InfraBlock } from '../types'
import { findCore, findOrbit } from '../constants'

interface Props {
  obj: ClassifierObject
  infraBlocks: InfraBlock[]
  onClose: () => void
  onInfraClick: (sectionCode: string) => void
}

export default function ObjectPopup({ obj, infraBlocks, onClose, onInfraClick }: Props) {
  const core = findCore(obj.code)
  const orbit = findOrbit(obj.code)

  // ESC закрывает
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Собрать инфра-секции с данными из справочника
  const infraSections = obj.infraCodes.map(code => {
    // code = "СВ.01" → ищем в блоках
    for (const block of infraBlocks) {
      const section = block.sections.find(s => s.code === code)
      if (section) return { block, section }
    }
    return null
  }).filter(Boolean) as { block: InfraBlock; section: { code: string; name: string } }[]

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={e => e.stopPropagation()}>
        <div className="popup-close" onClick={onClose}>✕</div>

        {/* Header */}
        <div className="popup-head">
          <div className="popup-icon">{obj.icon}</div>
          <div className="popup-code-big" style={{ color: core?.color }}>
            {obj.code}
          </div>
          <div className="popup-title-big">{obj.name}</div>
        </div>

        <div className="popup-body">
          {/* Stats grid */}
          <div className="popup-stats">
            <div className="ps">
              <div className="ps-lbl">Орбита</div>
              <div className="ps-val" style={{ color: orbit?.color }}>
                {orbit?.id.replace('O', 'О')} {orbit?.name}
              </div>
            </div>
            <div className="ps">
              <div className="ps-lbl">Ядро</div>
              <div className="ps-val" style={{ color: core?.color }}>
                {core?.icon} {core?.name}
              </div>
            </div>
            <div className="ps">
              <div className="ps-lbl">Категория</div>
              <div className="ps-val">{obj.key ? 'Ключевое ядро' : 'Объект орбиты'}</div>
            </div>
            <div className="ps">
              <div className="ps-lbl">Норматив</div>
              <div className="ps-val">{obj.norm}</div>
            </div>
            <div className="ps">
              <div className="ps-lbl">Площадь</div>
              <div className="ps-val">{obj.area}</div>
            </div>
            <div className="ps">
              <div className="ps-lbl">Сезон</div>
              <div className="ps-val">{obj.season}</div>
            </div>
          </div>

          {/* Description */}
          <div className="popup-section">Описание</div>
          <div className="popup-desc-full">{obj.desc}</div>

          {/* Satellites */}
          {obj.sats.length > 0 && (
            <>
              <div className="popup-section">Обязательные спутники</div>
              <div className="popup-sats">
                {obj.sats.map((s, i) => (
                  <div key={i} className="ps-row">
                    <span className="ps-row-code">{s.code}</span>
                    <span className="ps-row-name">{s.name}</span>
                    {s.norm && <span style={{ fontSize: '.58rem', color: 'var(--text3)' }}>{s.norm}</span>}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ═══ INFRASTRUCTURE PANEL ═══ */}
          {infraSections.length > 0 && (
            <div className="infra-panel">
              <div className="infra-panel-title">Инфраструктурные слои</div>
              <div className="infra-block-row">
                {infraSections.map(({ block, section }) => (
                  <div
                    key={section.code}
                    className="infra-block-chip"
                    onClick={() => onInfraClick(section.code)}
                  >
                    <span className="chip-icon">{block.icon}</span>
                    <span className="chip-code">{section.code}</span>
                    <span style={{ fontSize: '.55rem' }}>{section.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
