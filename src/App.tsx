/* ═══════════════════════════════════════════════════════════
   App.tsx — Корневой компонент
   Управление фильтрами, видами, попапами
   ═══════════════════════════════════════════════════════════ */

import { useState, useMemo, useCallback } from 'react'
import type { ClassifierObject, InfraBlock, InfraSection } from './types'
import { ORBITS, CORES, getCoreId, getOrbitId } from './constants'

import objectsData from '../data/objects.json'
import infraData from '../data/infrastructure.json'

import Header from './components/Header'
import StatsBar from './components/StatsBar'
import Filters from './components/Filters'
import CardGrid from './components/CardGrid'
import MatrixView from './components/MatrixView'
import ObjectPopup from './components/ObjectPopup'
import InfraDetailModal from './components/InfraDetailModal'

const objects = objectsData as ClassifierObject[]
const infraBlocks = infraData as InfraBlock[]

export default function App() {
  // ─── Filters ───
  const [filterOrbit, setFilterOrbit] = useState<string>('all')
  const [filterCore, setFilterCore] = useState<string>('all')
  const [view, setView] = useState<'cards' | 'matrix'>('cards')

  // ─── Popups ───
  const [selectedObject, setSelectedObject] = useState<ClassifierObject | null>(null)
  const [selectedInfraSection, setSelectedInfraSection] = useState<InfraSection | null>(null)

  // ─── Hover state: когда наводят на infra-chip → подсветка карточек ───
  const [hoveredInfraCode, setHoveredInfraCode] = useState<string | null>(null)

  // ─── Hover state: когда наводят на карточку → подсветка слоёв в панели ───
  const [hoveredCardInfraCodes, setHoveredCardInfraCodes] = useState<string[]>([])

  // ─── Filtered objects ───
  const filtered = useMemo(() => {
    return objects.filter(obj => {
      if (filterOrbit !== 'all' && getOrbitId(obj.code) !== filterOrbit) return false
      if (filterCore !== 'all' && getCoreId(obj.code) !== filterCore) return false
      return true
    })
  }, [filterOrbit, filterCore])

  // ─── Find infra section by code (e.g. "СВ.01") ───
  const findInfraSection = useCallback((sectionCode: string): InfraSection | null => {
    for (const block of infraBlocks) {
      const section = block.sections.find(s => s.code === sectionCode)
      if (section) return section
    }
    return null
  }, [])

  // ─── Open infra section detail ───
  const openInfraDetail = useCallback((sectionCode: string) => {
    const section = findInfraSection(sectionCode)
    if (section) setSelectedInfraSection(section)
  }, [findInfraSection])

  return (
    <>
      <Header />
      <StatsBar objects={filtered} />
      <Filters
        filterOrbit={filterOrbit}
        filterCore={filterCore}
        onOrbit={setFilterOrbit}
        onCore={setFilterCore}
      />

      <div className="view-toggle">
        <button className={`vtbtn ${view === 'cards' ? 'act' : ''}`} onClick={() => setView('cards')}>
          Карточки
        </button>
        <button className={`vtbtn ${view === 'matrix' ? 'act' : ''}`} onClick={() => setView('matrix')}>
          Матрица
        </button>
      </div>

      {view === 'cards' ? (
        <CardGrid
          objects={filtered}
          infraBlocks={infraBlocks}
          hoveredInfraCode={hoveredInfraCode}
          hoveredCardInfraCodes={hoveredCardInfraCodes}
          onSelect={setSelectedObject}
          onInfraHover={setHoveredInfraCode}
          onInfraClick={openInfraDetail}
          onCardHover={setHoveredCardInfraCodes}
          onCardLeave={() => setHoveredCardInfraCodes([])}
        />
      ) : (
        <MatrixView
          objects={filtered}
          infraBlocks={infraBlocks}
          onSelect={setSelectedObject}
        />
      )}

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
