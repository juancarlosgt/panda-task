<template>
  <DashboardLayout>
    <div class="h-full">
      <!-- Vista de Proyecto Seleccionado -->
      <ProjectBoard 
        v-if="currentProjectId" 
        :project-id="currentProjectId" 
      />
      
      <!-- Vista de Dashboard (sin proyecto seleccionado) -->
      <div v-else class="max-w-7xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Bienvenido al Dashboard</h1>
        
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <p class="text-gray-600">
            Selecciona un proyecto del sidebar para comenzar a gestionar tus tareas.
          </p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from '../components/dashboard/DashboardLayout.vue'
import ProjectBoard from '../components/dashboard/ProjectBoard.vue'
import { useProjectsStore } from '../stores/projects'

export default {
  name: 'DashboardView',
  components: {
    DashboardLayout,
    ProjectBoard
  },
  setup() {
    const projectsStore = useProjectsStore()
    return { projectsStore }
  },
  computed: {
    currentProjectId() {
      return this.projectsStore.getCurrentProject?.id || null
    }
  },
  mounted() {
    // Limpiar proyecto actual al cargar el dashboard
    this.projectsStore.clearCurrentProject()
  }
}
</script>