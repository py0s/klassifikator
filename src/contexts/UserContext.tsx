/* ═══════════════════════════════════════════════════════════
   UserContext.tsx — Контекст пользователя (ФИО + Должность)
   Данные сохраняются в localStorage
   ═══════════════════════════════════════════════════════════ */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface UserProfile {
  name: string   // Полное ФИО
  role: string   // Должность
}

interface UserContextValue {
  user: UserProfile
  setUser: (u: UserProfile) => void
  abbr: string   // «Иванов И.И. · Нач. отдела»
  isSet: boolean // true если ФИО уже заполнено
}

const STORAGE_KEY = 'clf_user_profile'

const UserContext = createContext<UserContextValue>({
  user: { name: '', role: '' },
  setUser: () => {},
  abbr: '',
  isSet: false,
})

function makeAbbr(name: string, role: string): string {
  if (!name) return ''
  // «Иванов Иван Иванович» → «Иванов И.И.»
  const parts = name.trim().split(/\s+/)
  let abbr = parts[0] // фамилия
  if (parts[1]) abbr += ' ' + parts[1][0] + '.'
  if (parts[2]) abbr += parts[2][0] + '.'
  if (role) abbr += ' · ' + role
  return abbr
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : { name: '', role: '' }
    } catch {
      return { name: '', role: '' }
    }
  })

  const setUser = (u: UserProfile) => {
    setUserState(u)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
  }

  const abbr = makeAbbr(user.name, user.role)
  const isSet = !!user.name.trim()

  return (
    <UserContext.Provider value={{ user, setUser, abbr, isSet }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
