<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount, reactive } from 'vue'
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
  User2,
  ChevronDown,
} from '@lucide/vue'
import type {
  Task,
  TaskForm,
  TaskModalTab,
  TaskModalTabValue,
  User,
} from '../../BLL/taskManager/types'
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

const formData = reactive<TaskForm>({
  id: '',
  title: '',
  description: '',
  priority: 'medium',
  assigneeId: '',
  assignees: [],
  dueDate: '',
  status: 'todo',
  tags: [],
  createdAt: '',
})

const populateForm = (task: Task): void => {
  Object.assign(formData, {
    ...task,
    tags: [...task.tags],
    assignees: [...task.assignees],
  })
}

const resetForm = (): void => {
  // reset with props.task
  if (task) {
    populateForm(task)
  } else {
    Object.assign(formData, {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      priority: 'medium',
      assigneeId: '',
      assignees: [],
      dueDate: '',
      status: 'todo',
      tags: [],
      createdAt: new Date().toISOString(),
    })
  }

  tagsInput.value = formData.tags.join(', ')
}

populateForm(task)

const columns = computed(() => taskManager.getCloumns())

const priorities = computed(() => taskManager.getPriorities())

const tagsInput = ref<string>('')

const syncTags = (): void => {
  formData.tags = tagsInput.value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

const users = computed(() => taskManager.getUsers())

const selectedAssignees = computed<User[]>(() => taskManager.getAssignees(formData.assignees))

const isAssigneeMenuOpen = ref<boolean>(false)

const toggleAssigneeMenu = (): void => {
  isAssigneeMenuOpen.value = !isAssigneeMenuOpen.value
}
const closeAssigneeMenu = (): void => {
  isAssigneeMenuOpen.value = false
}

const isOverdue = computed(() => {
  if (!formData.dueDate) return false

  return formData.status !== 'done' && new Date(formData.dueDate).getTime() < Date.now()
})

// const statusMeta = computed(() => {
//   return taskManager.getCloumns().find((column) => column.status === task.status)
// })

// const priorityLabel = computed(() => {
//   return task.priority[0]!.toUpperCase() + task.priority.slice(1)
// })

const close = (): void => {
  emit('update:modelValue', false)
  emit('close')
}

const cancel = (): void => {
  resetForm()
}

const save = (): void => {
  alert('save')
}

const onKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && modelValue) close()
}

const tabs: TaskModalTab[] = [
  { label: 'Activity', value: 'activity' },
  { label: 'My Work', value: 'my-work' },
  { label: 'Assigned', value: 'assigned' },
  { label: 'Comments', value: 'comments' },
]

const activeTab = ref<TaskModalTabValue>('activity')

const selectTab = (tab: TaskModalTabValue): void => {
  activeTab.value = tab
}

