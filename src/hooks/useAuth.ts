import { useState, useEffect } from 'react'
import { blink } from '@/blink/client'
import { AuthUser, UserRole } from '@/types'

interface AuthState {
  user: AuthUser | null
  loading: boolean
}

interface StudioRegistrationData {
  studioName: string
  email: string
  password: string
  phone?: string
  address?: string
  description?: string
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true
  })

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (state.user) {
        // Check if user has a role preference stored in localStorage
        const storedRole = localStorage.getItem('userRole') as UserRole || 'studio'
        const storedStudioName = localStorage.getItem('studioName') || 'PhotoStudio Pro'
        
        const user: AuthUser = {
          id: state.user.id,
          email: state.user.email || 'demo@photostudio.com',
          role: storedRole,
          studioId: storedRole === 'studio' ? 'studio_' + state.user.id : localStorage.getItem('studioId') || 'studio_demo',
          teamMemberId: storedRole === 'team_member' ? 'member_' + state.user.id : undefined,
          studioName: storedStudioName
        }
        setAuthState({ user, loading: false })
      } else {
        setAuthState({ user: null, loading: false })
      }
    })

    return unsubscribe
  }, [])

  const login = () => {
    blink.auth.login()
  }

  const logout = () => {
    // Clear stored preferences
    localStorage.removeItem('userRole')
    localStorage.removeItem('studioName')
    localStorage.removeItem('studioId')
    blink.auth.logout()
  }

  const registerStudio = (data: StudioRegistrationData) => {
    // Store studio preferences
    localStorage.setItem('userRole', 'studio')
    localStorage.setItem('studioName', data.studioName)
    blink.auth.login()
  }

  const switchToTeamMember = (studioId: string, studioName: string) => {
    localStorage.setItem('userRole', 'team_member')
    localStorage.setItem('studioId', studioId)
    localStorage.setItem('studioName', studioName)
    // Trigger a re-render by updating auth state
    window.location.reload()
  }

  const switchToStudio = () => {
    localStorage.setItem('userRole', 'studio')
    localStorage.removeItem('studioId')
    window.location.reload()
  }

  return {
    ...authState,
    login,
    logout,
    registerStudio,
    switchToTeamMember,
    switchToStudio
  }
}