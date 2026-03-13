import type { ClassifierObject } from '../types'
import { getCoreId, getOrbitId } from '../constants'

interface Props { objects: ClassifierObject[] }

export default function StatsBar({ objects }: Props) {
  const keys = objects.filter(o => o.key).length
  const cores = new Set(objects.map(o => getCoreId(o.code))).size
  const orbits = new Set(objects.map(o => getOrbitId(o.code))).size

  return (
    <div className="stats">
      <div className="stat"><div className="stat-val">{objects.length}</div><div className="stat-lbl">Объектов</div></div>
      <div className="stat"><div className="stat-val">{keys}</div><div className="stat-lbl">Ключевых ядер</div></div>
      <div className="stat"><div className="stat-val">{cores}</div><div className="stat-lbl">Категорий</div></div>
      <div className="stat"><div className="stat-val">{orbits}</div><div className="stat-lbl">Орбит</div></div>
    </div>
  )
}
