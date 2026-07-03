<script setup lang="ts">
import { Bell, ArrowLeft, CircleHelp, Search } from '@lucide/vue'
import type { BreadcrumbItem } from '@/BLL/taskManager/types'

const { items } = defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<template>
  <div class="page-breadcrumb">
    <div class="page-breadcrumb__trail">
      <button class="page-breadcrumb__back" type="button" aria-label="Go back">
        <ArrowLeft :size="20" />
      </button>

      <nav class="page-breadcrumb__nav" aria-label="Breadcrumb">
        <template v-for="(item, index) in items" :key="item.label">
          <span
            class="page-breadcrumb__crumb"
            :class="{ 'page-breadcrumb__crumb--current': index === items.length - 1 }"
          >
            {{ item.label }}
          </span>
          <span v-if="index < items.length - 1" class="page-breadcrumb__separator">›</span>
        </template>
      </nav>
    </div>

    <div class="page-breadcrumb__actions">
      <label class="page-breadcrumb__search">
        <Search :size="16" class="page-breadcrumb__search-icon" />
        <input type="text" placeholder="Search" class="page-breadcrumb__search-input" />
        <span class="page-breadcrumb__shortcut">⌘F</span>
      </label>

      <button class="page-breadcrumb__icon-btn" type="button" aria-label="Help">
        <CircleHelp :size="16" />
      </button>

      <button class="page-breadcrumb__icon-btn" type="button" aria-label="Notifications">
        <Bell :size="16" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-breadcrumb {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  box-shadow: 0px 1px 3px -1px rgba(0, 0, 0, 0.1);

  // .page-breadcrumb__trail
  &__trail {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    min-width: 0;
  }

  // .page-breadcrumb__back
  &__back {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition:
      background-color var(--transition),
      color var(--transition);

    // .page-breadcrumb__back:hover
    &:hover {
      background: var(--color-hover);
    }
  }

  // .page-breadcrumb__nav
  &__nav {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    overflow: hidden;
  }

  // .page-breadcrumb__crumb
  &__crumb {
    overflow: hidden;
    color: var(--color-text-secondary);
    font-size: var(--font-size-card-body);
    font-weight: var(--font-weight-regular);
    text-overflow: ellipsis;
    white-space: nowrap;

    // .page-breadcrumb__crumb--current
    &--current {
      color: var(--color-text);
      font-weight: var(--font-weight-semibold);
    }
  }

  // .page-breadcrumb__separator
  &__separator {
    color: var(--color-text-secondary);
    font-size: var(--font-size-card-body);
  }

  // .page-breadcrumb__actions
  &__actions {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: var(--spacing-sm);
  }

  // .page-breadcrumb__search
  &__search {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    width: 260px;
    padding: var(--spacing-sm) var(--spacing-md);
    margin-right: var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    cursor: text;
    transition: border-color var(--transition);

    // .page-breadcrumb__search:focus-within
    &:focus-within {
      border-color: var(--color-primary);
    }

    // .page-breadcrumb__search::after
    &::after {
      content: '';
      height: 24px;
      width: 1px;
      display: block;
      background-color: var(--color-border);
      position: absolute;
      right: -12px;
    }
  }

  // .page-breadcrumb__search-icon
  &__search-icon {
    flex-shrink: 0;
    color: var(--color-text-secondary);
  }

  // .page-breadcrumb__search-input
  &__search-input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: var(--color-text);
    font-family: inherit;
    font-size: var(--font-size-card-body);

    // .page-breadcrumb__search-input::placeholder
    &::placeholder {
      color: var(--color-text-secondary);
    }
  }

  // .page-breadcrumb__shortcut
  &__shortcut {
    flex-shrink: 0;
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    color: var(--color-text-secondary);
    font-size: 12px;
    font-weight: var(--font-weight-medium);
  }

  // .page-breadcrumb__icon-btn
  &__icon-btn {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: background var(--transition);

    // .page-breadcrumb__icon-btn:hover
    &:hover {
      background: var(--color-hover);
    }
  }
}
</style>
