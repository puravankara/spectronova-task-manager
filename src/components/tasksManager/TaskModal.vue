<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import {
  X,
  Clock,
  Loader2,
  CheckCircle2,
  Calendar,
  Tag,
  Users,
  Star,
  MoreVertical,
} from '@lucide/vue'
import type { Task, TaskSlideoutTab, TaskSlideoutTabValue, User } from '../../BLL/taskManager/types'
import type { TaskManager } from '@/BLL/taskManager/taskManager'
import { getAvatarColor, getInitials } from '@/utils/avatar'
import { formatDate } from '@/utils/date'

const { task, taskManager, modelValue } = defineProps<{
  task: Task
  taskManager: TaskManager
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const tabs: TaskSlideoutTab[] = [
  { label: 'Activity', value: 'activity' },
  { label: 'My Work', value: 'my-work' },
  { label: 'Assigned', value: 'assigned' },
  { label: 'Comments', value: 'comments' },
]

const activeTab = ref<TaskSlideoutTabValue>('activity')

const selectTab = (tab: TaskSlideoutTabValue): void => {
  activeTab.value = tab
}

const statusMeta = computed(() => {
  return taskManager.getCloumns().find((column) => column.status === task.status)
})

const assigneeUsers = computed<User[]>(() =>
  task.assignees
    .map((id) => taskManager.getUser(id))
    .filter((user): user is User => user !== undefined),
)

const isOverdue = computed(() => {
  return task.status !== 'done' && new Date(task.dueDate).getTime() < Date.now()
})

const priorityLabel = computed(() => {
  return task.priority[0]!.toUpperCase() + task.priority.slice(1)
})

const close = (): void => {
  emit('update:modelValue', false)
  emit('close')
}

const onKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && modelValue) close()
}

