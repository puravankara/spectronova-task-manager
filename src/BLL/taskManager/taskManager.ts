import { mockTasks } from './mockData'
import { mockUsers } from './mockData'
import type {
  Task,
  TaskStatus,
  TaskPriority,
  SortField,
  SortDirection,
  StatusGroup,
  PriorityMeta,
  User,
} from './types'

/**
 * Handles all the task related operations.
 *
 * Components should interact with this class instead of
 * modifying task data directly.
 */

export class TaskManager {
  // Stores all the tasks managed by the application.
  private tasks: Task[]

  constructor(tasks: Task[] = mockTasks) {
    // initialize the task manager with the default mock data
    this.tasks = [...tasks]
  }

  // returns all the available tasks
  getTasks(): Task[] {
    return this.tasks
  }

  // returns a task matching the given id
  getTaskById(id: string): Task | undefined {
    return this.tasks.find((task) => task.id === id)
  }

  // returns all the tasks of given status
  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasks.filter((task) => task.status === status)
  }

  getSortedTasks(status: TaskStatus, field: SortField, direction: SortDirection): Task[] {
    const tasks = [...this.getTasksByStatus(status)]

    if (field === 'dueDate') {
      tasks.sort((a, b) => {
        const result = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()

        return direction === 'asc' ? result : -result
      })
    }

    if (field === 'priority') {
      const priorityOrder = {
        high: 3,
        medium: 2,
        low: 1,
      }

      tasks.sort((a, b) => {
        const result = priorityOrder[b.priority] - priorityOrder[a.priority]

        return direction === 'asc' ? result : -result
      })
    }

    return tasks
  }

  // Creates a new task and adds it to the task list.
  createTask(task: Omit<Task, 'id' | 'createdAt'>): Task {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }

    this.tasks.push(newTask)

    return newTask
  }

  //   update an existing task
  updateTask(id: string, update: Partial<Omit<Task, 'id' | 'createdAt'>>): boolean {
    const task = this.tasks.find((task) => task.id === id)
    // task not found
    if (!task) return false

    Object.assign(task, update)

    // task was found and updated successfully.
    return true
  }

  // delete an existing task
  deleteTask(id: string): boolean {
    const index = this.tasks.findIndex((task) => task.id === id)

    if (index === -1) return false

    this.tasks.splice(index, 1)
    return true
  }

  moveTo(taskId: string, status: TaskStatus): void {
    const task = this.tasks.find((task) => task.id === taskId)

    if (!task || task.status === status) {
      return
    }

    this.updateTask(taskId, { status })
  }

  private users = mockUsers
  getUser(userId: string) {
    return this.users.find((user) => user.id === userId)
  }

  // returns every user, e.g. to populate an assignee picker
  getUsers(): User[] {
    return this.users
  }

  getAssignees(assigneeIds: string[]): User[] {
    return assigneeIds
      .map((id) => this.users.find((user) => user.id == id))
      .filter((user) => user !== undefined)
  }

  getLoggedInUser() {
    return this.users.find((user) => user.isLoggedIn)
  }

  private columns: StatusGroup[] = [
    {
      title: 'To do',
      status: 'todo',
      color: 'var(--status-todo)',
    },
    {
      title: 'In Progress',
      status: 'in-progress',
      color: 'var(--status-progress)',
    },
    {
      title: 'Done',
      status: 'done',
      color: 'var(--status-done)',
    },
  ]

  getCloumns(): StatusGroup[] {
    return this.columns
  }

  // Returns a column object of type StatusGroup
  getStatusGroup(status: TaskStatus): StatusGroup {
    return this.columns.find((group) => group.status === status)!
  }

  private priorities: PriorityMeta[] = [
    {
      priority: 'high',
      label: 'High',
      color: 'var(--priority-high-text)',
    },
    {
      priority: 'medium',
      label: 'Medium',
      color: 'var(--priority-medium-text)',
    },
    {
      priority: 'low',
      label: 'Low',
      color: 'var(--priority-low-text)',
    },
  ]

  getPriorities() {
    return this.priorities
  }

  getPriority(priority: TaskPriority): PriorityMeta {
    return this.priorities.find((item) => item.priority === priority)!
  }
}
