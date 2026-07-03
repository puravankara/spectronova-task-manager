<script lang="ts" setup>
import type { TaskManager } from '@/BLL/taskManager/taskManager'
import ListSection from './ListSection.vue'
import type { SortDirection, SortField } from '@/BLL/taskManager/types.ts'

const { taskManager, sortField, sortDirection } = defineProps<{
  taskManager: TaskManager
  sortField: SortField
  sortDirection: SortDirection
}>()

const sections = taskManager.getCloumns()
</script>

<template>
  <section class="list-view">
    <ListSection
      v-for="section in sections"
      :key="section.status"
      :task-manager="taskManager"
      :tasks="taskManager.getSortedTasks(section.status, sortField, sortDirection)"
      :status="section.status"
    />
  </section>
</template>

<style lang="scss" scoped>
.list-view {
  display: grid;
  grid-template-columns: repeat(var(4), minmax(250px, 1fr));
  gap: 24px;
  align-items: start;
  padding: 20px 0;
}
</style>
