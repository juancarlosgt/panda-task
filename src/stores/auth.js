import { defineStore } from 'pinia'
import { authService } from '../services/auth.js'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('authToken'),
    isLoading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user
  },

  actions: {
    async login(credentials) {
      this.isLoading = true
      this.error = null
      
      try {
        const data = await authService.login(credentials)
        this.token = data.token
        this.user = data.user
        
        // Guardar en localStorage
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('userData', JSON.stringify(data.user))
        
        return data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async register(userData) {
      this.isLoading = true
      this.error = null
      
      try {
        const data = await authService.register(userData)
        this.token = data.token
        this.user = data.user
        
        // Guardar en localStorage
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('userData', JSON.stringify(data.user))
        
        return data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.token = null
      this.user = null
      authService.logout()
    },

    initializeAuth() {
      const token = localStorage.getItem('authToken')
      const userData = localStorage.getItem('userData')
      
      if (token && userData) {
        // Verificar si el token no ha expirado
        try {
          const decodedToken = jwtDecode(token)
          const currentTime = Date.now() / 1000
          
          if (decodedToken.exp < currentTime) {
            // Token expirado
            this.logout()
            return
          }
          
          this.token = token
          this.user = JSON.parse(userData)
        } catch (error) {
          console.error('Error decoding token:', error)
          this.logout()
        }
      }
    },

    clearError() {
      this.error = null
    }
  }
})