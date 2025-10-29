<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <AppSidebar 
      :is-collapsed="isSidebarCollapsed" 
      @toggle-sidebar="toggleSidebar"
      

    />
    
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <AppHeader 
        @toggle-sidebar="toggleSidebar"
      />
      
      <!-- Page Content -->
      <main class="flex-1 overflow-auto p-6">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script>
import AppSidebar from './AppSideBar.vue'
import AppHeader from './AppHeader.vue'

export default {
  name: 'DashboardLayout',
  components: {
    AppSidebar,
    AppHeader
  },
  data() {
    return {
      isSidebarCollapsed: false
    }
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
    }
  }
}
</script>