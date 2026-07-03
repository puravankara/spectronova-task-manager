<script lang="ts" setup>
import type { ViewMode, ViewTab, SortField, SortDirection } from '@/BLL/taskManager/types'
import {
  ChartColumnBig,
  List,
  TableProperties,
  Clock3,
  ArrowUpDown,
  Ellipsis,
  Filter,
  Layers3,
} from '@lucide/vue'

import { useLocalStorage } from '@/composables/useLocalStorage'
import { ref } from 'vue'

const activeView = useLocalStorage()

const { modelValue } = defineProps<{
  modelValue: ViewMode
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ViewMode): void
  (e: 'update:sort-field', value: SortField): void
  (e: 'update:sort-direction', value: SortDirection): void
}>()

const viewTabs: ViewTab[] = [
  {
    label: 'Overview',
    icon: undefined,
    value: 'overview',
    isEnabled: false,
  },
  {
    label: 'Board',
    icon: ChartColumnBig,
    value: 'board',
    isEnabled: true,
  },
  {
    label: 'List',
    icon: List,
    value: 'list',
    isEnabled: true,
  },
  {
    label: 'Table',
    icon: TableProperties,
    value: 'table',
    isEnabled: false,
  },
  {
    label: 'Timeline',
    icon: Clock3,
    value: 'timeline',
    isEnabled: false,
  },
]

const updateView = (view: ViewMode, enabled: boolean) => {
  if (!enabled || modelValue === view) return

  activeView.value = view

  emit('update:modelValue', view)
}

updateView(activeView.value, true)

const showSortMenu = ref(false)

const toggleSortMenu = () => {
  showSortMenu.value = !showSortMenu.value
}

const sortByDueDateAsc = () => {
  emit('update:sort-field', 'dueDate')
  emit('update:sort-direction', 'asc')
  showSortMenu.value = false
}

const sortByDueDateDesc = () => {
  emit('update:sort-field', 'dueDate')
  emit('update:sort-direction', 'desc')
  showSortMenu.value = false
}

const sortByPriorityAsc = () => {
  emit('update:sort-field', 'priority')
  emit('update:sort-direction', 'asc')
  showSortMenu.value = false
}

const sortByPriorityDesc = () => {
  emit('update:sort-field', 'priority')
  emit('update:sort-direction', 'desc')
  showSortMenu.value = false
}
</script>

<template>
  <nav class="view-toggle">
    <div class="view-toggle__tabs">
      <button
        v-for="tab in viewTabs"
        :key="tab.value"
        class="view-toggle__tab"
        :class="{
          'view-toggle__tab--active': modelValue === tab.value,
          'view-toggle__tab--disabled': !tab.isEnabled,
        }"
        @click="updateView(tab.value, tab.isEnabled)"
      >
        <component :is="tab.icon" :size="16" />
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <div class="view-toggle__actions">
      <button class="view-toggle__action">
        <Filter :size="16" />
        <span>Filter</span>
      </button>

      <button class="view-toggle__action">
        <Layers3 :size="16" />
        <span>Group by</span>
      </button>

      <div class="view-toggle__dropdown">
        <button class="view-toggle__action" @click="toggleSortMenu">
          <ArrowUpDown :size="16" />
          <span>Sort</span>
        </button>

        <div v-if="showSortMenu" class="view-toggle__dropdown-menu">
          <button class="view-toggle__dropdown-item" @click="sortByDueDateAsc">Due Date Asc</button>

          <button class="view-toggle__dropdown-item" @click="sortByDueDateDesc">
            Due Date Desc
          </button>

          <button class="view-toggle__dropdown-item" @click="sortByPriorityAsc">
            Priority Asc
          </button>

          <button class="view-toggle__dropdown-item" @click="sortByPriorityDesc">
            Priority Desc
          </button>
        </div>
      </div>
      <button class="view-toggle__action">
        <Ellipsis :size="16" />
      </button>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.view-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  border-bottom: 1px solid var(--color-border);

  // .view-toggle__tabs
  &__tabs {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  // .view-toggle__tab
  &__tab {
    display: flex;
    align-items: center;
    gap: 8px;

    position: relative;

    padding: 12px 16px;

    border: none;
    background: transparent;

    color: var(--color-text-secondary);
    font-size: var(--font-size-body, 16px);
    font-weight: var(--font-weight-medium);

    cursor: pointer;

    transition:
      color var(--transition),
      background-color var(--transition);

    &:hover:not(&--disabled) {
      color: var(--color-text-primary);
    }

    // .view-toggle__tab--active
    &--active {
      color: var(--color-text-primary);

      &::after {
        content: '';

        position: absolute;
        left: 16px;
        right: 16px;
        bottom: -2px;

        height: 2px;

        border-radius: 999px;
        background: var(--color-primary);
      }
    }

    // .view-toggle__tab--disabled
    &--disabled {
      cursor: default;
      opacity: 0.6;
    }
  }

  // .view-toggle__actions
  &__actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  // .view-toggle__action
  &__action {
    display: flex;
    align-items: center;
    gap: 4px;

    padding: 4px;

    // border: 1px solid var(--color-border);
    border-radius: var(--radius-md);

    background: var(--color-surface);

    color: var(--color-text-secondary);
    font-size: var(--font-size-body, 14px);
    font-weight: var(--font-weight-medium);

    cursor: pointer;

    transition:
      background-color var(--transition),
      border-color var(--transition),
      color var(--transition);

    &:hover {
      background: var(--color-surface-hover);
      color: var(--color-text-primary);
    }
  }
}

.view-toggle__dropdown {
  position: relative;
}

.view-toggle__dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;

  width: 180px;

  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgb(0 0 0 / 10%);
  overflow: hidden;
  z-index: 10;
}

.view-toggle__dropdown-item {
  width: 100%;
  padding: 10px 14px;

  display: flex;
  align-items: center;

  background: none;
  border: none;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: var(--color-muted-bg);
  }
}
</style>
