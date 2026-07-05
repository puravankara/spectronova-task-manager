# Task Manager

Production-quality Task Manager built as part of a Frontend Engineer assessment.

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Vue Router
- ESLint
- Prettier

## Development Environment

- OS: Windows 11
- Node.js: v24.18.0
- npm: v11.6.0
- Vue: v3.5.38
- Vite: v8.0.16
- TypeScript: v6.0.0

## Project Setup

### Install dependencies

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Format:

```bash
npm run format
```

### Key Dependencies

- **Vue 3** – UI framework using the Composition API.
- **Vue Router** – Client-side routing.
- **TypeScript** – Static type checking.
- **Lucide Vue** – Lightweight SVG icon library.
- **Sass** – Component-scoped styling with SCSS.
- **ESLint & Prettier** – Code quality and formatting.

---

## Repository Branches

The repository contains two branches:

- **main** – Snapshot of the project at the end of the official assessment timeframe. No further changes have been made to this branch after the submission deadline.
- **dev** – Active development branch containing the latest enhancements and refinements, including:
  - Create, edit, and delete task workflows
  - Inline form validation
  - Lead and team assignment
  - UI improvements and bug fixes
  - Additional code cleanup and refactoring

> **Note:** The **main** branch represents the assessment submission, while **dev** contains post-submission improvements and the most up-to-date version of the project.

---

## Project Structure

```
src/
├── BLL/
│   └── taskManager/
│       ├── types.ts
│       ├── mockData.ts
│       └── TaskManager.ts
│
├── components/
│   └── taskManager/
│
├── pages/
│   └── taskManager/
│       └── index.vue
│
├── router/
│   └── index.ts
│
├── assets/
├── App.vue
└── main.ts
```

---

## Architecture Overview

### Why `TaskManager` is structured as a class

- **Single source of truth for task/user data.** Components query and mutate state exclusively through `TaskManager` methods (`getTasks`, `createTask`, `updateTask`, `moveTo`, etc.) instead of touching arrays directly. This keeps id generation, timestamping, and status-change logic in one place instead of duplicated across components.
- **Framework-agnostic core.** Because it's a plain TypeScript class with no Vue imports, the data layer is decoupled from the view layer. It can be unit-tested without mounting components, and could in theory be reused outside Vue (or wrapped by a Pinia store) without rewriting the logic.
- **Constructor injection for testability.** `constructor(tasks: Task[] = mockTasks)` allows tests or Storybook stories to instantiate `TaskManager` with controlled fixtures instead of always hitting the shared mock dataset.
- **Derived views over stored views.** Sorting/filtering (`getSortedTasks`, `getTasksByStatus`) are computed on read rather than cached, so there's no separate "sorted state" to keep in sync with the underlying `tasks` array — one array is always the source of truth.

### Trade-offs

| Decision                                                   | Benefit                               | Cost                                                                                                                                                                         |
| ---------------------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plain class, not a Pinia store                             | Framework-agnostic, easy to unit test | No built-in reactivity — a Vue component holding a `TaskManager` instance needs to wrap it in `reactive()`/`ref()` itself, or changes won't trigger re-renders automatically |
| `users` hardcoded to `mockUsers`, no constructor injection | One less parameter to wire up         | Inconsistent with `tasks` injection                                                                                                                                          |
| Sort logic keyed by a hardcoded `priorityOrder` map        | Simple and explicit                   | Duplicates ordering already implied by the `priorities` array — the two can drift out of sync if one is reordered and not the other                                          |

### Business Logic Layer (BLL)

All application logic is encapsulated inside the `TaskManager` class.

Responsibilities include:

- Loading mock data
- CRUD operations
- Task filtering
- Sorting
- Drag-and-drop updates
- Validation
- Business rules

Vue components never manipulate task data directly. Every operation flows through the `TaskManager` class.

This approach keeps the business logic framework-independent and easy to maintain.

---

## Why Vue instead of Nuxt?

The assessment document references a `pages/taskManager/index.vue` structure, which closely resembles Nuxt's file-based routing.

I chose Vue 3 with Vue Router because:

- It demonstrates explicit routing knowledge.
- It keeps the project lightweight.
- The architecture remains framework-independent.
- Migrating to Nuxt later would require minimal changes since all business logic lives inside the `TaskManager` class.

The only framework-specific code is routing. Components and business logic remain reusable.

---

## Routing

Vue Router is used to map:

```
/taskManager
```

to

```
src/pages/taskManager/index.vue
```

---

## Code Quality

The project uses:

- TypeScript
- ESLint
- Prettier

Goals:

- Zero `any` usage
- Strong typing
- Consistent formatting
- Maintainable code

---

## Current Status

- ✅ Vue project initialized
- ✅ TypeScript configured
- ✅ Vue Router configured
- ✅ ESLint configured
- ✅ Prettier configured
- ✅ TaskManager business layer
- ✅ Mock data
- ✅ Kanban board
- ✅ List view
- ✅ Drag and Drop
- ✅ Show modal
- ✅ Sorting
- ✅ Responsive UI
- ✅ README completion
- ✅ Create task
- ✅ Edit Task
- ✅ Delete Task
- ✅ Validation (Title and Description)

---

## Features

### Kanban Board

