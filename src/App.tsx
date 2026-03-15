/* ═══════════════════════════════════════════════════════════
   App.tsx — Корневой компонент (5 видов)
   Ядра | Орбиты | Спутники | Инфраструктурные слои | Матрица
   ═══════════════════════════════════════════════════════════ */

import { useState, useMemo, useCallback } from 'react'
import type { ClassifierObject, InfraBlock, InfraSection, SatelliteGroup } from './types'
import { getCoreId, getOrbitId } from './constants'

import objectsData from '../data/objects.json'
import infraData from '../data/infrastructure.json'
import satellitesData from '../data/satellites.json'

import Header from './components/Header'
import StatsBar from './components/StatsBar'
import CoreFilter from './components/CoreFilter'
import CardGrid from './components/CardGrid'
import OrbitView from './components/OrbitView'
import MatrixView from './components/MatrixView'
import SatelliteView from './components/SatelliteView'
import InfraView from './components/InfraView'
import ObjectPopup from './components/ObjectPopup'
import InfraDetailModal from './components/InfraDetailModal'

const objects = objectsData as ClassifierObject[]
const infraBlocks = infraData as InfraBlock[]
const satellites = satellitesData as SatelliteGroup[]

type ViewType = 'cores' | 'orbits' | 'satellites' | 'infra' | 'matrix'

const VIEWS: { id: ViewType; label: string }[] = [
  { id: 'cores',      label: 'Ядра' },
  { id: 'orbits',     label: 'Орбиты' },
  { id: 'satellites', label: 'Спутники' },
  { id: 'infra',      label: 'Инфраструктурные слои' },
  { id: 'matrix',     label: 'Матрица' },
]

export default function App() {
  // ─── State ───
  const [filterCore, setFilterCore] = useState<string>('all')
  const [view, setView] = useState<ViewType>('cores')
  const [selectedObject, setSelectedObject] = useState<ClassifierObject | null>(null)
  const [selectedInfraSection, setSelectedInfraSection] = useState<InfraSection | null>(null)
  const [hoveredInfraCode, setHoveredInfraCode] = useState<string | null>(null)
  const [hoveredCardInfraCodes, setHoveredCardInfraCodes] = useState<string[]>([])

  // ─── Filtered objects by core ───
  const filtered = useMemo(() => {
    return objects.filter(obj => {
      if (filterCore !== 'all' && getCoreId(obj.code) !== filterCore) return false
      return true
    })
  }, [filterCore])

  // ─── Infra lookup ───
  const findInfraSection = useCallback((code: string): InfraSection | null => {
    for (const block of infraBlocks) {
      const s = block.sections.find(s => s.code === code)
      if (s) return s
    }
    return null
  }, [])

  const openInfraDetail = useCallback((code: string) => {
    const s = findInfraSection(code)
    if (s) setSelectedInfraSection(s)
  }, [findInfraSection])

  const sharedCardProps = {
    infraBlocks,
    hoveredInfraCode,
    hoveredCardInfraCodes,
    onSelect: setSelectedObject,
    onInfraHover: setHoveredInfraCode,
    onInfraClick: openInfraDetail,
    onCardHover: setHoveredCardInfraCodes,
    onCardLeave: () => setHoveredCardInfraCodes([]),
  }

  return (
    <>
      {/* ── Hero ── */}
      <Header />

      {/* ── Stats (glassmorphism) ── */}
      <StatsBar objects={objects} />

      {/* ── View toggle ── */}
      <div className="view-toggle">
        {VIEWS.map(v => (
          <button
            key={v.id}
            className={`vtbtn ${view === v.id ? 'act' : ''}`}
            onClick={() => setView(v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* ── Core filter (only for cores/matrix view) ── */}
      {(view === 'cores' || view === 'matrix') && (
        <CoreFilter filterCore={filterCore} onCore={setFilterCore} />
      )}

      {/* ── Views ── */}
      {view === 'cores' && (
        <CardGrid objects={filtered} {...sharedCardProps} />
      )}

      {view === 'orbits' && (
        <OrbitView objects={objects} {...sharedCardProps} />
      )}

      {view === 'satellites' && (
        <SatelliteView groups={satellites} />
      )}

      {view === 'infra' && (
        <InfraView infraBlocks={infraBlocks} onInfraClick={openInfraDetail} />
      )}

      {view === 'matrix' && (
        <MatrixView
          objects={filtered}
          infraBlocks={infraBlocks}
          onSelect={setSelectedObject}
        />
      )}

      {/* ── Popups ── */}
      {selectedObject && (
        <ObjectPopup
          obj={selectedObject}
          infraBlocks={infraBlocks}
          onClose={() => setSelectedObject(null)}
          onInfraClick={openInfraDetail}
        />
      )}

      {selectedInfraSection && (
        <InfraDetailModal
          section={selectedInfraSection}
          onClose={() => setSelectedInfraSection(null)}
        />
      )}
    </>
  )
}
