import api from './auth.js'

export const projectsService = {
  async getProjects() {
    try {
      const response = await api.get('/projects')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener proyectos')
    }
  },

  async createProject(projectData) {
    try {
      const response = await api.post('/projects', projectData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear proyecto')
    }
  },

  async updateProject(projectId, projectData) {
    try {
      const response = await api.put(`/projects/${projectId}`, projectData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar proyecto')
    }
  },

  async deleteProject(projectId) {
    try {
      const response = await api.delete(`/projects/${projectId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar proyecto')
    }
  },

  async getProjectById(projectId) {
    try {
      const response = await api.get(`/projects/${projectId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener el proyecto')
    }
  },

  async createColumn(projectId, columnData) {
    try {
      const response = await api.post(`/projects/${projectId}/columns`, columnData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear columna')
    }
  },

  async createTask(projectId, columnId, taskData) {
    try {
      const response = await api.post(`/projects/${projectId}/columns/${columnId}/tasks`, taskData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear tarea')
    }
  },

  async updateTask(projectId, columnId, taskId, taskData) {
    try {
      const response = await api.put(`/projects/${projectId}/columns/${columnId}/tasks/${taskId}`, taskData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar tarea')
    }
  },

  async deleteTask(projectId, columnId, taskId) {
    try {
      const response = await api.delete(`/projects/${projectId}/columns/${columnId}/tasks/${taskId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar tarea')
    }
  }
}