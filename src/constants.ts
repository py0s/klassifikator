/* ═══════════════════════════════════════════════════════════════
   constants.ts — Определения орбит и ядер
   Цвета, названия, иконки — всё в одном месте
   ═══════════════════════════════════════════════════════════════ */

import type { CoreDef, OrbitDef, CoreId } from './types';

export const ORBITS: OrbitDef[] = [
  { id: 'O1', name: 'Порог',   range: '0–50 м',    color: '#a16207', bg: 'rgba(161,98,7,0.09)' },
  { id: 'O2', name: 'Двор',    range: '50–400 м',   color: '#3f6212', bg: 'rgba(63,98,18,0.09)' },
  { id: 'O3', name: 'Квартал', range: '400–800 м',  color: '#0e7490', bg: 'rgba(14,116,144,0.09)' },
  { id: 'O4', name: 'Район',   range: '0,8–1,5 км', color: '#5b21b6', bg: 'rgba(91,33,182,0.09)' },
  { id: 'O5', name: 'Округ',   range: '1,5–5 км',   color: '#9d174d', bg: 'rgba(157,23,77,0.09)' },
  { id: 'O6', name: 'Город',   range: '>5 км',      color: '#991b1b', bg: 'rgba(153,27,27,0.09)' },
];

export const CORES: CoreDef[] = [
  { id: 'И', name: 'Игра',     icon: 'Gamepad2',      emoji: '🎮', color: '#9d174d', bg: 'rgba(157,23,77,0.09)' },
  { id: 'Д', name: 'Движение', icon: 'PersonStanding', emoji: '🏃', color: '#1d4ed8', bg: 'rgba(29,78,216,0.09)' },
  { id: 'П', name: 'Природа',  icon: 'Leaf',           emoji: '🌿', color: '#15803d', bg: 'rgba(21,128,61,0.09)' },
  { id: 'В', name: 'Вода',     icon: 'Waves',          emoji: '💧', color: '#0369a1', bg: 'rgba(3,105,161,0.09)' },
  { id: 'С', name: 'Событие',  icon: 'CalendarDays',   emoji: '🎭', color: '#92400e', bg: 'rgba(146,64,14,0.09)' },
  { id: 'З', name: 'Зима',     icon: 'Snowflake',      emoji: '❄️', color: '#4c1d95', bg: 'rgba(76,29,149,0.09)' },
  { id: 'М', name: 'Маршрут',  icon: 'Route',          emoji: '🛤️', color: '#c2410c', bg: 'rgba(194,65,12,0.09)' },
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
