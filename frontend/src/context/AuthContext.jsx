import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Decode JWT payload without installing another library
  const parseToken = (token) => {
    try {
      const base64Payload = token.split('.')[1]
      const payload = atob(base64Payload)

      return JSON.parse(payload)
    } catch {
      return null
    }
  }

  const clearSession = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      setLoading(false)
      return
    }

    const payload = parseToken(token)

    if (!payload || payload.exp * 1000 < Date.now()) {
      const refresh = localStorage.getItem('refresh_token')

      if (!refresh) {
        clearSession()
        setLoading(false)
        return
      }

      try {
        const { data } = await api.post('/auth/token/refresh/', {
          refresh,
        })

        localStorage.setItem('access_token', data.access)
      } catch {
        clearSession()
        setLoading(false)
        return
      }
    }

    try {
      const { data } = await api.get('/users/profile/')
      setUser(data)
    } catch {
      clearSession()
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const login = async (username, password) => {
    const { data } = await api.post('/users/login/', {
      username,
      password,
    })

    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)

    const profile = await api.get('/users/profile/')
    setUser(profile.data)

    return profile.data
  }

  const register = async (payload) => {
    const { data } = await api.post('/users/register/', payload)

    return data
  }

  const logout = () => {
    clearSession()
  }

  const updateUser = (updates) => {
    setUser((prev) => ({
      ...prev,
      ...updates,
    }))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return ctx
}