<template>
  <aside 
    class="bg-indigo-200 border-r border-blue-200 transition-all duration-300 ease-in-out"
    :class="isCollapsed ? 'w-16' : 'w-64'"
  >
    <div class="flex flex-col h-full">
      <!-- Logo Section -->
      <div class="flex items-center justify-between p-4 border-b border-indigo-500">
        <div class="flex items-center space-x-3">
          <img src="../../assets/panda.svg" alt="Logo" class="h-8">
          <h1 
            v-if="!isCollapsed" 
            class="text-xl font-bold text-gray-800"
          >
            Panda Task
          </h1>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4">
        <!-- Projects Section -->
        <div class="mb-6">
          <button
            @click="toggleProjects"
            class="flex items-center w-full p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span v-if="!isCollapsed" class="ml-3 font-medium">Projects</span>
            <svg 
              v-if="!isCollapsed"
              class="w-4 h-4 ml-auto transition-transform duration-200"
              :class="{ 'rotate-180': isProjectsOpen }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Loading State -->
          <div v-if="isLoading && !isCollapsed" class="mt-2 ml-8">
            <div class="flex items-center p-2">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
              <span class="ml-2 text-sm text-gray-500">Cargando...</span>
            </div>
          </div>

          <!-- Projects Dropdown -->
          <div 
            v-else-if="!isCollapsed && isProjectsOpen"
            class="mt-2 ml-8 space-y-1"
          >
            <!-- Projects List -->
            <div 
              v-for="project in projects" 
              :key="project.id"
              @click="selectProject(project)"
              class="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200"
              :class="{ 'bg-gray-100': currentProject?.id === project.id }"
            >
              <span class="ml-2 text-sm font-medium">{{ project.name }}</span>
            </div>

            <!-- Empty State -->
            <div 
              v-if="projects.length === 0 && !isLoading"
              class="p-2 text-center text-gray-500 text-sm"
            >
              No hay proyectos
            </div>
            
            <!-- Add Project Button -->
            <button 
              @click="openCreateProjectModal"
              class="flex items-center p-2 text-gray-500 hover:text-indigo-600 transition-colors duration-200 w-full"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="ml-2 text-sm">Add Project</span>
            </button>
          </div>
        </div>
      </nav>
    </div>

    <!-- Create Project Modal -->
    <div 
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeCreateProjectModal"
    >
      <div 
        class="bg-white rounded-lg p-6 w-96"
        @click.stop
      >
        <h3 class="text-lg font-semibold mb-4">Crear Nuevo Proyecto</h3>
        
        <form @submit.prevent="createProject">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Proyecto
            </label>
            <input
              v-model="newProjectName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ingresa el nombre del proyecto"
            />
            <label class="block text-sm font-medium text-gray-700 mb-2 mt-1">
              Descripción (opcional)
            </label>
            <input
              v-model="newDescription"
              type="textarea"              
              class="w-full px-3 py-2  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ingresa la descripcion del proyecto"
            />
          </div>
          
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="closeCreateProjectModal"
              class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="!newProjectName.trim() || isCreating"
              class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isCreating">Creando...</span>
              <span v-else>Crear Proyecto</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </aside>
</template>

<script>
import { useProjectsStore } from '../../stores/projects'

export default {
  name: 'AppSidebar',
  props: {
    isCollapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isProjectsOpen: true,
      showCreateModal: false,
      newProjectName: '',
      newDescription: '',
      isCreating: false
    }
  },
  setup() {
    const projectsStore = useProjectsStore()
    return { projectsStore }
  },
  computed: {
    projects() {
      return this.projectsStore.getProjects
    },
    currentProject() {
      return this.projectsStore.getCurrentProject
    },
    isLoading() {
      return this.projectsStore.isLoading
    }
  },
  methods: {
    toggleProjects() {
      if (!this.isCollapsed) {
        this.isProjectsOpen = !this.isProjectsOpen
      }
    },

    async selectProject(project) {
      this.projectsStore.setCurrentProject(project)
      this.$emit('project-selected', project)
    },

    openCreateProjectModal() {
      this.showCreateModal = true
      this.newProjectName = ''
      this.newDescription = ''
    },

    closeCreateProjectModal() {
      this.showCreateModal = false
      this.newProjectName = ''
      this.isCreating = false
    },

    async createProject() {
      if (!this.newProjectName.trim()) return

      this.isCreating = true
      try {
        await this.projectsStore.createProject({
          name: this.newProjectName.trim()
            , description: this.newDescription.trim()
        })
        this.closeCreateProjectModal()
      } catch (error) {
        console.error('Error creating project:', error)
      } finally {
        this.isCreating = false
      }
    },

    async loadProjects() {
      try {
        await this.projectsStore.fetchProjects()
      } catch (error) {
        console.error('Error loading projects:', error)
      }
    }
  },
  watch: {
    isCollapsed(newVal) {
      if (newVal) {
        this.isProjectsOpen = false
      } else {
        this.isProjectsOpen = true
      }
    }
  },
  mounted() {
    this.loadProjects()
  },
  emits: ['project-selected']
}
</script>