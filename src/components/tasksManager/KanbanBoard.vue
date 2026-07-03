<script lang="ts" setup>
import type { TaskManager } from '@/BLL/taskManager/taskManager.ts'
import KanbanColumn from './KanbanColumn.vue'
import { computed } from 'vue'
import type { Task, TaskStatus } from '@/BLL/taskManager/types.ts'

const { taskManager } = defineProps<{
  taskManager: TaskManager
}>()

const columns = computed(() => taskManager.getCloumns())
// const columnCount = computed(() => columns.value.length)

const onMoveTask = (taskId: string, status: TaskStatus): void => {
  emit('move-task', taskId, status)
}

const emit = defineEmits<{
  (e: 'open', task: Task): void
  (e: 'move-task', taskId: string, status: TaskStatus): void
}>()
</script>

<template>
  <section class="kanban-board">
    <KanbanColumn
      v-for="column in columns"
      :key="column.status"
      :task-manager="taskManager"
      :column="column"
      @open="emit('open', $event)"
      @move-task="onMoveTask"
    />
  </section>
</template>

<style lang="scss" scoped>
.kanban-board {
  display: grid;
  // grid-template-columns: repeat(v-bind(columnCount), minmax(250px, 1fr));
  grid-template-columns: repeat(4, minmax(250px, 1fr));
  gap: 24px;
  align-items: start;
  padding: 20px 0;
}

@media only screen and (max-width: 1400px) {
  .kanban-board {
    grid-template-columns: repeat(3, minmax(250px, 1fr));
  }
}
</style>
