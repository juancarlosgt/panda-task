<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-200 to-purple-100">
    <Header :is-authenticated="false" />
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Hero Section -->
      <div class="text-center">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Gestiona tus tareas con 
          <span class="text-indigo-600 wave-colors">PandaTask</span>
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          La aplicación de gestión de tareas más intuitiva y eficiente. 
          Organiza tu trabajo, establece prioridades y alcanza tus objetivos.
        </p>
        
        <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <router-link 
            v-if="!isAuthenticated" to="/login"
            class="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 transition-transform transform hover:scale-110 duration-300"
          >
            Comenzar Ahora
          </router-link>
          <router-link 
            v-else to="/dashboard"
            class="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 transition-transform transform hover:scale-110 duration-300"
          >
            Ir al Dashboard
          </router-link>
        </div>
      </div>

      <!-- Features Section -->
      <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-lg shadow-sm transition-transform transform hover:scale-110 duration-300">
          <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <span class="text-indigo-600 text-xl">📝</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Creación Rápida</h3>
          <p class="text-gray-600">Crea y organiza tus tareas en segundos con nuestra interfaz intuitiva.</p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm transition-transform transform hover:scale-110 duration-300">
          <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <span class="text-indigo-600 text-xl">⚙️</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Columnas Personalizables</h3>
          <p class="text-gray-600">Crea tus propias columnas para llevar seguimiento de tus tareas.</p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm transition-transform transform hover:scale-110 duration-300">
          <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <span class="text-indigo-600 text-xl">📊</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Seguimiento de Progreso</h3>
          <p class="text-gray-600">Visualiza tu avance y mantente motivado.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import { useAuthStore } from '../stores/auth'
export default {
  name: 'HomeView',
  components: {
    Header
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  computed: {
    isAuthenticated() {
      return this.authStore.isAuthenticated
    }
  }
}
</script>