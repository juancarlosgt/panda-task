import { ref } from 'vue'
import { useProjectsStore } from '../stores/projects'

export function useDragAndDrop() {
  const projectsStore = useProjectsStore()
  const draggedTask = ref(null)
  const sourceColumn = ref(null)

  const onDragStart = (task, column) => {
    draggedTask.value = task
    sourceColumn.value = column
  }

  const onDragOver = (event) => {
    event.preventDefault()
  }

  const onDrop = async (targetColumn, projectId) => {
    if (!draggedTask.value || !sourceColumn.value || sourceColumn.value.id === targetColumn.id) {
      return
    }

    try {
      // Actualizar la tarea con la nueva columna
      await projectsStore.updateTask(
        projectId,
        sourceColumn.value.id,
        draggedTask.value.id,
        {
          new_column_id: targetColumn.id
        }
      )

      // El store ya debería actualizar la vista automáticamente
    } catch (error) {
      console.error('Error moving task:', error)
      // Podrías mostrar un mensaje de error al usuario
    } finally {
      draggedTask.value = null
      sourceColumn.value = null
    }
  }

  return {
    draggedTask,
    sourceColumn,
    onDragStart,
    onDragOver,
    onDrop
  }
}