watch(
  () => modelValue,
  (isOpen) => {
    if (isOpen) {
      resetForm()
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
    <Transition name="task-modal-fade">
      <div v-if="modelValue" class="task-modal__backdrop" @click="close" />
    </Transition>

    <Transition name="task-modal-slide">
      <aside
        v-if="modelValue"
        class="task-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="task.title"
      >
        <!-- header actions -->
        <header class="task-modal__header">
          <button class="task-modal__icon-btn" aria-label="Close" @click="close">
            <X :size="20" />
          </button>

          <div class="task-modal__header-actions">
            <button class="task-modal__icon-btn" aria-label="History">
              <Clock :size="18" />
            </button>
            <button class="task-modal__icon-btn" aria-label="Favorite">
              <Star :size="18" />
            </button>
            <button class="task-modal__icon-btn" aria-label="More options">
              <MoreVertical :size="18" />
            </button>
          </div>
        </header>

        <!-- form -->
        <div class="task-modal__body">
          <!-- title -->
          <input
            type="text"
            v-model="formData.title"
            placeholder="Task Title"
            class="task-modal__title-input"
          />

          <!-- meta -->
          <dl class="task-modal__meta">
            <!-- created time -->
            <div class="task-modal__meta-row">
              <dt class="task-modal__meta-label">
                <Clock :size="16" />
                <span>Created time</span>
              </dt>
              <dd class="task-modal__meta-value">{{ formatDate(task.createdAt) }}</dd>
            </div>

            <!-- status -->
            <div class="task-modal__meta-row">
              <dt class="task-modal__meta-label">
                <Loader2 :size="16" />
                <span>Status</span>
              </dt>
              <dd class="task-modal__meta-value">
                <select
                  v-model="formData.status"
                  name="modal-status"
                  id="modal-status"
                  class="task-modal__select task-modal__select--status"
                  :class="`task-modal__select--status-${formData.status}`"
                >
                  <option v-for="column in columns" :key="column.status" :value="column.status">
                    {{ column.title }}
                  </option>
                </select>
              </dd>
            </div>

            <!-- priority -->
            <div class="task-modal__meta-row">
              <dt class="task-modal__meta-label">
                <CheckCircle2 :size="16" />
                <span>Priority</span>
              </dt>
              <dd class="task-modal__meta-value">
                <select
                  v-model="formData.priority"
                  name="modal-priority"
                  id="modal-priority"
                  class="task-modal__select task-modal__select--priority"
                  :class="`task-modal__select--priority-${formData.priority}`"
                >
                  <option
                    v-for="priority in priorities"
                    :key="priority.priority"
                    :value="priority.priority"
                  >
                    {{ priority.label }}
                  </option>
                </select>
              </dd>
            </div>

            <!-- due date -->
            <div class="task-modal__meta-row">
              <dt class="task-modal__meta-label">
                <Calendar :size="16" />
                <span>Due Date</span>
              </dt>
              <dd
                class="task-modal__meta-value"
                :class="{ 'task-modal__meta-value--overdue': isOverdue }"
              >
                <input
                  v-model="formData.dueDate"
                  type="date"
                  name="modal-due-date"
                  id="modal-due-date"
                  class="task-modal__date-input"
                />
                <span v-if="isOverdue" class="task-modal__overdue-tag">Overdue</span>
              </dd>
            </div>

            <!-- tags -->
            <div class="task-modal__meta-row">
              <dt class="task-modal__meta-label">
                <Tag :size="16" />
                <span>Tags</span>
              </dt>
              <dd class="task-modal__meta-value">
                <div class="task-modal__tags">
                  <span v-for="tag in formData.tags" :key="tag" class="task-modal__tag-chip">
                    {{ tag }}
                  </span>
                  <span v-if="task.tags.length === 0" class="task-modal__empty-hint">
                    No tags
                  </span>
                  <input
                    v-model="tagsInput"
                    type="text"
                    placeholder="Add tags seperated by commas"
                    class="task-modal__text-input"
                    @blur="syncTags"
                  />
                </div>
              </dd>
            </div>

            <!-- team lead -->
            <div class="task-modal__meta-row">
              <dt class="task-modal__meta-label">
                <User2 :size="16" />
                <span>Lead</span>
              </dt>
              <dd class="task-modal__meta-value">
                <select
                  v-model="formData.assigneeId"
                  name="team-lead"
                  id="team-lead"
                  class="task-modal__select"
                >
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.name }}
                  </option>
                </select>
              </dd>
            </div>

            <!-- team -->
            <div class="task-modal__meta-row">
              <dt class="task-modal__meta-label">
                <Users :size="16" />
                <span>Team</span>
              </dt>

              <dd class="task-modal__meta-value">
                <div class="task-modal__assignee-picker">
                  <!-- Trigger -->
                  <button
                    type="button"
                    class="task-modal__assignee-trigger"
                    :style="{ borderColor: isAssigneeMenuOpen ? 'black' : '#e2e8f0' }"
                    @click="toggleAssigneeMenu"
                  >
                    <div class="task-modal__avatars">
                      <div
                        v-for="user in selectedAssignees"
                        :key="user.id"
                        class="task-modal__avatar"
                        :title="user.name"
                        :style="{ backgroundColor: getAvatarColor(user.name) }"
                      >
                        <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
                        <span v-else>
                          {{ getInitials(user.name) }}
                        </span>
                      </div>

                      <span v-if="selectedAssignees.length === 0" class="task-modal__empty-hint">
                        Select team members
                      </span>
                    </div>

                    <ChevronDown :size="16" />
                  </button>

                  <!-- Dropdown -->
                  <div v-if="isAssigneeMenuOpen" class="task-modal__assignee-dropdown">
                    <label v-for="user in users" :key="user.id" class="task-modal__assignee-option">
                      <input v-model="formData.assignees" type="checkbox" :value="user.id" />

                      <img
                        v-if="user.avatar"
                        :src="user.avatar"
                        :alt="user.name"
                        class="task-modal__avatar"
                      />
                      <span
                        v-else
                        class="task-modal__avatar-initials"
                        :style="{ backgroundColor: getAvatarColor(user.name) }"
                        >{{ getInitials(user.name) }}</span
                      >

                      <span>{{ user.name }}</span>
                    </label>
                  </div>
                </div>
              </dd>
            </div>
          </dl>

          <!-- description -->
          <div class="task-modal__description">
            <h3 class="task-modal__description-title">Description</h3>
            <!-- <p v-if="task.description" class="task-modal__description-text">
              {{ task.description }}
            </p> -->
            <textarea
              v-model="formData.description"
              rows="4"
              placeholder="Description"
              class="task-modal__text-input"
            />
            <!-- <p v-else class="task-modal__description-text">No description</p> -->
          </div>
        </div>

        <!-- tabs -->
        <div class="task-modal__tabs">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="task-modal__tab"
            :class="{ 'task-modal__tab--active': activeTab === tab.value }"
            @click="selectTab(tab.value)"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="task-modal__tab-content">
          <p class="task-modal__empty-hint">
            {{ tabs.find((tab) => tab.value === activeTab)?.label }}.
          </p>
        </div>

        <footer class="task-modal__footer">
          <button class="task-modal__footer-btn" type="button" @click="cancel">Cancel</button>
          <button
            class="task-modal__footer-btn task-modal__footer-btn--primary"
            type="button"
            @click="save"
          >
            Save
          </button>
        </footer>
      </aside>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.task-modal {
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

  // .task-modal__header
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
  }

  // .task-modal__header-actions
  &__header-actions {
    display: flex;
    gap: 8px;
  }

  // .task-modal__icon-btn
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

  // .task-modal__body
  &__body {
    padding: 20px 24px 0;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid var(--color-border);
  }

  // .task-modal__title
  &__title {
    margin: 0 0 24px;
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
  }

  // .task-modal__meta
  &__meta {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 0 0 24px;
  }

  // .task-modal__meta-row
  &__meta-row {
    display: grid;
    grid-template-columns: 160px 1fr;
    align-items: center;
    gap: 12px;
  }

  // .task-modal__meta-label
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

  // .task-modal__meta-value
  &__meta-value {
    margin: 0;
    font-size: 12px;
    font-weight: 500;
    color: #0f172a;

    // .task-modal__meta-value--overdue
    &--overdue {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #dc2626;
    }
  }

  // .task-modal__overdue-tag
  &__overdue-tag {
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 600;
    color: #dc2626;
    background: #fee2e2;
    border-radius: 999px;
  }

  // .task-modal__badge
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

    // .task-modal__badge--priority-low
    &--priority-low {
      background: #eef2ff;
      color: #4f46e5;
    }

    // .task-modal__badge--priority-medium
    &--priority-medium {
      background: #fef3c7;
      color: #b45309;
    }

    // .task-modal__badge--priority-high
    &--priority-high {
      background: #fee2e2;
      color: #dc2626;
    }
  }

  // .task-modal__badge-dot
  &__badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: currentColor;
  }

  // .task-modal__tags
  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  // .task-modal__tag-chip
  &__tag-chip {
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 600;
    color: #475569;
    background: #f1f5f9;
    border-radius: 8px;
  }

  // .task-modal__avatars
  &__avatars {
    display: flex;
    align-items: center;
  }

  // .task-modal__avatar
  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: 20px;
    height: 20px;
    margin-left: -8px;
    font-size: 9px;
    font-weight: 600;
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

  // .task-modal__empty-hint
  &__empty-hint {
    font-size: 0.75rem;
    color: #94a3b8;
  }

  // .task-modal__description
  &__description {
    padding: 16px;
    margin-bottom: 20px;
    background: #f8fafc;
    border-radius: 12px;
  }

  // .task-modal__description-title
  &__description-title {
    margin: 0 0 8px;
    font-size: 0.875rem;
    font-weight: 600;
    color: #0f172a;
  }

  // .task-modal__description-text
  &__description-text {
    margin: 0;
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.6;
    color: #475569;
  }

  // .task-modal__tabs
  &__tabs {
    position: sticky;
    top: 0;
    display: flex;
    gap: 24px;
    padding: 0 24px;
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
  }

  // .task-modal__tab
  &__tab {
    padding: 12px 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;

    // .task-modal__tab--active
    &--active {
      font-weight: 600;
      color: #4f46e5;
      border-bottom-color: #4f46e5;
    }
  }

  // .task-modal__tab-content
  &__tab-content {
    padding: 20px 24px 32px;
  }
}

