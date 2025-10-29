import { defineStore } from 'pinia'
import { projectsService } from '../services/projects.js'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [],
    currentProject: null,
    isLoading: false,
    error: null
  }),

  getters: {
    getProjects: (state) => state.projects,
    getCurrentProject: (state) => state.currentProject,
    hasProjects: (state) => state.projects.length > 0
  },

  actions: {
    async fetchProjects() {
      this.isLoading = true
      this.error = null

      try {
        const projects = await projectsService.getProjects()
        this.projects = projects
        return projects
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createProject(projectData) {
      try {
        const newProject = await projectsService.createProject(projectData)
        this.projects.push(newProject)
        return newProject
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async updateProject(projectId, projectData) {
      try {
        const updatedProject = await projectsService.updateProject(projectId, projectData)

        if (this.currentProject && this.currentProject.id === projectId) {
          const existingColumns = this.currentProject.columns || []
          this.currentProject = {
            ...updatedProject,
            columns: Array.isArray(updatedProject.columns) ? updatedProject.columns : existingColumns
          }
        }

        const index = this.projects.findIndex(p => p.id === projectId)
        if (index !== -1) {
          const existingColumnsInList = this.projects[index].columns || []
          this.projects[index] = {
            ...updatedProject,
            columns: Array.isArray(updatedProject.columns) ? updatedProject.columns : existingColumnsInList
          }
        }

        return updatedProject
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async deleteProject(projectId) {
      try {
        await projectsService.deleteProject(projectId)
        this.projects = this.projects.filter(p => p.id !== projectId)
        if (this.currentProject && this.currentProject.id === projectId) {
          this.currentProject = null
        }
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    async fetchProjectById(projectId) {
      this.isLoading = true
      this.error = null

      try {
        const project = await projectsService.getProjectById(projectId)
        this.currentProject = project
        return project
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createColumn(projectId, columnData) {
      try {
        const newColumn = await projectsService.createColumn(projectId, columnData)

        // Actualizar el proyecto actual si es el mismo
        if (this.currentProject && this.currentProject.id === projectId) {
          this.currentProject.columns.push(newColumn)
        }

        return newColumn
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    async updateColumn(projectId, columnId, columnData) {
      try {
        const updatedColumn = await projectsService.updateColumn(projectId, columnId, columnData)
        if (this.currentProject && this.currentProject.id === projectId) {
          const columnIndex = this.currentProject.columns.findIndex(col => col.id === columnId)
          if (columnIndex !== -1) {
            const existingTasks = this.currentProject.columns[columnIndex].tasks || []
            this.currentProject.columns[columnIndex] = {
              ...updatedColumn,
              tasks: updatedColumn.tasks || existingTasks
            }
          }
        }
        return updatedColumn
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async deleteColumn(projectId, columnId) {
      try {
        await projectsService.deleteColumn(projectId, columnId)
        if (this.currentProject && this.currentProject.id === projectId) {
          this.currentProject.columns = this.currentProject.columns.filter(col => col.id !== columnId)
        }
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    async createTask(projectId, columnId, taskData) {
      try {
        const newTask = await projectsService.createTask(projectId, columnId, taskData)

        if (this.currentProject && this.currentProject.id === projectId) {
          const column = this.currentProject.columns.find(col => col.id === columnId)
          if (column) {
            column.tasks.push(newTask)
          }
        }

        return newTask
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async updateTask(projectId, columnId, taskId, taskData) {
      try {
        const updatedTask = await projectsService.updateTask(projectId, columnId, taskId, taskData)

        if (this.currentProject && this.currentProject.id === projectId) {
          const column = this.currentProject.columns.find(col => col.id === columnId)
          if (column) {
            const taskIndex = column.tasks.findIndex(task => task.id === taskId)
            if (taskIndex !== -1) {
              column.tasks[taskIndex] = updatedTask
            }
          }
        }

        return updatedTask
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async deleteTask(projectId, columnId, taskId) {
      try {
        await projectsService.deleteTask(projectId, columnId, taskId)

        if (this.currentProject && this.currentProject.id === projectId) {
          const column = this.currentProject.columns.find(col => col.id === columnId)
          if (column) {
            column.tasks = column.tasks.filter(task => task.id !== taskId)
          }
        }
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    setCurrentProject(project) {
      this.currentProject = project
    },

    clearCurrentProject() {
      this.currentProject = null
    },

    clearError() {
      this.error = null
    }
  }
})