<script setup lang="ts">
import {
  BarChart3,
  ChevronDown,
  Clock,
  FileText,
  Flag,
  ListSortDescending,
  User,
} from '@lucide/vue'

import { computed, ref } from 'vue'

import type { TaskManager } from '@/BLL/taskManager/taskManager'
import type { Task, TaskStatus } from '@/BLL/taskManager/types'

import ListRow from './ListRow.vue'

const { taskManager, tasks, status } = defineProps<{
  taskManager: TaskManager
  tasks: Task[]
  status: TaskStatus
}>()

const isExpanded = ref(true)

const statusGroup = computed(() => taskManager.getStatusGroup(status))
</script>

<template>
  <section class="list-section">
    <header class="list-section__header" @click="isExpanded = !isExpanded">
      <div class="list-section__title">
        <span
          class="status--btn"
          :style="{
            color: statusGroup.color,
            border: `1px solid color-mix(in srgb, ${statusGroup.color} 50%, white)`,
            backgroundColor: `color-mix(in srgb, ${statusGroup.color} 10%, white)`,
          }"
        >
          <span class="status--btn__dot" :style="{ backgroundColor: statusGroup.color }" />
          {{ statusGroup.title }}
        </span>

        <span class="list-section__count">{{ tasks.length }}</span>
      </div>

      <button
        class="list-section__toggle"
        type="button"
        :class="{ 'list-section__toggle--collapsed': !isExpanded }"
        aria-label="Toggle section"
      >
        <ChevronDown />
      </button>
    </header>

    <div v-if="isExpanded" class="list-section__table-wrapper">
      <div v-if="tasks.length == 0">
        <table>
          <tbody>
            <tr>
              <td style="padding: 8px; font-size: 12px"><code>Tasks Completed</code></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <table class="list-section__table">
          <thead>
            <tr>
              <th colspan="2">
                <span class="th-label">
                  <BarChart3 :size="12" />
                  Task Name
                </span>
              </th>
              <th>
                <span class="th-label">
                  <FileText :size="12" />
                  Descriptions
                </span>
              </th>
              <th>
                <span class="th-label">
                  <User :size="12" />
                  People
                </span>
              </th>
              <th>
                <span class="th-label">
                  <ListSortDescending :size="12" />
                  Type
                </span>
              </th>
              <th>
                <span class="th-label">
                  <Clock :size="12" />
                  Timeline Date
                </span>
              </th>
              <th>
                <span class="th-label">
                  <Flag :size="12" />
                  Priority
                </span>
              </th>
              <th class="col-actions" />
            </tr>
          </thead>

          <tbody>
            <ListRow
              v-for="task in tasks"
              :key="task.id"
              :task="task"
              :task-manager="taskManager"
            />
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.list-section {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-surface, #fff);
  border: 1px solid var(--color-border, #eceef1);
  border-radius: 12px;

  & + & {
    margin-top: 16px;
  }

  // .list-section__header
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    cursor: pointer;
    user-select: none;
  }

  // .list-section__title
  &__title {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  // .list-section__count
  &__count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
    padding: 0 8px;
    border-radius: 8px;
    background: var(--color-muted-bg, #f3f4f6);
    color: var(--color-text-secondary, #6b7280);
    font-size: 12px;
    font-weight: 600;
  }

  // .list-section__toggle
  &__toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: none;
    border: none;
    border-radius: 8px;
    color: var(--color-text-secondary, #6b7280);
    cursor: pointer;
    transition:
      transform 0.15s ease,
      background-color 0.15s ease;

    &:hover {
      background: var(--color-muted-bg, #f3f4f6);
    }

    // .list-section__toggle--collapsed
    &--collapsed {
      transform: rotate(-90deg);
    }
  }

  // .list-section__table-wrapper
  &__table-wrapper {
    overflow-x: auto;
    border-top: 1px solid var(--color-border, #eceef1);
  }

  // .list-section__table
  &__table {
    width: 100%;
    border-collapse: collapse;

    th {
      padding: 10px 12px;
      text-align: left;
      white-space: nowrap;
      border-bottom: 1px solid var(--color-border, #eceef1);

      &:not(:first-child) {
        padding-left: 4px;
      }
    }

    .col-drag,
    .col-check,
    .col-actions {
      width: 32px;
      padding: 10px 4px;
    }
  }
}

.status--btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-xs);
  font-size: 12px;
  font-weight: 600;

  // .status--btn__dot
  &__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
}

.th-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary, #6b7280);
}
</style>
