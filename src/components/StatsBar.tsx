/* StatsBar — glassmorphism поверх hero */
import type { ClassifierObject } from '../types'
import { getCoreId, getOrbitId } from '../constants'
import satellitesData from '../../data/satellites.json'

interface Props { objects: ClassifierObject[] }

const totalSats = (satellitesData as any[]).reduce((s: number, g: any) => s + g.items.length, 0)

export default function StatsBar({ objects }: Props) {
  const allObjects = objects  // passed in filtered count; use raw for total
  const keys = objects.filter(o => o.key).length
  const cores = new Set(objects.map(o => getCoreId(o.code))).size
  const orbits = new Set(objects.map(o => getOrbitId(o.code))).size

  return (
    <div className="stats-glass">
      <div className="stat-glass"><div className="stat-val">{objects.length}</div><div className="stat-lbl">Объектов ядер</div></div>
      <div className="stat-glass-sep" />
      <div className="stat-glass"><div className="stat-val">{keys}</div><div className="stat-lbl">Ключевых ядер</div></div>
      <div className="stat-glass-sep" />
      <div className="stat-glass"><div className="stat-val">{cores}</div><div className="stat-lbl">Категорий</div></div>
      <div className="stat-glass-sep" />
      <div className="stat-glass"><div className="stat-val">{orbits}</div><div className="stat-lbl">Орбит</div></div>
      <div className="stat-glass-sep" />
      <div className="stat-glass"><div className="stat-val">{totalSats}</div><div className="stat-lbl">Спутников</div></div>
    </div>
  )
}
