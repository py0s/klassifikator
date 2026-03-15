/* ═══════════════════════════════════════════════════════════════
   types.ts — Все типы данных классификатора
   Редактируй здесь, если добавляешь новые поля в объекты
   ═══════════════════════════════════════════════════════════════ */

/** Коды ядер: Игра, Движение, Природа, Вода, Событие, Зима, Маршрут */
export type CoreId = 'И' | 'Д' | 'П' | 'В' | 'С' | 'З' | 'М';

/** Коды орбит: O1–O6 */
export type OrbitId = 'O1' | 'O2' | 'O3' | 'O4' | 'O5' | 'O6';

/** Спутник — обязательный сопутствующий объект */
export interface Satellite {
  code: string;   // например "ЗА.01"
  name: string;   // например "Туалет"
  norm?: string;  // например "1 модуль"
}

/** Объект классификатора — одна карточка в дашборде */
export interface ClassifierObject {
  code: string;        // "О2.И.01"
  name: string;        // "Площадка для младенцев (0–1,5)"
  key: boolean;        // true = ключевое ядро
  norm: string;        // "1 на 500 жит."
  area: string;        // "≥50 м²" или "—"
  season: string;      // "Круглогод." / "Май–сент."
  desc: string;        // полное описание
  sats: Satellite[];   // обязательные спутники
  infraCodes: string[];// ["СВ.01","СВ.02","ПК.02"] — ссылки на инфраструктуру
}

/** Подвид инфраструктурного элемента (СВ.01.01, СВ.01.02, ...) */
export interface InfraItem {
  code: string;     // "СВ.01.01"
  name: string;     // "Опора с консольным светильником"
  specs: string;    // "Асимметричная оптика... ≥10 лк..."
}

/** Раздел инфраструктуры (СВ.01, СВ.02, ...) */
export interface InfraSection {
  code: string;        // "СВ.01"
  name: string;        // "Функциональное освещение дорожек"
  purpose: string;     // назначение
  items: InfraItem[];  // подвиды
}

/** Блок инфраструктуры (СВ, Ц, Н, ...) */
export interface InfraBlock {
  code: string;           // "СВ"
  name: string;           // "Свет"
  icon: string;           // "💡"
  sections: InfraSection[];
}

/** Определение ядра */
export interface CoreDef {
  id: CoreId;
  name: string;
  icon: string;   // Lucide icon name
  color: string;
  bg: string;
}

/** Один спутник в реестре */
export interface SatelliteItem {
  code: string;   // "ЗА.01"
  name: string;   // "Общественный туалет"
  desc: string;   // описание
}

/** Группа спутников (ЗА, ОЖ, СР, КУ, ТД) */
export interface SatelliteGroup {
  group: string;      // "ЗА"
  groupName: string;  // "Забота"
  color: string;      // цвет группы
  items: SatelliteItem[];
}

/** Определение орбиты */
export interface OrbitDef {
  id: OrbitId;
  name: string;
  range: string;
  color: string;
  bg: string;
}
