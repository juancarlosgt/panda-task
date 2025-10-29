<template>
  <div class="h-full">
    <!-- Header del Proyecto -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ project.name }}</h1>
      <p class="text-gray-600 mt-1">{{ project.description }}</p>
    </div>

    <!-- Board de Columnas -->
    <div class="flex space-x-6 overflow-x-auto pb-6">
      <!-- Columnas existentes -->
      <div 
        v-for="column in getColumns()"
        :key="column.id"
        class="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4"
      >
        <!-- Header de Columna -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-800">{{ column.title }}</h3>
          <span class="text-sm text-gray-500 bg-white px-2 py-1 rounded">
            {{ getTaskCount(column) }}
          </span>
        </div>

        <!-- Lista de Tareas -->
        <div class="space-y-3 min-h-20">
          <div 
            v-for="task in getTasks(column)" 
            :key="task.id"
            class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            @click="openTaskModal(task)"
          >
            <h4 class="font-medium text-gray-900 mb-2">{{ task.title }}</h4>
            <p v-if="task.description" class="text-sm text-gray-600 mb-3">
              {{ task.description }}
            </p>
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>+2d...</span>
            </div>
          </div>
        </div>

        <!-- Botón para agregar tarea -->
        <button
          @click="openCreateTaskModal(column)"
          class="w-full mt-3 p-2 text-gray-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Task</span>
        </button>
      </div>

      <!-- Botón para agregar nueva columna -->
      <div class="flex-shrink-0 w-80">
        <button
          @click="openCreateColumnModal"
          class="w-full h-full min-h-32 bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="font-medium">Add Column</span>
        </button>
      </div>
    </div>

    <!-- Modal para crear columna -->
    <div 
      v-if="showCreateColumnModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeCreateColumnModal"
    >
      <div 
        class="bg-white rounded-lg p-6 w-96"
        @click.stop
      >
        <h3 class="text-lg font-semibold mb-4">Crear Nueva Columna</h3>
        
        <form @submit.prevent="createColumn">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Título de la Columna
            </label>
            <input
              v-model="newColumnTitle"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ingresa el título de la columna"
            />
          </div>
          
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="closeCreateColumnModal"
              class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="!newColumnTitle.trim() || isCreatingColumn"
              class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isCreatingColumn">Creando...</span>
              <span v-else>Crear Columna</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para crear tarea -->
    <div 
      v-if="showCreateTaskModal && selectedColumn"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeCreateTaskModal"
    >
      <div 
        class="bg-white rounded-lg p-6 w-96"
        @click.stop
      >
        <h3 class="text-lg font-semibold mb-4">Crear Nueva Tarea</h3>
        
        <form @submit.prevent="createTask">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Título de la Tarea
            </label>
            <input
              v-model="newTaskTitle"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ingresa el título de la tarea"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Descripción (Opcional)
            </label>
            <textarea
              v-model="newTaskDescription"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ingresa la descripción de la tarea"
            ></textarea>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="closeCreateTaskModal"
              class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="!newTaskTitle.trim() || isCreatingTask"
              class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isCreatingTask">Creando...</span>
              <span v-else>Crear Tarea</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para ver/editar tarea -->
    <div 
      v-if="showTaskModal && selectedTask"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeTaskModal"
    >
      <div 
        class="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto"
        @click.stop
      >
        <h3 class="text-lg font-semibold mb-2">{{ selectedTask.title }}</h3>
        
        <div v-if="selectedTask.description" class="mb-4">
          <p class="text-gray-600">{{ selectedTask.description }}</p>
        </div>

        <div class="text-xs text-gray-500 mb-4">
          <p>Creado: {{ formatDate(selectedTask.created_at) }}</p>
          <p>Actualizado: {{ formatDate(selectedTask.updated_at) }}</p>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="closeTaskModal"
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useProjectsStore } from '../../stores/projects'

export default {
  name: 'ProjectBoard',
  props: {
    projectId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      showCreateColumnModal: false,
      showCreateTaskModal: false,
      showTaskModal: false,
      newColumnTitle: '',
      newTaskTitle: '',
      newTaskDescription: '',
      isCreatingColumn: false,
      isCreatingTask: false,
      selectedColumn: null,
      selectedTask: null
    }
  },
  setup() {
    const projectsStore = useProjectsStore()
    return { projectsStore }
  },
  computed: {
    project() {
      return this.projectsStore.getCurrentProject
    }
  },
  methods: {
    getTasks(column) {
      return Array.isArray(column.tasks) ? column.tasks : []
    },

    getTaskCount(column) {
      return this.getTasks(column).length
    },

    getColumns() {
    if (!this.project || !this.project.columns) {
        return []
    }
    return Array.isArray(this.project.columns) ? this.project.columns : []
    },
    
    openCreateColumnModal() {
      this.showCreateColumnModal = true
      this.newColumnTitle = ''
    },

    closeCreateColumnModal() {
      this.showCreateColumnModal = false
      this.newColumnTitle = ''
      this.isCreatingColumn = false
    },

    async createColumn() {
      if (!this.newColumnTitle.trim()) return

      this.isCreatingColumn = true
      try {
        await this.projectsStore.createColumn(this.projectId, {
          title: this.newColumnTitle.trim()
        })
        this.closeCreateColumnModal()
      } catch (error) {
        console.error('Error creating column:', error)
      } finally {
        this.isCreatingColumn = false
      }
    },

    openCreateTaskModal(column) {
      this.selectedColumn = column
      this.showCreateTaskModal = true
      this.newTaskTitle = ''
      this.newTaskDescription = ''
    },

    closeCreateTaskModal() {
      this.showCreateTaskModal = false
      this.selectedColumn = null
      this.newTaskTitle = ''
      this.newTaskDescription = ''
      this.isCreatingTask = false
    },

    async createTask() {
      if (!this.newTaskTitle.trim() || !this.selectedColumn) return

      this.isCreatingTask = true
      try {
        await this.projectsStore.createTask(
          this.projectId, 
          this.selectedColumn.id, 
          {
            title: this.newTaskTitle.trim(),
            description: this.newTaskDescription.trim() || null
          }
        )
        this.closeCreateTaskModal()
      } catch (error) {
        console.error('Error creating task:', error)
      } finally {
        this.isCreatingTask = false
      }
    },

    openTaskModal(task) {
      this.selectedTask = task
      this.showTaskModal = true
    },

    closeTaskModal() {
      this.showTaskModal = false
      this.selectedTask = null
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  },
  async mounted() {
    try {
      await this.projectsStore.fetchProjectById(this.projectId)
    } catch (error) {
      console.error('Error loading project:', error)
    }
  },
  watch: {
    projectId: {
      immediate: true,
      handler(newProjectId) {
        if (newProjectId) {
          this.projectsStore.fetchProjectById(newProjectId)
        }
      }
    }
  }
}
</script>