/* ═══════════════════════════════════════════════════════════════
   constants.ts — Определения орбит и ядер
   Цвета, названия, иконки — всё в одном месте
   ═══════════════════════════════════════════════════════════════ */

import type { CoreDef, OrbitDef, CoreId } from './types';

export const ORBITS: OrbitDef[] = [
  { id: 'O1', name: 'Порог',   range: '0–50 м',    color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { id: 'O2', name: 'Двор',    range: '50–400 м',   color: '#84cc16', bg: 'rgba(132,204,22,0.08)' },
  { id: 'O3', name: 'Квартал', range: '400–800 м',  color: '#06b6d4', bg: 'rgba(6,182,212,0.08)' },
  { id: 'O4', name: 'Район',   range: '0,8–1,5 км', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
  { id: 'O5', name: 'Округ',   range: '1,5–5 км',   color: '#ec4899', bg: 'rgba(236,72,153,0.08)' },
  { id: 'O6', name: 'Город',   range: '>5 км',      color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
];

export const CORES: CoreDef[] = [
  { id: 'И', name: 'Игра',     icon: 'Gamepad2',      emoji: '🎮', color: '#f472b6', bg: 'rgba(244,114,182,0.1)' },
  { id: 'Д', name: 'Движение', icon: 'PersonStanding', emoji: '🏃', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
  { id: 'П', name: 'Природа',  icon: 'Leaf',           emoji: '🌿', color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
  { id: 'В', name: 'Вода',     icon: 'Waves',          emoji: '💧', color: '#38bdf8', bg: 'rgba(56,189,248,0.1)' },
  { id: 'С', name: 'Событие',  icon: 'CalendarDays',   emoji: '🎭', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  { id: 'З', name: 'Зима',     icon: 'Snowflake',      emoji: '❄️', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  { id: 'М', name: 'Маршрут',  icon: 'Route',          emoji: '🛤️', color: '#fb923c', bg: 'rgba(251,146,60,0.1)' },
];

/** Lucide иконки для инфраструктурных блоков (по коду блока) */
export const INFRA_BLOCK_ICONS: Record<string, string> = {
  'СВ': 'Lightbulb',
  'Ц':  'Palette',
  'Н':  'Sprout',
  'ПК': 'Shield',
  'МЕ': 'Armchair',
  'С':  'Megaphone',
  'В':  'Droplets',
  'БЗ': 'Lock',
  'ИН': 'Wifi',
  'ТД': 'Truck',
};

/** Извлечь код ядра из кода объекта: "О2.И.01" → "И" */
export function getCoreId(code: string): string {
  return code.match(/\.([ИДПВСЗМ])\./)?.[1] || '';
}

/** Извлечь номер орбиты: "О2.И.01" → "O2" */
export function getOrbitId(code: string): string {
  const n = code.match(/О(\d)/)?.[1];
  return n ? `O${n}` : '';
}

/** Найти определение ядра по коду объекта */
export function findCore(code: string): CoreDef | undefined {
  return CORES.find(c => c.id === getCoreId(code));
}

/** Найти определение орбиты по коду объекта */
export function findOrbit(code: string): OrbitDef | undefined {
  return ORBITS.find(o => o.id === getOrbitId(code));
}
