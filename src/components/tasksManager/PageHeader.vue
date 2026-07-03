<script setup lang="ts">
import type { User } from '@/BLL/taskManager/types'
import { getInitials } from '@/utils/avatar'
import { Share2, UserPlus } from '@lucide/vue'
import { computed } from 'vue'

const { title, description, members } = defineProps<{
  title: string
  description?: string
  members: User[]
}>()

// Returns the first four members to display as avatars
const visibleMembers = computed(() => members.slice(0, 4))

// Calculates the number of remaining members that are represented by +N avatar
const extraMembersCount = computed(() => Math.max(members.length - 4, 0))
</script>

<template>
  <div class="page-header">
    <div class="page-header__text">
      <h1 class="page-header__title">{{ title }}</h1>
      <p v-if="description" class="page-header__description">{{ description }}</p>
    </div>

    <div class="page-header__actions">
      <div v-if="members.length" class="page-header__avatars">
        <div v-for="member in visibleMembers" :key="member.name" class="page-header__avatar">
          <img v-if="member.avatar" :src="member.avatar" :alt="member.name" />
          <span v-else class="page-header__avatar-initials">
            {{ getInitials(member.name) }}
          </span>
        </div>
        <div v-if="extraMembersCount > 0" class="page-header__avatar page-header__avatar--extra">
          +{{ extraMembersCount }}
        </div>
      </div>

      <button class="page-header__btn page-header__btn--primary" type="button">
        <UserPlus :size="12" /> Invite Member
      </button>
      <button class="page-header__btn page-header__btn--secondary" type="button">
        <Share2 :size="16" />
        Share
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);

  // .page-header__text
  &__text {
    min-width: 0;
  }

  // .page-header__title
  &__title {
    margin: 0;
    color: var(--color-text);
    font-size: var(--font-size-page-title);
    font-weight: var(--font-weight-bold);
  }

  // .page-header__description
  &r__description {
    margin: var(--spacing-xs) 0 0;
    color: var(--color-text-secondary);
    font-size: var(--font-size-card-title);
    font-weight: var(--font-weight-regular);
  }

  // .page-header__actions
  &__actions {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: var(--spacing-lg);
  }

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
    width: 32px;
    height: 32px;
    margin-left: -8px;
    border: 2px solid var(--color-surface);
    border-radius: var(--radius-full);
    background: var(--color-surface-secondary);
    overflow: hidden;

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
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      color: #5c5c5c;
      font-size: 11px;
      font-weight: var(--font-weight-semibold);
    }

    // .page-header__avatar--extra
    &--extra {
      color: var(--color-text-secondary);
      font-size: var(--font-size-meta);
      font-weight: var(--font-weight-semibold);
      background: var(--color-surface-secondary);
    }
  }

  // .page-header__btn
  &__btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--radius-sm);
    font-family: inherit;
    font-size: var(--font-size-card-body);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition:
      background var(--transition),
      border-color var(--transition);
    white-space: nowrap;

    // .page-header__btn--primary
    &--primary {
      border: 1px solid var(--color-primary);
      background: var(--color-primary);
      color: var(--color-surface);

      &:hover {
        background: var(--color-primary-hover);
        border-color: var(--color-primary-hover);
      }
    }

    // .page-header__btn--secondary
    &--secondary {
      border: 1px solid var(--color-border);
      background: var(--color-surface);
      color: var(--color-text);

      &:hover {
        background: var(--color-hover);
      }
    }
  }
}
</style>
