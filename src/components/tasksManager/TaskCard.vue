<script setup lang="ts">
import { computed } from 'vue'
import { AlertCircle, Flag, MoreHorizontal } from '@lucide/vue'
import type { Task } from '@/BLL/taskManager/types'
import type { TaskManager } from '@/BLL/taskManager/taskManager'
import { getAvatarColor, getInitials } from '@/utils/avatar'
import { formatDate } from '@/utils/date'

const { task, taskManager } = defineProps<{
  task: Task
  taskManager: TaskManager
}>()

const emit = defineEmits<{
  edit: [task: Task]
}>()

const priorityLabel = computed(() => {
  return task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
})

const isOverdue = computed(() => {
  if (task.status === 'done') return false
  return new Date(task.dueDate) < new Date(new Date().toDateString())
})

const onDragStart = (event: DragEvent): void => {
  if (!event.dataTransfer) {
    return
  }

  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', task.id)
}

const onDragEnd = (): void => {}

const assignees = taskManager.getAssignees(task.assignees)

// Returns the first four members to display as avatars
const visibleMembers = computed(() => assignees.slice(0, 4))

// Calculates the number of remaining members that are represented by +N avatar
const extraMembersCount = computed(() => Math.max(assignees.length - 4, 0))
</script>

<template>
  <article class="task-card" draggable="true" @dragstart="onDragStart" @dragend="onDragEnd">
    <div class="task-card__top">
      <h3 class="task-card__title">{{ task.title }}</h3>
      <button
        class="task-card__menu-btn"
        type="button"
        aria-label="Task actions"
        @click="emit('edit', task)"
      >
        <MoreHorizontal :size="16" />
      </button>
    </div>

    <p class="task-card__description">{{ task.description }}</p>

    <div class="task-card__assignees">
      assignees:
      <div v-if="assignees.length" class="page-header__avatars">
        <div v-for="member in visibleMembers" :key="member.name" class="page-header__avatar">
          <img v-if="member.avatar" :src="member.avatar" :alt="member.name" />
          <span
            v-else
            class="page-header__avatar-initials"
            :style="{ backgroundColor: getAvatarColor(member.name) }"
          >
            {{ getInitials(member.name) }}
          </span>
        </div>
        <div v-if="extraMembersCount > 0" class="page-header__avatar page-header__avatar--extra">
          +{{ extraMembersCount }}
        </div>
      </div>
    </div>
    <div class="task-card__meta-row">
      <span class="task-card__date" :class="{ 'task-card__date--overdue': isOverdue }">
        <component :is="isOverdue ? AlertCircle : Flag" :size="12" />
        {{ formatDate(task.dueDate) }}
      </span>

      <span class="task-card__priority" :class="`task-card__priority--${task.priority}`">
        {{ priorityLabel }}
      </span>
    </div>

    <footer class="task-card__footer">
      <div class="task-card__tags">
        <span v-for="tag in task.tags" :key="tag" class="task-card__tag">{{ tag }}</span>
      </div>
    </footer>
  </article>
</template>

<style scoped lang="scss">
.task-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
  cursor: grab;
  font-family: var(--font-family);
  transition:
    box-shadow var(--transition),
    transform var(--transition);

  &:hover {
    box-shadow: var(--shadow-panel);
  }

  &:active {
    cursor: grabbing;
  }

  // .task-card__top
  &__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--spacing-sm);
  }

  // .task-card__title
  &__title {
    margin: 0;
    overflow: hidden;
    color: var(--color-text);
    font-size: var(--font-size-card-title);
    font-weight: var(--font-weight-semibold);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // .task-card__menu-btn
  &__menu-btn {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: none;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: background var(--transition);

    &:hover {
      background: var(--color-hover);
    }
  }

  // .task-card__description
  &__description {
    display: -webkit-box;
    margin: 0;
    overflow: hidden;
    color: var(--color-text-secondary);
    font-size: var(--font-size-card-body);
    font-weight: var(--font-weight-regular);
    line-height: 1.5;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  // .task-card__assignees
  &__assignees {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 0;
    font-size: 12px;
  }

  // .task-card__meta-row
  &__meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-sm);
  }

  // .task-card__date
  &__date {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    color: var(--color-text-secondary);
    font-size: var(--font-size-meta);
    font-weight: var(--font-weight-regular);

    // .task-card__date--overdue
    &--overdue {
      color: var(--task-overdue);
      font-weight: var(--font-weight-medium);
    }
  }

  // .task-card__priority
  &__priority {
    padding: 2px var(--spacing-sm);
    border-radius: var(--radius-full);
    font-size: var(--font-size-meta);
    font-weight: var(--font-weight-semibold);
    white-space: nowrap;

    // .task-card__priority--low
    &--low {
      background: var(--priority-low-bg);
      color: var(--priority-low-text);
    }

    // .task-card__priority--medium
    &--medium {
      background: var(--priority-medium-bg);
      color: var(--priority-medium-text);
    }

    // .task-card__priority--high
    &--high {
      background: var(--priority-high-bg);
      color: var(--priority-high-text);
    }
  }

  // .task-card__footer
  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-sm);
    padding-top: var(--spacing-sm);
    border-top: 1px solid var(--color-border);
  }

  // .task-card__tags
  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
    min-width: 0;
  }

  // .task-card__tag
  &__tag {
    padding: 2px var(--spacing-sm);
    border-radius: var(--radius-sm);
    background: var(--color-page);
    color: var(--color-text-secondary);
    font-size: var(--font-size-meta);
    font-weight: var(--font-weight-medium);
    white-space: nowrap;
  }

  // .task-card__assignee
  &__assignee {
    flex-shrink: 0;
  }

  // .task-card__avatar
  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: var(--radius-full);
    color: var(--color-surface);
    font-size: 10px;
    font-weight: var(--font-weight-semibold);
  }
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);

  // .page-header__avatars
  &__avatars {
    display: flex;
    align-items: center;
  }

  // .page-header__avatar
  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    margin-left: -8px;
    overflow: hidden;
    border: 2px solid var(--color-surface);
    border-radius: var(--radius-full);
    background: var(--color-surface-secondary);

    &:first-child {
      margin-left: 0;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    // .page-header__avatar-initials
    &-initials {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: #5c5c5c;
      font-size: 11px;
      font-weight: var(--font-weight-semibold);
    }

    // .page-header__avatar--extra
    &--extra {
      background: var(--color-surface-secondary);
      color: var(--color-text-secondary);
      font-size: var(--font-size-meta);
      font-weight: var(--font-weight-semibold);
    }
  }
}
</style>