.task-modal__backdrop {
  position: fixed;
  inset: 0;
  background: rgb(15 23 42 / 45%);
  z-index: 50;
}

.task-modal-fade-enter-active,
.task-modal-fade-leave-active {
  transition: opacity 250ms ease;
}

.task-modal-fade-enter-from,
.task-modal-fade-leave-to {
  opacity: 0;
}

.task-modal-slide-enter-active,
.task-modal-slide-leave-active {
  transition: transform 250ms ease;
}

.task-modal-slide-enter-from,
.task-modal-slide-leave-to {
  transform: translateX(100%);
}

.task-modal {
  // .task-modal__title-input
  &__title-input {
    width: 100%;
    margin: 0 0 24px;
    padding: 0;
    border: none;
    background: transparent;
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
    outline: none;

    &::placeholder {
      color: #94a3b8;
    }
  }
  // .task-modal__select
  &__select {
    min-width: 120px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 600;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    outline: none;

    // .task-modal__select--status-todo
    &--status-todo {
      background: color-mix(in srgb, var(--status-todo) 16%, white);
      color: var(--status-todo);
    }

    // .task-modal__select--status-in-progress
    &--status-in-progress {
      background: color-mix(in srgb, var(--status-progress) 16%, white);
      color: var(--status-progress);
    }

    // .task-modal__select--status-done
    &--status-done {
      background: color-mix(in srgb, var(--status-done) 16%, white);
      color: var(--status-done);
    }

    // .task-modal__select--priority-low
    &--priority-low {
      background: #eef2ff;
      color: #4f46e5;
    }

    // .task-modal__select--priority-medium
    &--priority-medium {
      background: #fef3c7;
      color: #b45309;
    }

    // .task-modal__select--priority-high
    &--priority-high {
      background: #fee2e2;
      color: #dc2626;
    }
  }
  &__date-input {
    padding: 4px 8px;
    font-size: 12px;
    font-weight: 500;
    color: #0f172a;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    outline: none;

    &:focus {
      border-color: #4f46e5;
    }

    // .task-modal__date-input--error
    &--error {
      border-color: #dc2626;
    }

    // .task-modal__date-input--overdue
    &--overdue {
      color: #dc2626;
    }
  }

  // .task-modal_text-input
  &__text-input {
    width: 100%;
    padding: 6px 10px;
    font-size: 12px;
    color: #0f172a;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    outline: none;

    &:focus {
      border-color: #4f46e5;
    }
  }

  // .task-modal__assignee-picker
  &__assignee-picker {
    position: relative;
  }

  // .task-modal__assignee-trigger
  &__assignee-trigger {
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #fff;
    cursor: pointer;

    &:focus {
      outline: none;
    }
  }

  // .task-modal__avatars
  &__avatars {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  // .task-modal__avatar-initials
  &__avatar-initials {
    border-radius: 50%;
    margin-left: -8px;
    padding: 0;
    height: 20px;
    width: 20px;
    display: flex;
    align-items: center;
  }

  // .task-modal__assignee-dropdown
  &__assignee-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;

    width: 260px;

    background: white;
    border-radius: 12px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);

    padding: 8px;

    z-index: 100;
  }

  // .task-modal__assignee-option
  &__assignee-option {
    display: flex;
    align-items: center;
    gap: 12px;

    padding: 8px 10px;
    cursor: pointer;
  }

  // .task-modal__footer
  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    margin-top: auto;
    border-top: 1px solid #e2e8f0;
    background: #fff;
  }

  // .task-modal__footer-btn
  &__footer-btn {
    padding: 8px 16px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
      background: #f8fafc;
      color: #0f172a;
    }

    // .task-modal__footer-btn--primary
    &--primary {
      color: #fff;
      background: #4f46e5;
      border-color: #4f46e5;

      &:hover {
        background: #4338ca;
        color: #fff;
      }
    }
  }
}
</style>