watch(
  () => modelValue,
  (isOpen) => {
    if (isOpen) {
      activeTab.value = 'activity'
      window.addEventListener('keydown', onKeydown)
    } else {
      window.removeEventListener('keydown', onKeydown)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="task-slideout-fade">
      <div v-if="modelValue" class="task-slideout__backdrop" @click="close" />
    </Transition>

    <Transition name="task-slideout-slide">
      <aside
        v-if="modelValue"
        class="task-slideout"
        role="dialog"
        aria-modal="true"
        :aria-label="task.title"
      >
        <header class="task-slideout__header">
          <button class="task-slideout__icon-btn" aria-label="Close" @click="close">
            <X :size="20" />
          </button>

          <div class="task-slideout__header-actions">
            <button class="task-slideout__icon-btn" aria-label="History">
              <Clock :size="18" />
            </button>
            <button class="task-slideout__icon-btn" aria-label="Favorite">
              <Star :size="18" />
            </button>
            <button class="task-slideout__icon-btn" aria-label="More options">
              <MoreVertical :size="18" />
            </button>
          </div>
        </header>

        <div class="task-slideout__body">
          <h2 class="task-slideout__title">{{ task.title }}</h2>

          <dl class="task-slideout__meta">
            <div class="task-slideout__meta-row">
              <dt class="task-slideout__meta-label">
                <Clock :size="16" />
                <span>Created time</span>
              </dt>
              <dd class="task-slideout__meta-value">{{ formatDate(task.createdAt) }}</dd>
            </div>

            <div class="task-slideout__meta-row">
              <dt class="task-slideout__meta-label">
                <Loader2 :size="16" />
                <span>Status</span>
              </dt>
              <dd class="task-slideout__meta-value">
                <span
                  v-if="statusMeta"
                  class="task-slideout__badge"
                  :style="{ '--badge-color': statusMeta.color }"
                >
                  <span class="task-slideout__badge-dot" />
                  {{ statusMeta.title }}
                </span>
              </dd>
            </div>

            <div class="task-slideout__meta-row">
              <dt class="task-slideout__meta-label">
                <CheckCircle2 :size="16" />
                <span>Priority</span>
              </dt>
              <dd class="task-slideout__meta-value">
                <span
                  class="task-slideout__badge task-slideout__badge--priority"
                  :class="`task-slideout__badge--priority-${task.priority}`"
                >
                  {{ priorityLabel }}
                </span>
              </dd>
            </div>

            <div class="task-slideout__meta-row">
              <dt class="task-slideout__meta-label">
                <Calendar :size="16" />
                <span>Due Date</span>
              </dt>
              <dd
                class="task-slideout__meta-value"
                :class="{ 'task-slideout__meta-value--overdue': isOverdue }"
              >
                {{ formatDate(task.dueDate) }}
                <span v-if="isOverdue" class="task-slideout__overdue-tag">Overdue</span>
              </dd>
            </div>

            <div class="task-slideout__meta-row">
              <dt class="task-slideout__meta-label">
                <Tag :size="16" />
                <span>Tags</span>
              </dt>
              <dd class="task-slideout__meta-value">
                <div class="task-slideout__tags">
                  <span v-for="tag in task.tags" :key="tag" class="task-slideout__tag-chip">
                    {{ tag }}
                  </span>
                  <span v-if="task.tags.length === 0" class="task-slideout__empty-hint">
                    No tags
                  </span>
                </div>
              </dd>
            </div>

            <div class="task-slideout__meta-row">
              <dt class="task-slideout__meta-label">
                <Users :size="16" />
                <span>Assignees</span>
              </dt>
              <dd class="task-slideout__meta-value">
                <div class="task-slideout__avatars">
                  <div
                    v-for="user in assigneeUsers"
                    :key="user.id"
                    class="task-slideout__avatar"
                    :style="{ '--avatar-color': getAvatarColor(user.name) }"
                    :title="user.name"
                  >
                    <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
                    <span v-else>{{ getInitials(user.name) }}</span>
                  </div>
                  <span v-if="assigneeUsers.length === 0" class="task-slideout__empty-hint">
                    Unassigned
                  </span>
                </div>
              </dd>
            </div>
          </dl>

          <div class="task-slideout__description">
            <h3 class="task-slideout__description-title">Description</h3>
            <p v-if="task.description" class="task-slideout__description-text">
              {{ task.description }}
            </p>
            <p v-else class="task-slideout__description-text">No description</p>
          </div>
        </div>

        <div class="task-slideout__tabs">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="task-slideout__tab"
            :class="{ 'task-slideout__tab--active': activeTab === tab.value }"
            @click="selectTab(tab.value)"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="task-slideout__tab-content">
          <p class="task-slideout__empty-hint">
            {{ tabs.find((tab) => tab.value === activeTab)?.label }}.
          </p>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.task-slideout {
  position: fixed;
  top: 16px;
  right: 16px;
  bottom: 16px;
  border-radius: 12px;
  width: min(560px, 100vw);
  background: #fff;
  box-shadow: -8px 0 24px rgb(15 23 42 / 12%);
  z-index: 51;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  // .task-slideout__header
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
  }

  // .task-slideout__header-actions
  &__header-actions {
    display: flex;
    gap: 8px;
  }

  // .task-slideout__icon-btn
  &__icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    border-radius: 8px;
    color: #64748b;
    cursor: pointer;

    &:hover {
      background: #f1f5f9;
      color: #0f172a;
    }
  }

  // .task-slideout__body
  &__body {
    padding: 20px 24px 0;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid var(--color-border);
  }

  // .task-slideout__title
  &__title {
    margin: 0 0 24px;
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
  }

  // .task-slideout__meta
  &__meta {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 0 0 24px;
  }

  // .task-slideout__meta-row
  &__meta-row {
    display: grid;
    grid-template-columns: 160px 1fr;
    align-items: center;
    gap: 12px;
  }

  // .task-slideout__meta-label
  &__meta-label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 11px;
    font-weight: 400;
    color: #64748b;

    svg {
      flex-shrink: 0;
      color: #94a3b8;
    }
  }

  // .task-slideout__meta-value
  &__meta-value {
    margin: 0;
    font-size: 12px;
    font-weight: 500;
    color: #0f172a;

    // .task-slideout__meta-value--overdue
    &--overdue {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #dc2626;
    }
  }

  // .task-slideout__overdue-tag
  &__overdue-tag {
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 600;
    color: #dc2626;
    background: #fee2e2;
    border-radius: 999px;
  }

  // .task-slideout__badge
  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 600;
    border-radius: 999px;
    background: color-mix(in srgb, var(--badge-color, #94a3b8) 16%, white);
    color: var(--badge-color, #475569);

    // .task-slideout__badge--priority-low
    &--priority-low {
      background: #eef2ff;
      color: #4f46e5;
    }

    // .task-slideout__badge--priority-medium
    &--priority-medium {
      background: #fef3c7;
      color: #b45309;
    }

    // .task-slideout__badge--priority-high
    &--priority-high {
      background: #fee2e2;
      color: #dc2626;
    }
  }

  // .task-slideout__badge-dot
  &__badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: currentColor;
  }

  // .task-slideout__tags
  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  // .task-slideout__tag-chip
  &__tag-chip {
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 600;
    color: #475569;
    background: #f1f5f9;
    border-radius: 8px;
  }

  // .task-slideout__avatars
  &__avatars {
    display: flex;
    align-items: center;
  }

  // .task-slideout__avatar
  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: 20px;
    height: 20px;
    margin-left: -8px;
    font-size: 11px;
    font-weight: 600;
    color: #fff;
    background: var(--avatar-color, #6366f1);
    border: 2px solid #fff;
    border-radius: 999px;

    &:first-child {
      margin-left: 0;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  // .task-slideout__empty-hint
  &__empty-hint {
    font-size: 0.75rem;
    color: #94a3b8;
  }

  // .task-slideout__description
  &__description {
    padding: 16px;
    margin-bottom: 20px;
    background: #f8fafc;
    border-radius: 12px;
  }

  // .task-slideout__description-title
  &__description-title {
    margin: 0 0 8px;
    font-size: 0.875rem;
    font-weight: 600;
    color: #0f172a;
  }

  // .task-slideout__description-text
  &__description-text {
    margin: 0;
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.6;
    color: #475569;
  }

  // .task-slideout__tabs
  &__tabs {
    position: sticky;
    top: 0;
    display: flex;
    gap: 24px;
    padding: 0 24px;
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
  }

  // .task-slideout__tab
  &__tab {
    padding: 12px 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;

    // .task-slideout__tab--active
    &--active {
      font-weight: 600;
      color: #4f46e5;
      border-bottom-color: #4f46e5;
    }
  }

  // .task-slideout__tab-content
  &__tab-content {
    padding: 20px 24px 32px;
  }
}

.task-slideout__backdrop {
  position: fixed;
  inset: 0;
  background: rgb(15 23 42 / 45%);
  z-index: 50;
}

.task-slideout-fade-enter-active,
.task-slideout-fade-leave-active {
  transition: opacity 250ms ease;
}

.task-slideout-fade-enter-from,
.task-slideout-fade-leave-to {
  opacity: 0;
}

.task-slideout-slide-enter-active,
.task-slideout-slide-leave-active {
  transition: transform 250ms ease;
}

.task-slideout-slide-enter-from,
.task-slideout-slide-leave-to {
  transform: translateX(100%);
}
</style>
