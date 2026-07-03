import type { Task, User } from './types'

/**
 * Mock tasks used to initialize the TaskManager.
 *
 * The data represents a realistic sprint backlog for an
 * e-commerce web application and covers all UI states
 * required by the assessment.
 */

export const mockTasks: Task[] = [
  // --------------------------
  // DONE
  // --------------------------
  {
    id: '1',
    title: 'Set up project structure',
    description: 'Initialize the project with routing, TypeScript and folder structure.',
    priority: 'high',
    dueDate: '2026-06-15',
    assigneeId: 'u1',
    assignees: ['u1', 'u2', 'u3'],
    status: 'done',
    tags: ['setup', 'frontend'],
    createdAt: '2026-06-10',
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Develop login and registration functionality with form validation.',
    priority: 'high',
    dueDate: '2026-06-18',
    assigneeId: 'u2',
    assignees: ['u1', 'u2', 'u3'],
    status: 'done',
    tags: ['auth', 'frontend'],
    createdAt: '2026-06-11',
  },
  {
    id: '3',
    title: 'Design database schema',
    description: 'Create the database structure for users, products and orders.',
    priority: 'medium',
    dueDate: '2026-06-20',
    assigneeId: 'u3',
    assignees: ['u1', 'u2', 'u3'],
    status: 'done',
    tags: ['backend', 'database'],
    createdAt: '2026-06-12',
  },
  {
    id: '4',
    title: 'Build product listing page',
    description: 'Display products with category filters and pagination.',
    priority: 'medium',
    dueDate: '2026-06-22',
    assigneeId: 'u4',
    assignees: ['u4', 'u1'],
    status: 'done',
    tags: ['frontend', 'ui'],
    createdAt: '2026-06-13',
  },
  {
    id: '5',
    title: 'Create user profile page',
    description: 'Allow users to manage their account information.',
    priority: 'low',
    dueDate: '2026-06-24',
    assigneeId: 'u1',
    assignees: ['u4', 'u1'],
    status: 'done',
    tags: ['profile', 'frontend'],
    createdAt: '2026-06-14',
  },

  // --------------------------
  // IN PROGRESS
  // --------------------------

  {
    id: '6',
    title: 'Implement shopping cart',
    description: 'Support adding, updating and removing products from the cart.',
    priority: 'high',
    dueDate: '2026-06-28',
    assigneeId: 'u2',
    assignees: ['u2', 'u1', 'u5'],
    status: 'in-progress',
    tags: ['cart', 'frontend'],
    createdAt: '2026-06-25',
  },
  {
    id: '7',
    title: 'Integrate payment gateway',
    description: 'Connect payment gateway APIs for secure checkout.',
    priority: 'high',
    dueDate: '2026-06-29',
    assigneeId: 'u3',
    assignees: ['u3', 'u4', 'u5'],
    status: 'in-progress',
    tags: ['payments', 'backend'],
    createdAt: '2026-06-25',
  },
  {
    id: '8',
    title: 'Develop order management',
    description: 'Create APIs to process and manage customer orders.',
    priority: 'medium',
    dueDate: '2026-07-04',
    assigneeId: 'u4',
    assignees: ['u4', 'u5', 'u2'],
    status: 'in-progress',
    tags: ['orders', 'api'],
    createdAt: '2026-06-26',
  },
  {
    id: '9',
    title: 'Synchronize inventory',
    description: 'Keep inventory updated after every successful purchase.',
    priority: 'medium',
    dueDate: '2026-06-30',
    assigneeId: 'u1',
    assignees: ['u1', 'u2'],
    status: 'in-progress',
    tags: ['inventory', 'backend'],
    createdAt: '2026-06-27',
  },
  {
    id: '10',
    title: 'Optimize product search',
    description: 'Improve search speed and filtering experience.',
    priority: 'low',
    dueDate: '2026-06-27',
    assigneeId: 'u2',
    assignees: ['u1', 'u2'],
    status: 'in-progress',
    tags: ['search', 'performance'],
    createdAt: '2026-06-27',
  },

  // --------------------------
  // TODO
  // --------------------------

  {
    id: '11',
    title: 'Add wishlist feature',
    description: 'Allow users to save products for future purchases.',
    priority: 'high',
    dueDate: '2026-06-29',
    assigneeId: 'u3',
    assignees: ['u1', 'u2', 'u4'],
    status: 'todo',
    tags: ['wishlist', 'frontend'],
    createdAt: '2026-07-01',
  },
  {
    id: '12',
    title: 'Send email notifications',
    description: 'Notify users about order confirmation and shipment updates.',
    priority: 'medium',
    dueDate: '2026-07-10',
    assigneeId: 'u4',
    assignees: ['u4'],
    status: 'todo',
    tags: ['email', 'backend'],
    createdAt: '2026-07-01',
  },
  {
    id: '13',
    title: 'Generate sales reports',
    description: 'Create reports to track revenue and product performance.',
    priority: 'low',
    dueDate: '2026-07-12',
    assigneeId: 'u1',
    assignees: ['u1', 'u2'],
    status: 'todo',
    tags: ['reports', 'analytics'],
    createdAt: '2026-07-01',
  },
  {
    id: '14',
    title: 'Implement customer reviews',
    description: 'Allow customers to rate and review purchased products.',
    priority: 'medium',
    dueDate: '2026-07-15',
    assigneeId: 'u2',
    assignees: ['u2', 'u1', 'u4'],
    status: 'todo',
    tags: ['reviews', 'frontend'],
    createdAt: '2026-07-01',
  },
  {
    id: '15',
    title: 'Improve responsive layout',
    description: 'Enhance the user experience across tablet and desktop devices.',
    priority: 'low',
    dueDate: '2026-06-26',
    assigneeId: 'u3',
    assignees: ['u2', 'u3', 'u4'],
    status: 'todo',
    tags: ['responsive', 'ui'],
    createdAt: '2026-07-01',
  },
]

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    avatar: 'https://i.pravatar.cc/100?img=1',
    isLoggedIn: false,
  },
  {
    id: 'u2',
    name: 'Liam Carter',
    email: 'liam.carter@example.com',
    avatar: 'https://i.pravatar.cc/100?img=2',
    isLoggedIn: false,
  },
  {
    id: 'u3',
    name: 'Olivia Davis',
    email: 'olivia.davis@example.com',
    avatar: '', // https://i.pravatar.cc/100?img=3
    isLoggedIn: false,
  },
  {
    id: 'u4',
    name: 'Noah Anderson',
    email: 'noah.anderson@example.com',
    avatar: 'https://i.pravatar.cc/100?img=4',
    isLoggedIn: false,
  },
  {
    id: 'u5',
    name: 'Davis Donon',
    email: 'daviddoni@gmail.com',
    avatar: 'https://i.pravatar.cc/100?img=12',
    isLoggedIn: true,
  },
  {
    id: 'u6',
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    avatar: 'https://i.pravatar.cc/100?img=5',
    isLoggedIn: false,
  },
]
