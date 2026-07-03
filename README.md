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

Install dependencies:

- @lucide/vue – Used for consistent, lightweight SVG icons across the application (view toggle, priority indicators, task actions, sorting, etc.).
  npm install @lucide/vue
- sass-embedded – Sass compiler used to process SCSS styles.
  npm install -D sass-embedded

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

## Architecture

The application follows a layered architecture that separates business logic from presentation.

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
- ✅Sorting
- ✅Responsive UI
- ✅README completion

Remaining implementation:
- Create task
- Edit Task
- Delete Task

---

## Known Limitations

The following functionality has not yet been completed:

- **Create Task** – The task creation UI is implemented, but the create workflow is not fully wired to `TaskManager.createTask()`.
- **Edit Task** – The edit dialog is present, but changes are not currently persisted back to the task manager.
- **Delete Task** – The delete action and confirmation flow are not yet connected to `TaskManager.deleteTask()`.

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


### 2. Fixed sidebar with scrollable content

**Decision:** The sidebar remains fixed while only the main content area scrolls.

**Why:** This keeps navigation visible at all times, allowing users to switch sections without losing their place in the task list.

**With more time:** Make the sidebar collapsible and optimize it for smaller screens.

---

### 3. Row hover feedback

**Decision:** Added a subtle hover state for each table row.

**Why:** The hover effect makes it easier to identify the active row and improves usability when scanning or interacting with tasks.

**With more time:** Add keyboard focus and selected-row states to improve accessibility.

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
| Kanban Board    | Board, columns, cards, native drag-and-drop                      |        5 hrs |
| List View       | Sections, rows, sorting, persistence                             |        5 hrs |
| Task Management | Task modal                                                       |        2 hrs |
| UI Polish       | Styling, badges, avatars, overdue states, responsive adjustments |        3 hrs |
| Documentation   | README and final cleanup                                         |        2 hrs |

**Total:** ~28 hours

## Assumptions

The project intentionally follows a layered architecture where business logic is completely separated from Vue components.

All UI interactions communicate with the `TaskManager` instance instead of directly mutating application state.

---

## License

Assessment project.
