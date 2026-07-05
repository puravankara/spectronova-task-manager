<script lang="ts" setup>
import { computed, ref } from 'vue'
import TaskCard from './TaskCard.vue'
import type { TaskManager } from '@/BLL/taskManager/taskManager'
import type { StatusGroup, Task, TaskStatus } from '@/BLL/taskManager/types'
import { Plus } from '@lucide/vue'

const { taskManager, column } = defineProps<{
  taskManager: TaskManager
  column: StatusGroup
}>()

const tasks = computed(() => taskManager.getTasksByStatus(column.status))

const isDraggingOver = ref(false)

const onDragOver = (event: DragEvent): void => {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'move'
  isDraggingOver.value = true
}

const onDragLeave = (): void => {
  isDraggingOver.value = false
}

const onDrop = (event: DragEvent): void => {
  event.preventDefault()

  isDraggingOver.value = false

  const taskId = event.dataTransfer?.getData('text/plain')

  if (!taskId) {
    return
  }

  emit('move-task', taskId, column.status)
}

const emit = defineEmits<{
  (e: 'open', task: Task): void
  (e: 'move-task', taskId: string, status: TaskStatus): void
}>()
</script>

<template>
  <section class="kanban-column">
    <header class="kanban-column__header">
      <div class="kanban-column__heading">
        <span class="kanban-column__dot" :style="{ background: column.color }" />
        <h2 class="kanban-column__title">{{ column.title }}</h2>
      </div>

      <span class="kanban-column__count" :style="{ background: column.color }">
        {{ tasks.length }}
      </span>

      <Plus :size="14" style="margin-left: auto" />
    </header>

    <div class="kanban-column__body">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :task-manager="taskManager"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
        @click="emit('open', task)"
      />

      <div v-if="tasks.length === 0" class="kanban-column__empty">
        <span class="kanban-column__empty-dot" :style="{ background: column.color }" />
        No tasks
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.kanban-column {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px 8px;
  background: #f4f4f4;
  border-radius: 8px;

  // .kanban-column__header
  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 var(--spacing-xs) var(--spacing-lg);
  }

  // .kanban-column__heading
  &__heading {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  // .kanban-column__dot
  &__dot {
    flex-shrink: 0;
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
  }

  // .kanban-column__title
  &__title {
    margin: 0;
    color: var(--color-text);
    font-size: var(--font-size-column-title);
    font-weight: var(--font-weight-semibold);
  }

  // .kanban-column__count
  &__count {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 var(--spacing-xs);
    border-radius: var(--radius-full);
    color: var(--color-surface);
    font-size: var(--font-size-meta);
    font-weight: var(--font-weight-semibold);
  }

  // .kanban-column__body
  &__body {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    min-height: 80px;
    padding: var(--spacing-xs);
    border-radius: var(--radius-lg);
    transition: background var(--transition);
  }

  // .kanban-column__empty
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-3xl) var(--spacing-lg);
    border: 1px dashed var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-secondary);
    font-size: var(--font-size-card-body);
  }

  // .kanban-column__empty-dot
  &__empty-dot {
    width: 10px;
    height: 10px;
    border-radius: var(--radius-full);
    opacity: 0.4;
  }
}
</style>
