import type { LayoutDashboard } from '@lucide/vue'

// Represents the lifecycle stages of a task.
export type TaskStatus = 'todo' | 'in-progress' | 'done'

// Represents the available priority levels for a task.
export type TaskPriority = 'low' | 'medium' | 'high'

export type SortField = 'dueDate' | 'priority'

export type SortDirection = 'asc' | 'desc'

/**
 * Represents a single task in the task management system.
 */
export interface Task {
  id: string
  title: string
  description: string
  priority: TaskPriority
  dueDate: string
  assigneeId: string
  assignees: string[]
  status: TaskStatus
  tags: string[]
  createdAt: string
}

export interface TaskForm {
  id: string
  title: string
  description: string
  priority: TaskPriority
  dueDate: string
  assigneeId: string
  assignees: string[]
  status: TaskStatus
  tags: string[]
  createdAt: string
}

// Represents the filter criteria used to narrow down the visible tasks.
export interface TaskFilter {
  priority?: TaskPriority
  assigneeId?: string
}

export interface SidebarNavigationItem {
  label: string
  icon: typeof LayoutDashboard
  active?: boolean
}

/**
 * Represents a single user in the task management system.
 */
export interface User {
  id: string
  name: string
  email: string
  avatar: string
  isLoggedIn: boolean
}

export interface BreadcrumbItem {
  label: string
}

// Available views for the task manager.
export type ViewMode = 'overview' | 'board' | 'list' | 'table' | 'timeline'

export interface ViewTab {
  label: string
  icon: typeof LayoutDashboard | undefined
  value: ViewMode
  isEnabled: boolean
}

export interface StatusGroup {
  status: TaskStatus
  title: string
  color: string
}

export interface PriorityMeta {
  priority: string
  label: string
  color: string
}

// Identifies which bottom tab of the task slideout is active. Content for
// these tabs is not wired to real data yet, only the tab switching itself.
export type TaskModalTabValue = 'activity' | 'my-work' | 'assigned' | 'comments'

export interface TaskModalTab {
  label: string
  value: TaskModalTabValue
}

export interface FormErrors {
  title?: string
  description?: string
}
