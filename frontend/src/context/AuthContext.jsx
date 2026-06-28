/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import api from '../services/api'

const AuthContext = createContext(null)

const TOKEN_KEY = 'exam_auth_token'
const USER_KEY = 'exam_auth_user'

const getStoredUser = () => {
  const value = localStorage.getItem(USER_KEY)

  if (!value) {
    return null
  }

  try {
    return JSON.parse(value)
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(getStoredUser)
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)))

  const saveSession = (nextToken, nextUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setToken(nextToken)
    setUser(nextUser)
  }

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }

  useEffect(() => {
    const loadMe = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await api.get('/api/auth/me')
        const nextUser = response.data.user
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
        setUser(nextUser)
      } catch {
        clearSession()
      } finally {
        setLoading(false)
      }
    }

    loadMe()
  }, [token])

  const login = async (credentials) => {
    const response = await api.post('/api/auth/login', credentials)
    saveSession(response.data.token, response.data.user)
    return response.data.user
  }

  const register = async (payload) => {
    const response = await api.post('/api/auth/register', payload)
    saveSession(response.data.token, response.data.user)
    return response.data.user
  }

  const logout = () => {
    clearSession()
  }

  const value = {
    token,
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: Boolean(token),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}