<script setup lang="ts">
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  CircleHelp,
  FileText,
  Inbox,
  MoreVertical,
  Plus,
  Settings,
  Users,
} from '@lucide/vue'

import type { User, SidebarNavigationItem } from '@/BLL/taskManager/types'

const { user } = defineProps<{
  user: User | undefined
}>()

const menuItems: SidebarNavigationItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Inbox',
    icon: Inbox,
  },
  {
    label: 'Calendar',
    icon: Calendar,
  },
]

const teamSpaceItems: SidebarNavigationItem[] = [
  {
    label: 'Tasks',
    icon: CheckSquare,
    active: true,
  },
  {
    label: 'Docs',
    icon: FileText,
  },
  {
    label: 'Meeting',
    icon: Users,
  },
]

const otherItems: SidebarNavigationItem[] = [
  {
    label: 'Settings',
    icon: Settings,
  },
  {
    label: 'Support',
    icon: CircleHelp,
  },
]
</script>

<template>
  <aside class="sidebar">
    <!-- User -->
    <div v-if="user" class="sidebar__user">
      <div class="sidebar__avatar">
        <img :src="user.avatar" alt="user" />
      </div>

      <div class="sidebar__user-info">
        <p class="sidebar__user-name">{{ user.name }}</p>
        <p class="sidebar__user-email">{{ user.email }}</p>
      </div>

      <button class="sidebar__icon-btn" type="button" aria-label="More options">
        <MoreVertical :size="18" />
      </button>
    </div>

    <nav class="sidebar__nav">
      <!-- Menu -->
      <section class="sidebar__section">
        <div class="sidebar__section-header">
          <h2 class="sidebar__section-label">Menu</h2>
        </div>

        <ul class="sidebar__list">
          <li v-for="item in menuItems" :key="item.label">
            <button
              type="button"
              class="sidebar__item"
              :class="{ 'sidebar__item--active': item.active }"
            >
              <component :is="item.icon" :size="18" class="sidebar__item-icon" />

              <span class="sidebar__item-label">
                {{ item.label }}
              </span>
            </button>
          </li>
        </ul>
      </section>

      <!-- Team Spaces -->
      <section class="sidebar__section">
        <div class="sidebar__section-header">
          <h2 class="sidebar__section-label">Team Spaces</h2>

          <button
            type="button"
            class="sidebar__icon-btn sidebar__icon-btn--sm"
            aria-label="Add team space"
          >
            <Plus :size="14" />
          </button>
        </div>

        <ul class="sidebar__list">
          <li v-for="item in teamSpaceItems" :key="item.label">
            <button
              type="button"
              class="sidebar__item"
              :class="{ 'sidebar__item--active': item.active }"
            >
              <component :is="item.icon" :size="18" class="sidebar__item-icon" />

              <span class="sidebar__item-label">
                {{ item.label }}
              </span>
            </button>
          </li>
        </ul>
      </section>

      <!-- Other -->
      <section class="sidebar__section">
        <div class="sidebar__section-header">
          <h2 class="sidebar__section-label">Other</h2>
        </div>

        <ul class="sidebar__list">
          <li v-for="item in otherItems" :key="item.label">
            <button
              type="button"
              class="sidebar__item"
              :class="{ 'sidebar__item--active': item.active }"
            >
              <component :is="item.icon" :size="18" class="sidebar__item-icon" />

              <span class="sidebar__item-label">
                {{ item.label }}
              </span>
            </button>
          </li>
        </ul>
      </section>
    </nav>
  </aside>
</template>

<style scoped lang="scss">
.sidebar {
  display: flex;
  flex-direction: column;
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--color-page);
  border-right: 1px solid var(--color-border);
  font-family: var(--font-family);
  overflow-y: auto;
  padding: 16px 0;

  // .sidebar__section
  &__section {
    border-bottom: 1px solid #ddd;
    padding: 8px 0px;
  }

  // .sidebar__user
  &__user {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 8px;
    max-width: 90%;
    margin: auto;
  }

  // .sidebar__avatar
  &__avatar {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    background: var(--color-primary-soft);
    color: var(--color-primary);
    font-size: var(--font-size-card-body);
    font-weight: var(--font-weight-semibold);
    overflow: hidden;
  }

  // .sidebar__user-info
  &__user-info {
    min-width: 0;
    flex: 1;
  }

  // .sidebar__user-name
  &__user-name {
    margin: 0;
    overflow: hidden;
    color: var(--color-text);
    font-size: var(--font-size-card-title);
    font-weight: var(--font-weight-semibold);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // .sidebar__user-email
  &__user-email {
    margin: 2px 0 0;
    overflow: hidden;
    color: var(--color-text-secondary);
    font-size: var(--font-size-meta);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // .sidebar__icon-btn
  &__icon-btn {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: background var(--transition);

    &:hover {
      background: var(--color-hover);
    }

    &--sm {
      width: 20px;
      height: 20px;
    }
  }

  // .sidebar__nav
  &__nav {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 0 var(--spacing-lg) var(--spacing-xl);
  }

  // .sidebar__section-label
  &__section-label {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: var(--font-size-meta);
    font-weight: var(--font-weight-medium);
  }

  // .sidebar__section-header
  &__section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-sm) var(--spacing-md);
  }

  // .sidebar__list
  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  // .sidebar__item
  &__item {
    width: 100%;
    border: 0;
    background: transparent;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    color: var(--color-text);
    font-size: var(--font-size-card-title);
    font-weight: var(--font-weight-medium);
    text-decoration: none;
    transition:
      background var(--transition),
      color var(--transition);

    // .sidebar__item:hover
    &:hover {
      background: var(--color-hover);
    }

    // .sidebar__item-icon
    &-icon {
      flex-shrink: 0;
      color: #6f6f6f;
    }

    // .sidebar__item-label
    &-label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    // .sidebar__item--active
    &--active {
      background: var(--color-primary-active);
      border-color: #ddd;

      .sidebar__item-icon {
        color: var(--color-primary);
      }

      // .sidebar__item--active::before
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        width: 2px;
        height: 16px;
        border-radius: var(--radius-full);
        background: var(--color-primary);
        transform: translateY(-50%);
      }

      // .sidebar__item:hover
      &:hover {
        background: var(--color-primary-soft);
      }
    }
  }
}
</style>
