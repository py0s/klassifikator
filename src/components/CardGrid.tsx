import type { ClassifierObject, InfraBlock } from '../types'
import { ORBITS, getOrbitId } from '../constants'
import ObjectCard from './ObjectCard'

interface Props {
  objects: ClassifierObject[]
  infraBlocks: InfraBlock[]
  hoveredInfraCode: string | null
  hoveredCardInfraCodes: string[]
  onSelect: (obj: ClassifierObject) => void
  onInfraHover: (code: string | null) => void
  onInfraClick: (code: string) => void
  onCardHover: (codes: string[]) => void
  onCardLeave: () => void
}

export default function CardGrid({
  objects,
  hoveredInfraCode,
  onSelect, onInfraHover, onInfraClick, onCardHover, onCardLeave
}: Props) {
  return (
    <>
      {ORBITS.map(orbit => {
        const items = objects.filter(o => getOrbitId(o.code) === orbit.id)
        if (!items.length) return null
        return (
          <div key={orbit.id}>
            <div className="orbit-sec">
              <span className="orbit-tag" style={{ background: orbit.color }}>
                {orbit.id.replace('O', 'О')} {orbit.name}
              </span>
              <span className="orbit-desc">{orbit.range}</span>
              <div className="orbit-line" />
            </div>
            <div className="grid">
              {items.map(obj => (
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
      })}
    </>
  )
}
