import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar el token a las requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/login', credentials)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en el login')
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/register', userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en el registro')
    }
  },

  async logout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
  },

  async getProfile() {
    try {
      const response = await api.get('/auth/profile')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener perfil')
    }
  }
}

export default api