- Three-column Kanban board (Todo, In Progress, Done)
- Native HTML5 drag-and-drop
- Empty states
- Overdue indicators
- Priority badges

### List View

- Sort by due date
- Sort by priority
- Persistent view selection

## Data Model

The original assessment defines a single assignee field.

To better support the provided modal design, the model was extended to separate ownership from collaboration.

```ts
interface Task {
  ...

  assigneeId: string
  assignees: string[]

  ...
}
```

## Known Limitations

### Drag and Drop in List View

Drag-and-drop is supported only in the Kanban board. The List view is intended as a sortable overview rather than an interactive board.

### Empty Kanban Columns

When all tasks are moved out of a column, new tasks cannot currently be dropped into that empty column because there is no drop target rendered. This could be addressed by making the empty state itself a valid drop zone.

### Fixed Workflow Statuses

The application uses three predefined statuses: **Todo**, **In Progress**, and **Done**. Creating, renaming, or deleting workflow columns is not currently supported.

### Filtering and Grouping

Priority and assignee filtering, as well as grouping options, were not implemented within the assessment timeframe. The architecture has been designed so these features can be added through additional `TaskManager` methods without changing the component hierarchy.

### Row Selection Checkbox

The list view includes a checkbox for each task row to match the design reference. However, the assessment does not specify its intended behaviour (for example, bulk selection or batch actions), so it is currently presented as a visual element only.

### Responsive Behaviour

The application has been optimized for the required minimum viewport width of **1280px**. A dedicated mobile or tablet layout has not been implemented.

### Mock Data Persistence

The application operates entirely on mock data loaded into memory. Changes are not persisted across page refreshes. In a production environment, the `TaskManager` would communicate with a backend service or persistence layer.

### Automated Testing

Due to the assessment timeframe, automated unit and component tests were not implemented. The `TaskManager` class would be the primary focus for unit testing because it encapsulates the application's business logic independently of the Vue components.

### Row Checkbox

The design includes a checkbox for each list row, but its intended behaviour is not specified.

Rather than guessing whether it represents bulk selection, task completion, or another interaction, it is currently left as a visual placeholder.

---

### Responsive Behaviour

Testing focused on the required minimum width of **1280px**.

Layouts below tablet width were intentionally not implemented.

---

### Mock Data

All application data is loaded from mock data.

No backend persistence has been implemented.

---

### Automated Testing

Unit and component tests were not implemented within the assessment time window.

Given additional time, `TaskManager` would be the primary target for unit testing due to its isolated business logic.

---

### Design decisions

### 1. Chose the Design That Stood Out the Most

**Decision:** The design reference included multiple variations of the same page. I chose the version that stood out the most, with a clearer visual hierarchy, better spacing, and a more polished overall layout.

**Why:** It provided the best balance between usability and aesthetics, making the task list easier to scan while keeping the interface clean and focused.

**With more time:** I would compare elements from the other design variations through usability testing and incorporate the strongest ideas into a more refined final design.

### 2. Lead and Team Assignment

**Decision:** The original assessment model used a single `assignee` field. I extended the model to separate the **Lead** (person accountable for the task) from the **Team** (collaborators working on the task).

**Why:** In real-world project management, ownership and collaboration are different concepts. Separating them makes responsibilities clearer while allowing multiple team members to contribute to the same task. To maintain data consistency, the selected lead is automatically included in the assigned team.

**With more time:** I would introduce roles such as Reviewer and Watcher, add search and grouping to the user picker, and integrate permission-based assignment rules backed by a real user management system.

### 3. Avatar-Based Team Representation

**Decision:** Team members are represented by avatars rather than displaying a list of names.

**Why:** Avatars make the interface easier to scan and reduce visual clutter while still providing immediate recognition of assigned team members.

**With more time:** I would add overflow handling (for example, "+3"), tooltips, and online presence indicators.

---

These three read well in a README because they explain **what you chose, why you chose it, and how you'd improve it**, which is exactly what reviewers typically look for.

### Future Improvements

- Introduce a table density toggle (Compact/Comfortable) to accommodate different user preferences.
- Implement a dedicated mobile card layout to improve the experience on smaller screens.
- Allow users to customize visible columns and their order for a more personalized workflow.

## Time Log

| Phase           | Activity                                                         | Approx. Time |
| --------------- | ---------------------------------------------------------------- | -----------: |
| Setup           | Project scaffold, types, mock data, `TaskManager` skeleton       |        3 hrs |
| Business Logic  | CRUD, filtering, sorting, bug fixes                              |        8 hrs |
| Kanban Board    | Board, columns, cards, native drag-and-drop                      |        6 hrs |
| List View       | Sections, rows, sorting, persistence                             |        5 hrs |
| Task Management | Task modal & CRUD                                                |        7 hrs |
| UI Polish       | Styling, badges, avatars, overdue states, responsive adjustments |        4 hrs |
| Documentation   | README and final cleanup                                         |        3 hrs |

**Total:** ~36 hours

## Assumptions

The assessment's original data model contained a single assignee field.

Because the supplied design presented a richer assignment experience, the model was extended with:

- assigneeId (Lead)
- assignees (Team)

This was done to better represent ownership and collaboration while keeping all business logic inside TaskManager.

---

## License

Assessment project.
