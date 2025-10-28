import { jwtDecode } from 'jwt-decode'

export const authUtils = {
  isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token)
      const currentTime = Date.now() / 1000
      return decoded.exp < currentTime
    } catch (error) {
      return true
    }
  },

  getUserFromToken(token) {
    try {
      return jwtDecode(token)
    } catch (error) {
      return null
    }
  }
}