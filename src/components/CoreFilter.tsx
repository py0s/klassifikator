/* ═══════════════════════════════════════════════════════════
   CoreFilter.tsx — Фильтр по ядрам (для вида «Ядра»)
   ═══════════════════════════════════════════════════════════ */
import { CORES } from '../constants'
import LucideIcon from './LucideIcon'

interface Props {
  filterCore: string
  onCore: (v: string) => void
}

export default function CoreFilter({ filterCore, onCore }: Props) {
  return (
    <div className="filters">
      <div className="f-group">
        <button
          className={`fbtn ${filterCore === 'all' ? 'act' : ''}`}
          style={filterCore === 'all' ? { background: 'var(--accent)', borderColor: 'var(--accent)' } : {}}
          onClick={() => onCore('all')}
        >
          Все ядра
        </button>
        {CORES.map(cr => (
          <button
            key={cr.id}
            className={`fbtn fbtn--icon ${filterCore === cr.id ? 'act' : ''}`}
            style={filterCore === cr.id ? { background: cr.color, borderColor: cr.color } : {}}
            onClick={() => onCore(cr.id)}
          >
            <LucideIcon name={cr.icon} size={11} />
            {cr.name}
          </button>
        ))}
      </div>
    </div>
  )
}
