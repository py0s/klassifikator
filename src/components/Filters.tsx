import { ORBITS, CORES } from '../constants'
import LucideIcon from './LucideIcon'

interface Props {
  filterOrbit: string
  filterCore: string
  onOrbit: (v: string) => void
  onCore: (v: string) => void
}

export default function Filters({ filterOrbit, filterCore, onOrbit, onCore }: Props) {
  return (
    <div className="filters">
      <div className="f-group">
        <button
          className={`fbtn ${filterOrbit === 'all' ? 'act' : ''}`}
          style={filterOrbit === 'all' ? { background: 'var(--accent)', borderColor: 'var(--accent)' } : {}}
          onClick={() => onOrbit('all')}
        >
          Все орбиты
        </button>
        {ORBITS.map(ob => (
          <button
            key={ob.id}
            className={`fbtn ${filterOrbit === ob.id ? 'act' : ''}`}
            style={filterOrbit === ob.id ? { background: ob.color, borderColor: ob.color } : {}}
            onClick={() => onOrbit(ob.id)}
          >
            {ob.id.replace('O', 'О')} {ob.name}
          </button>
        ))}
      </div>
      <div className="f-sep" />
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
