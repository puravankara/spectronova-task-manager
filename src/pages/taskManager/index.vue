<template>
  <main class="task-manager" :class="{ 'overflow-hidden': selectedTask }">
    <Sidebar :user="loggedInUser" />
    <div class="task-contents">
      <PageBreadcrumb :items="[{ label: 'Team spaces' }, { label: 'Tasks' }]" />
      <PageHeader
        title="Tasks"
        description="Track, organize, and manage your team's work from start to finish."
        :members="mockUsers"
      />
      <ViewToggle
        v-model="currentView"
        :sort-field="sortField"
        :sort-direction="sortDirection"
        @update:sort-field="updateSortField"
        @update:sort-direction="updateSortDirection"
      />

      <KanbanBoard
        v-if="currentView === 'board'"
        :key="refreshKey"
        :task-manager="taskManager"
        @open="openTask"
        @move-task="onMoveTask"
      />
      <ListView
        v-else-if="currentView === 'list'"
        :task-manager="taskManager"
        :sort-field="sortField"
        :sort-direction="sortDirection"
      />
      <TaskModal
        v-if="selectedTask"
        v-model="isTaskModalOpen"
        :task="selectedTask"
        :task-manager="taskManager"
        @close="closeTask"
        @refresh="refreshKey++"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import type { SortDirection, SortField, Task, TaskStatus, ViewMode } from '@/BLL/taskManager/types'
import { TaskManager } from '@/BLL/taskManager/taskManager'

import { computed, ref } from 'vue'
import ViewToggle from '@/components/tasksManager/ViewToggle.vue'
import Sidebar from '@/components/tasksManager/SideBar.vue'
import PageBreadcrumb from '@/components/tasksManager/PageBreadcrumb.vue'
import PageHeader from '@/components/tasksManager/PageHeader.vue'
import { mockUsers } from '@/BLL/taskManager/mockData'
import KanbanBoard from '@/components/tasksManager/KanbanBoard.vue'
import ListView from '@/components/tasksManager/ListView.vue'
import TaskModal from '@/components/tasksManager/TaskModal.vue'

defineOptions({
  name: 'TaskManagerPage',
})

const taskManager = new TaskManager()

const loggedInUser = computed(() => taskManager.getLoggedInUser())

const currentView = ref<ViewMode>('board')

const selectedTask = ref<Task | null>(null)
const isTaskModalOpen = ref(false)

const openTask = (task: Task): void => {
  selectedTask.value = task
  isTaskModalOpen.value = true
}

const closeTask = (): void => {
  selectedTask.value = null
}

const sortField = ref<SortField>('dueDate')
const sortDirection = ref<SortDirection>('asc')

const updateSortField = (field: SortField) => {
  sortField.value = field
}

const updateSortDirection = (direction: SortDirection) => {
  sortDirection.value = direction
}

const refreshKey = ref(0)
const onMoveTask = (taskId: string, status: TaskStatus): void => {
  taskManager.moveTo(taskId, status)
  refreshKey.value++
}
</script>

<style lang="scss" scoped>
.task-manager {
  display: grid;
  grid-template-columns: 260px auto;
}

.task-contents {
  padding: 16px 32px;
  height: 100vh;
  overflow-y: auto;
}
main.overflow-hidden {
  overflow: hidden;
  height: 100vh;
}
</style>
