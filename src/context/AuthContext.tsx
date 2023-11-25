// AuthContext.tsx
import { ReactNode, createContext, useContext, useState } from 'react'

interface User {
  username: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const currentUser = localStorage.getItem('user')
  const [user, setUser] = useState<User | null>(
    currentUser ? { username: JSON.parse(currentUser).displayName, avatar: JSON.parse(currentUser).photoURL } : null
  )

  const login = (userData: User) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
  }

  const contextValue: AuthContextType = {
    user,
    login,
    logout
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
