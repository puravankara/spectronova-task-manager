<script setup lang="ts">
import { LayoutGrid, Clock, Flag, GripVertical, MoreHorizontal } from '@lucide/vue'

import { computed } from 'vue'

import type { TaskManager } from '@/BLL/taskManager/taskManager'
import type { Task } from '@/BLL/taskManager/types'

import { formatDate } from '@/utils/date'
import { getAvatarColor, getInitials } from '@/utils/avatar'

const { task, taskManager } = defineProps<{
  task: Task
  taskManager: TaskManager
}>()

const isOverdue = computed(
  () => task.status !== 'done' && new Date(task.dueDate).getTime() < Date.now(),
)

const priority = taskManager.getPriority(task.priority)

// Using the first tag as a stand-in "type" chip until a dedicated field exists on Task.
const typeLabel = computed(() => task.tags[0] ?? 'Task')

const handleDelete = () => {
  if (confirm(`Delete "${task.title}"?`)) {
    taskManager.deleteTask(task.id)
  }
}

const assignees = taskManager.getAssignees(task.assignees)

// Returns the first four members to display as avatars
const visibleMembers = computed(() => assignees.slice(0, 4))

// Calculates the number of remaining members that are represented by +N avatar
const extraMembersCount = computed(() => Math.max(assignees.length - 4, 0))
</script>

<template>
  <tr class="list-row">
    <td>
      <span class="drag-handle" aria-hidden="true">
        <GripVertical :size="12" />
      </span>
    </td>

    <td style="padding-left: 0">
      <input type="checkbox" class="row-checkbox" aria-label="Select task" />
      <span class="row-title">{{ task.title }}</span>
    </td>

    <td>
      <span class="row-description">{{ task.description }}</span>
    </td>

    <td>
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
      <!--       
      <div v-if="assignee" class="row-person">
        <span class="avatar" :style="{ backgroundColor: avatarColor }">{{ initials }}</span>
        <span class="person-name">{{ assignee.name }}</span>
      </div>
      <span v-else class="row-person row-person--empty">Unassigned</span> -->
    </td>

    <td>
      <span class="type-chip">
        <LayoutGrid :size="12" />
        {{ typeLabel }}
      </span>
    </td>

    <td>
      <span class="row-date" :class="{ 'row-date--overdue': isOverdue }">
        <Clock :size="12" />
        {{ formatDate(task.createdAt) }} - {{ formatDate(task.dueDate) }}
      </span>
    </td>

    <td>
      <span
        class="priority-flag"
        :style="{
          color: priority.color,
          borderColor: `color-mix(in srgb, ${priority.color} 5%, white)`,
          backgroundColor: `color-mix(in srgb, ${priority.color} 5%, white)`,
        }"
      >
        <Flag :size="12" />
        {{ priority.label }}
      </span>
    </td>

    <td class="col-actions">
      <button class="row-menu" type="button" aria-label="Delete task" @click="handleDelete">
        <MoreHorizontal :size="12" />
      </button>
    </td>
  </tr>
</template>

<style scoped lang="scss">
.list-row {
  border-bottom: 1px solid var(--color-border, #eceef1);
  transition: background-color 0.12s ease;

  &:hover {
    background: var(--color-muted-bg, #f9fafb);
  }

  &:last-child {
    border-bottom: none;
  }

  td {
    padding: 4px;
    vertical-align: middle;
    font-size: 12px;
    color: var(--color-text-primary, #111827);
  }

  .col-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    padding: 4px;
  }
}

.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary, #9ca3af);
  cursor: grab;
  font-size: 14px;
  letter-spacing: -1px;
}

.row-checkbox {
  width: 12px;
  height: 12px;
  accent-color: #f1f1ff;
  cursor: pointer;
  vertical-align: middle;
}

.row-title {
  padding-left: 4px;
  white-space: nowrap;
  vertical-align: middle;
}

.row-description {
  display: -webkit-box;
  overflow: hidden;
  max-width: 260px;
  color: var(--color-text-secondary, #6b7280);
  line-clamp: 1;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.row-person {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  // .row-person--empty
  &--empty {
    color: var(--color-text-secondary, #9ca3af);
    font-style: italic;
  }
}

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
}

.person-name {
  white-space: nowrap;
}

.type-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 8px;
  background: var(--color-muted-bg, #f3f4f6);
  color: var(--color-text-secondary, #6b7280);
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
  white-space: nowrap;
}

.row-date {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-secondary, #6b7280);
  white-space: nowrap;

  // .row-date--overdue
  &--overdue {
    color: #ef4444;
    font-weight: 600;
  }
}

.priority-flag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border: 1px solid;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.row-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  border-radius: 6px;
  color: var(--color-text-secondary, #9ca3af);
  cursor: pointer;

  &:hover {
    background: var(--color-muted-bg, #f3f4f6);
    color: var(--color-text-primary, #111827);
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
