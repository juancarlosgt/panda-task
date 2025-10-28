<template>
  <div class="max-w-md w-full space-y-8 ">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}
      </h2>
    </div>

    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div> 

    <!-- Formulario de Login -->
    <form v-if="isLogin" class="mt-8 space-y-6" @submit.prevent="handleLogin">
      <div class="rounded-md shadow-sm -space-y-px">
        <div class="mb-1">
          <label for="email" class="sr-only">Email</label>
          <input 
            v-model="loginForm.email"
            id="email" 
            name="email" 
            type="email" 
            autocomplete="email" 
            required 
            class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email"
          >
        </div>
        <div>
          <label for="password" class="sr-only">Contraseña</label>
          <input 
            v-model="loginForm.password"
            id="password" 
            name="password" 
            type="password" 
            autocomplete="current-password" 
            required 
            class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Contraseña"
          >
        </div>
      </div>

      <div>
        <button 
          type="submit" 
          :disabled="isLoading"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading">Cargando...</span>
          <span v-else>Iniciar Sesión</span>
        </button>
      </div>

      <div class="text-center">
        <button 
          type="button" 
          @click="toggleMode"
          class="text-indigo-600 hover:text-indigo-500 text-sm"
        >
          ¿No tienes cuenta? Regístrate
        </button>
      </div>
    </form>

    <!-- Formulario de Registro -->
    <form v-else class="mt-8 space-y-6" @submit.prevent="handleRegister">
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="name" class="sr-only">Nombre</label>
          <input 
            v-model="registerForm.name"
            id="name" 
            name="name" 
            type="text" 
            autocomplete="name" 
            required 
            class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Nombre completo"
          >
        </div>
        <div class="mt-1 mb-1">
          <label for="register-email" class="sr-only">Email</label>
          <input 
            v-model="registerForm.email"
            id="register-email" 
            name="email" 
            type="email" 
            autocomplete="email" 
            required 
            class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email"
          >
        </div>
        <div>
          <label for="register-password" class="sr-only">Contraseña</label>
          <input 
            v-model="registerForm.password"
            id="register-password" 
            name="password" 
            type="password" 
            autocomplete="new-password" 
            required 
            class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Contraseña"
          >
        </div>
      </div>

      <div>
        <button 
          type="submit" 
          :disabled="isLoading"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading">Cargando...</span>
          <span v-else>Registrarse</span>
        </button>
      </div>

      <div class="text-center">
        <button 
          type="button" 
          @click="toggleMode"
          class="text-indigo-600 hover:text-indigo-500 text-sm"
        >
          ¿Ya tienes cuenta? Inicia Sesión
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
  name: 'AuthForm',
  data() {
    return {
      isLogin: true,
      loginForm: {
        email: '',
        password: ''
      },
      registerForm: {
        name: '',
        email: '',
        password: ''
      }
    }
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  computed: {
    isLoading() {
      return this.authStore.isLoading
    },
    error() {
      return this.authStore.error
    }
  },
  methods: {
    toggleMode() {
      this.isLogin = !this.isLogin
      this.authStore.clearError()
    },
    async handleLogin() {
      try {
        await this.authStore.login(this.loginForm)
        // Redirigir al dashboard
        this.$router.push('/dashboard')
      } catch (error) {
        // El error ya está manejado en el store
        console.error('Login error:', error)
      }
    },
    async handleRegister() {
      try {
        await this.authStore.register(this.registerForm)
        // Redirigir al dashboard
        this.$router.push('/dashboard')
      } catch (error) {
        // El error ya está manejado en el store
        console.error('Register error:', error)
      }
    }
  }
}
</script>