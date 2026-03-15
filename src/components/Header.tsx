/* ═══════════════════════════════════════════════════════════
   Header.tsx — Полноэкранный Hero с Кремлём и Москвой
   Стиль: Claude "creator skill" — full viewport hero
   ═══════════════════════════════════════════════════════════ */

export default function Header() {
  return (
    <div className="hero">
      {/* Фото Москвы */}
      <div className="hero-bg" />

      {/* Градиент overlay */}
      <div className="hero-overlay" />

      {/* Контент */}
      <div className="hero-content">
        <div className="hero-badge">Классификатор городской среды · v9</div>
        <h1 className="hero-title">Орбиты городской среды</h1>
        <p className="hero-sub">Москва · 7 категорий ядер × 6 орбит<br />Полный перечень объектов общественных пространств</p>
        <div className="hero-scroll-hint">
          <span>↓</span>
        </div>
      </div>
    </div>
  )
}
