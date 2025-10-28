<template>
  <header class="bg-gray-50 shadow-md rounded-b-xl">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
            <router-link to="/">
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-2xl font-bold text-indigo-600">PandaTask</h1>
            <img src="../assets/panda.svg" alt="Logo" class="ml-2 h-8">
          </div></router-link>
        </div>

        <!-- Botón de navegación -->
        <div class="transition-transform transform hover:scale-110 duration-300">
          <router-link 
            v-if="!isAuthenticated"
            to="/login"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-200"
          >
            Iniciar Sesión
          </router-link>
          <router-link 
            v-else
            to="/dashboard"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-200"
          >
            Dashboard
          </router-link>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Header',
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