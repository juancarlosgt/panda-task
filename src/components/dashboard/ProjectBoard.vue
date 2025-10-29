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
            <div v-for="column in getColumns()" :key="column.id"
                class="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4 transition-colors duration-200"
                :class="{ 'drag-over': draggedTask && sourceColumn?.id !== column.id }" @dragover="onDragOver"
                @drop="onDrop(column, projectId)">
                <!-- Header de Columna -->
                <div class="flex items-center justify-between mb-4 group">
                    <h3 class="font-semibold text-gray-800 truncate overflow-hidden whitespace-nowrap">{{ column.title
                    }}</h3>
                    <div class="flex items-center space-x-2">
                        <span class="text-sm text-gray-500 bg-white px-2 py-1 rounded">
                            {{ getTaskCount(column) }}
                        </span>
                        <button @click.stop="openColumnMenu(column, $event)"
                            class="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Lista de Tareas -->
                <div class="space-y-3 min-h-20" @dragover="onDragOver">
                    <div v-for="task in getTasks(column)" :key="task.id" draggable="true"
                        @dragstart="onDragStart(task, column)" @dragend="draggedTask = null"
                        class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
                        :class="{ 'opacity-50': draggedTask?.id === task.id }">
                        <div class="flex items-start justify-between">
                            <div class="flex-1  w-full" @click="openTaskModal(task)">
                                <h4 class="font-medium text-gray-900 mb-2 truncate overflow-hidden whitespace-nowrap">
                                    {{ task.title }}</h4>
                                <p v-if="task.description"
                                    class="text-sm text-gray-600 mb-3 truncate overflow-hidden whitespace-nowrap">
                                    {{ task.description }}
                                </p>
                                <div class="flex items-center justify-between text-xs text-gray-500">
                                    <span>+2d...</span>
                                </div>
                            </div>

                            <!-- Menú de 3 puntos para tarea -->
                            <button @click.stop="openTaskMenu(task, column, $event)"
                                class="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 flex-shrink-0">
                                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Botón para agregar tarea -->
                <button @click="openCreateTaskModal(column)"
                    class="w-full mt-3 p-2 text-gray-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Task</span>
                </button>
            </div>

            <!-- Botón para agregar nueva columna -->
            <div class="flex-shrink-0 w-80">
                <button @click="openCreateColumnModal"
                    class="w-full h-full min-h-32 bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-200">
                    <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span class="font-medium">Add Column</span>
                </button>
            </div>
        </div>

        <!-- Modal para crear columna -->
        <div v-if="showCreateColumnModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            @click="closeCreateColumnModal">
            <div class="bg-white rounded-lg p-6 w-96" @click.stop>
                <h3 class="text-lg font-semibold mb-4">Crear Nueva Columna</h3>

                <form @submit.prevent="createColumn">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Título de la Columna
                        </label>
                        <input v-model="newColumnTitle" type="text" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ingresa el título de la columna" />
                    </div>

                    <div class="flex justify-end space-x-3">
                        <button type="button" @click="closeCreateColumnModal"
                            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200">
                            Cancelar
                        </button>
                        <button type="submit" :disabled="!newColumnTitle.trim() || isCreatingColumn"
                            class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                            <span v-if="isCreatingColumn">Creando...</span>
                            <span v-else>Crear Columna</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal para crear tarea -->
        <div v-if="showCreateTaskModal && selectedColumn"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            @click="closeCreateTaskModal">
            <div class="bg-white rounded-lg p-6 w-96" @click.stop>
                <h3 class="text-lg font-semibold mb-4">Crear Nueva Tarea</h3>

                <form @submit.prevent="createTask">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Título de la Tarea
                        </label>
                        <input v-model="newTaskTitle" type="text" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ingresa el título de la tarea" />
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Descripción (Opcional)
                        </label>
                        <textarea v-model="newTaskDescription" rows="3"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ingresa la descripción de la tarea"></textarea>
                    </div>

                    <div class="flex justify-end space-x-3">
                        <button type="button" @click="closeCreateTaskModal"
                            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200">
                            Cancelar
                        </button>
                        <button type="submit" :disabled="!newTaskTitle.trim() || isCreatingTask"
                            class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                            <span v-if="isCreatingTask">Creando...</span>
                            <span v-else>Crear Tarea</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal para ver/editar tarea -->
        <div v-if="showTaskModal && selectedTask"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeTaskModal">
            <div class="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto" @click.stop>
                <h3 class="text-lg font-semibold mb-2">{{ selectedTask.title }}</h3>

                <div v-if="selectedTask.description" class="mb-4">
                    <p class="text-gray-600">{{ selectedTask.description }}</p>
                </div>

                <div class="text-xs text-gray-500 mb-4">
                    <p>Creado: {{ formatDate(selectedTask.created_at) }}</p>
                    <p>Actualizado: {{ formatDate(selectedTask.updated_at) }}</p>
                </div>

                <div class="flex justify-end space-x-3">
                    <button @click="closeTaskModal"
                        class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
        <!-- Modal para editar columna -->
        <div v-if="showEditColumnModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            @click="closeEditColumnModal">
            <div class="bg-white rounded-lg p-6 w-96" @click.stop>
                <h3 class="text-lg font-semibold mb-4">Editar Columna</h3>

                <form @submit.prevent="updateColumn">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Título de la Columna
                        </label>
                        <input v-model="editColumnTitle" type="text" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ingresa el título de la columna" />
                    </div>

                    <div class="flex justify-end space-x-3">
                        <button type="button" @click="closeEditColumnModal"
                            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200">
                            Cancelar
                        </button>
                        <button type="submit" :disabled="!editColumnTitle.trim() || isUpdatingColumn"
                            class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                            <span v-if="isUpdatingColumn">Actualizando...</span>
                            <span v-else>Actualizar Columna</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <!-- Modal para editar tarea -->
        <div v-if="showEditTaskModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            @click="closeEditTaskModal">
            <div class="bg-white rounded-lg p-6 w-96" @click.stop>
                <h3 class="text-lg font-semibold mb-4">Editar Tarea</h3>

                <form @submit.prevent="updateTask">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Título de la Tarea
                        </label>
                        <input v-model="editTaskTitle" type="text" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ingresa el título de la tarea" />
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Descripción (Opcional)
                        </label>
                        <textarea v-model="editTaskDescription" rows="3"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ingresa la descripción de la tarea"></textarea>
                    </div>

                    <div class="flex justify-end space-x-3">
                        <button type="button" @click="closeEditTaskModal"
                            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200">
                            Cancelar
                        </button>
                        <button type="submit" :disabled="!editTaskTitle.trim() || isUpdatingTask"
                            class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                            <span v-if="isUpdatingTask">Actualizando...</span>
                            <span v-else>Actualizar Tarea</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <div v-if="showTaskMenu" class="fixed inset-0 z-50" @click="closeTaskMenu">
            <div :style="taskMenuPosition"
                class="absolute bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-48 z-50">
                <button @click="editTask"
                    class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar Tarea
                </button>
                <button @click="deleteTask"
                    class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar Tarea
                </button>
            </div>
        </div>
        <div v-if="showColumnMenu" class="fixed inset-0 z-50" @click="closeColumnMenu">
            <div :style="columnMenuPosition"
                class="absolute bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-48 z-50">
                <button @click="editColumn"
                    class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar Columna
                </button>
                <button @click="deleteColumn"
                    class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar Columna
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { useProjectsStore } from '../../stores/projects'
import { useDragAndDrop } from '../../composables/useDragAndDrop'

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
            selectedTask: null,
            showColumnMenu: false,
            selectedColumn: null,
            columnMenuPosition: { top: '0px', left: '0px' },
            showEditColumnModal: false,
            editColumnTitle: '',
            isUpdatingColumn: false,
            isDeletingColumn: false,
            showTaskMenu: false,
            selectedTask: null,
            selectedTaskColumn: null,
            taskMenuPosition: { top: '0px', left: '0px' },
            showEditTaskModal: false,
            editTaskTitle: '',
            editTaskDescription: '',
            isUpdatingTask: false,
            isDeletingTask: false
        }
    },
    setup() {
        const projectsStore = useProjectsStore()
        const {
            draggedTask,
            sourceColumn,
            onDragStart,
            onDragOver,
            onDrop
        } = useDragAndDrop()

        return {
            projectsStore,
            draggedTask,
            sourceColumn,
            onDragStart,
            onDragOver,
            onDrop
        }
    },
    computed: {
        project() {
            return this.projectsStore.getCurrentProject
        }
    },
    methods: {
        openTaskMenu(task, column, event) {
            this.selectedTask = task
            this.selectedTaskColumn = column
            this.taskMenuPosition = {
                top: `${event.clientY}px`,
                left: `${event.clientX}px`
            }
            this.showTaskMenu = true
        },

        closeTaskMenu() {
            this.showTaskMenu = false
            //this.selectedTask = null
            //this.selectedTaskColumn = null
        },

        editTask() {
            this.showEditTaskModal = true
            this.editTaskTitle = this.selectedTask.title
            this.editTaskDescription = this.selectedTask.description || ''
            this.closeTaskMenu()
        },

        async updateTask() {
            if (!this.editTaskTitle.trim() || !this.selectedTask || !this.selectedTaskColumn) {
                console.log(this.editTaskTitle.trim(), this.selectedTask, this.selectedTaskColumn)
                return
            }

            this.isUpdatingTask = true
            try {
                await this.projectsStore.updateTask(
                    this.projectId,
                    this.selectedTaskColumn.id,
                    this.selectedTask.id,
                    {
                        title: this.editTaskTitle.trim(),
                        description: this.editTaskDescription.trim() || null
                    }
                )
                this.closeEditTaskModal()
            } catch (error) {
                console.error('Error updating task:', error)
            } finally {
                this.isUpdatingTask = false
            }
        },

        async deleteTask() {
            if (!this.selectedTask || !this.selectedTaskColumn) return

            if (!confirm(`¿Estás seguro de que quieres eliminar la tarea "${this.selectedTask.title}"?`)) {
                this.closeTaskMenu()
                return
            }

            this.isDeletingTask = true
            try {
                await this.projectsStore.deleteTask(
                    this.projectId,
                    this.selectedTaskColumn.id,
                    this.selectedTask.id
                )
                this.closeTaskMenu()
            } catch (error) {
                console.error('Error deleting task:', error)
            } finally {
                this.isDeletingTask = false
            }
        },

        closeEditTaskModal() {
            this.showEditTaskModal = false
            this.selectedTask = null
            this.selectedTaskColumn = null
            this.editTaskTitle = ''
            this.editTaskDescription = ''
        },
        openColumnMenu(column, event) {
            this.selectedColumn = column
            this.columnMenuPosition = {
                top: `${event.clientY}px`,
                left: `${event.clientX}px`
            }
            this.showColumnMenu = true
        },

        closeColumnMenu() {
            this.showColumnMenu = false
        },

        editColumn() {
            this.showEditColumnModal = true
            this.editColumnTitle = this.selectedColumn.title
            this.closeColumnMenu()
        },

        async updateColumn() {
            if (!this.editColumnTitle.trim() || !this.selectedColumn) return

            this.isUpdatingColumn = true
            try {
                await this.projectsStore.updateColumn(
                    this.projectId,
                    this.selectedColumn.id,
                    { title: this.editColumnTitle.trim() }
                )
                this.closeEditColumnModal()
            } catch (error) {
                console.error('Error updating column:', error)
            } finally {
                this.isUpdatingColumn = false
            }
        },

        async deleteColumn() {
            if (!this.selectedColumn) return

            if (!confirm(`¿Estás seguro de que quieres eliminar la columna "${this.selectedColumn.title}"? Todas las tareas dentro también se eliminarán.`)) {
                this.closeColumnMenu()
                return
            }

            this.isDeletingColumn = true
            try {
                await this.projectsStore.deleteColumn(this.projectId, this.selectedColumn.id)
                this.closeColumnMenu()
            } catch (error) {
                console.error('Error deleting column:', error)
            } finally {
                this.isDeletingColumn = false
            }
        },

        closeEditColumnModal() {
            this.showEditColumnModal = false
            this.selectedColumn = null
            this.editColumnTitle = ''
        },
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

<style scoped>
.drag-over {
    background-color: #f0f9ff;
    border-color: #3b82f6;
}

.dragging {
    cursor: grabbing;
    transform: rotate(5deg);
}
</style>