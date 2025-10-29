<template>
  <header class="bg-white border-b border-gray-200">
    <div class="flex items-center justify-between px-6 py-4">
      <!-- Left Section -->
      <div class="flex items-center space-x-4">
        <!-- Hamburger Menu Button -->
        <button
          @click="$emit('toggle-sidebar')"
          class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Breadcrumb or Page Title -->
        <div class="text-gray-900 font-medium">
          Dashboard
        </div>
      </div>

      <!-- Right Section -->
      <div class="flex items-center space-x-4">
        <!-- User Menu -->
        <div class="relative">
          <button
            @click="toggleUserMenu"
            class="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span class="text-indigo-600 text-sm font-medium">
                {{ userInitials }}
              </span>
            </div>
            <span class="text-sm font-medium">{{ userName }}</span>
          </button>

          <!-- User Dropdown Menu -->
          <div
            v-if="isUserMenuOpen"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          >
            <button
              @click="logout"
              class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { useAuthStore } from '../../stores/auth'

export default {
  name: 'AppHeader',
  emits: ['toggle-sidebar'],
  data() {
    return {
      isUserMenuOpen: false
    }
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  computed: {
    userName() {
      return this.authStore.user?.name || 'Usuario'
    },
    userInitials() {
      return this.userName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
  },
  methods: {
    toggleUserMenu() {
      this.isUserMenuOpen = !this.isUserMenuOpen
    },
    logout() {
      this.authStore.logout()
      this.$router.push('/')
    },
    closeUserMenu() {
      this.isUserMenuOpen = false
    }
  },
  mounted() {
    // Cerrar el menú al hacer clic fuera
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>