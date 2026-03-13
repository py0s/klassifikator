/* ════════════════════════════════════════════════════
   LucideIcon.tsx — Динамический рендер иконки по имени
   Использует lucide-react, поддерживает size и color
   ════════════════════════════════════════════════════ */

import * as LucideIcons from 'lucide-react'
import type { LucideProps } from 'lucide-react'

interface Props extends LucideProps {
  name: string
}

export default function LucideIcon({ name, ...rest }: Props) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>)[name]
  if (!Icon) return null
  return <Icon {...rest} />
}
