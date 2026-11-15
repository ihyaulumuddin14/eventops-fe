# BCC EventOps — Frontend

**BCC EventOps** is an event management and operations platform designed to simplify event preparation and execution within BCC. The application provides event discovery, participant registration, committee management, event scheduling, attendance tracking, and real-time announcements in one integrated platform.

## 1. Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| Framework | Next.js 16 (App Router) | Application framework and routing |
| UI Library | React 19 | Component-based UI development |
| Language | TypeScript | Static typing |
| Styling | Tailwind CSS 4 | Utility-first styling |
| UI Components | shadcn/ui | Reusable UI components |
| Server State | TanStack Query | API data fetching and caching |
| Client State | Zustand | Global client-side state |
| Form Management | React Hook Form | Form handling |
| Validation | Zod | Schema-based validation |
| Animation | GSAP | Page transitions and interactive animations |
| Code Quality | Biome | Linting and formatting |
| Package Manager | pnpm | Dependency management |
| Containerization | Docker | Frontend containerization |
| CI/CD | GitHub Actions | Automated checks, builds, and deployment |

**Backend Integration:** REST API provided by the backend team, with WebSocket-based communication for real-time updates.

> Library versions and integrations should follow the final project configuration.

## 2. Architecture

This project uses a **Feature-Based Architecture** with Next.js App Router.

The application is organized around business domains rather than technical file types. Each feature encapsulates its own components, hooks, services, schemas, and types.

### Architectural Principles

- **Feature-Based Organization:** Group files by business functionality.
- **Separation of Concerns:** Separate routing, UI components, API services, and business logic.
- **Reusable Components:** Keep generic UI components independent from specific business features.
- **Server State Management:** Use TanStack Query to manage API data, caching, and mutations.
- **Client State Management:** Use Zustand only for shared client-side state.
- **Type Safety:** Use TypeScript and Zod to maintain consistent data structures and validation.
- **Role-Based Access:** Operational permissions are determined by a user's membership and role within a specific event.

### Application Layers

| Layer | Responsibility |
|---|---|
| `app/` | Routing, layouts, and page composition |
| `features/` | Business logic and feature-specific UI |
| `components/` | Shared UI and reusable components |
| `hooks/` | Shared React hooks |
| `lib/` | API clients and utility functions |
| `providers/` | Application-level context providers |
| `types/` | Shared TypeScript definitions |

## 3. Project Structure

The application uses the Next.js App Router architecture. Routes are organized using route groups to separate authentication pages from the main application.

### Current Application Structure

```text
src/
└── app/
    ├── favicon.ico
    ├── globals.css
    ├── layout.tsx
    ├── page.tsx
    │
    ├── (auth)/
    │   ├── login/
    │   │   └── page.tsx
    │   │
    │   └── register/
    │       └── page.tsx
    │
    └── (app)/
        ├── layout.tsx
        │
        ├── events/
        │   ├── page.tsx
        │   │
        │   ├── create/
        │   │   └── page.tsx
        │   │
        │   └── [eventId]/
        │       ├── page.tsx
        │       │
        │       ├── manage/
        │       │   ├── page.tsx
        │       │   │
        │       │   ├── announcements/
        │       │   │   └── page.tsx
        │       │   │
        │       │   ├── committee/
        │       │   │   └── page.tsx
        │       │   │
        │       │   ├── edit/
        │       │   │   └── page.tsx
        │       │   │
        │       │   └── sessions/
        │       │       ├── page.tsx
        │       │       │
        │       │       └── [sessionId]/
        │       │           └── edit/
        │       │               └── page.tsx
        │       │
        │       └── operations/
        │           ├── page.tsx
        │           │
        │           └── participants/
        │               └── page.tsx
        │
        ├── invitations/
        │   └── page.tsx
        │
        └── my-registrations/
            └── page.tsx
```

### Directory Responsibilities

| Directory | Responsibility |
|---|---|
| `app/` | Application routing, layouts, and page composition |
| `(auth)/` | Authentication-related pages, including login and registration |
| `(app)/` | Main application pages and authenticated application layout |
| `events/` | Event catalog, creation, details, and event management |
| `manage/` | Event administration and configuration |
| `sessions/` | Event session management |
| `announcements/` | Event announcement management |
| `committee/` | Committee member management |
| `operations/` | Event operational monitoring |
| `participants/` | Participant management and attendance operations |
| `invitations/` | Committee invitation management |
| `my-registrations/` | Personal event registration management |

### Feature Module Structure

Business logic and reusable feature-specific components should be organized separately from route definitions.

Example: `features/events/`

```text
features/
└── events/
    ├── components/
    │   ├── event-card.tsx
    │   ├── event-list.tsx
    │   ├── event-form.tsx
    │   └── event-filters.tsx
    │
    ├── hooks/
    │   ├── use-events.ts
    │   ├── use-event-detail.ts
    │   └── use-create-event.ts
    │
    ├── services/
    │   └── event-service.ts
    │
    ├── schemas/
    │   └── event-schema.ts
    │
    ├── types/
    │   └── event-types.ts
    │
    └── index.ts
```

Other shared application directories may include:

```text
src/
├── components/
│   ├── ui/
│   ├── layout/
│   └── shared/
│
├── hooks/
├── lib/
├── providers/
└── types/
```

Not every feature needs all directories. Modules should be organized according to actual implementation requirements.

---

## 4. Routing

The application uses **Next.js App Router** with route groups to organize authentication and main application pages.

### Application Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Application root page |
| `/login` | Login | User authentication |
| `/register` | Register | User account registration |
| `/events` | Event Catalog | Browse, search, and filter available events |
| `/events/create` | Create Event | Create a new event |
| `/events/[eventId]` | Event Detail | View event information and details |
| `/events/[eventId]/manage` | Event Management | Access event administration |
| `/events/[eventId]/manage/edit` | Edit Event | Update event information |
| `/events/[eventId]/manage/sessions` | Session Management | View and manage event sessions |
| `/events/[eventId]/manage/sessions/[sessionId]/edit` | Edit Session | Update an existing session |
| `/events/[eventId]/manage/announcements` | Announcement Management | Create, edit, and manage event announcements |
| `/events/[eventId]/manage/committee` | Committee Management | Manage committee members and invitations |
| `/events/[eventId]/operations` | Operations Dashboard | Monitor event operations and statistics |
| `/events/[eventId]/operations/participants` | Participant Management | View participants and manage attendance |
| `/my-registrations` | My Registrations | View personal event registrations |
| `/invitations` | My Invitations | View and manage committee invitations |

### Dynamic Routes

The application uses dynamic route segments to identify specific events and sessions.

| Dynamic Segment | Purpose |
|---|---|
| `[eventId]` | Identifies a specific event |
| `[sessionId]` | Identifies a specific session within an event |

For example:

```text
/events/123
/events/123/manage
/events/123/manage/sessions/456/edit
```

Here, `123` represents the event ID, while `456` represents the session ID.

### Route Groups

Next.js route groups organize application pages without affecting their public URL structure.

| Route Group | Purpose |
|---|---|
| `(auth)` | Organizes login and registration pages |
| `(app)` | Organizes the main application pages and shared application layout |

**Important:** Route group names enclosed in parentheses do not appear in the browser URL. For example, `src/app/(auth)/login/page.tsx` resolves to `/login`, not `/(auth)/login`.

## 5. Features

### 5.1 Authentication

- User registration.
- User login and logout.
- Session-based authentication.
- Protected application routes.

### 5.2 Event Management

- Browse available events.
- Search events by name.
- Filter events by status.
- Create, edit, and delete events.
- Manage event capacity.
- Update event status.

Event statuses:
- `Upcoming`
- `Ongoing`
- `Finished`

### 5.3 Committee Management

- Invite registered users by email.
- Accept or reject invitations.
- View committee members.
- Change committee roles.
- Remove committee members.
- Leave committee membership.

Supported event roles:
- `Coordinator`
- `Committee`

### 5.4 Session Management

- Create, edit, and delete sessions.
- Display sessions in chronological order.
- Show session details.
- Update session status.

Session statuses:
- `Upcoming`
- `Ongoing`
- `Finished`

### 5.5 Participant Registration

- Register for an event.
- View personal registrations.
- Cancel registrations when permitted.
- Display event capacity and availability.
- Prevent duplicate active registrations.

Registration statuses:
- `Registered`
- `Checked In`
- `Cancelled`

### 5.6 Attendance and Check-in

- View registered participants.
- Search participants by name or email.
- Filter participants by registration status.
- Check in registered participants.
- Prevent duplicate check-ins.
- Display attendance statistics.

### 5.7 Announcements

- Create announcements.
- Edit announcements.
- Delete announcements.
- Display the latest announcements first.
- Receive real-time announcement updates.

### 5.8 Operations Dashboard

The dashboard provides operational insights, including:

- Total active registrations.
- Total checked-in participants.
- Participants who have not arrived.
- Available event capacity.
- Session status overview.

### 5.9 Real-time Updates

The application supports real-time updates for:

- Registration changes.
- Participant check-ins.
- Session status changes.
- Announcement updates.
- Operational dashboard statistics.

### 5.10 Animations

Animations are applied to meaningful user interactions:

- Navigation between event pages.
- Opening and closing forms and registration details.
- Session status transitions.
- Real-time attendance updates.
- Announcement notifications.

The application should respect the user's reduced-motion preference.

## 6. Role-Based Access Control

Roles are scoped to individual events, not globally assigned to users.

A user may be a Coordinator in one event and a Committee member in another.

| Capability | Coordinator | Committee | Participant / User |
|---|:---:|:---:|:---:|
| View event information | Yes | Yes | Yes |
| Edit/delete event | Yes | No | No |
| Manage committee | Yes | No | No |
| Leave committee | Yes | Yes | N/A |
| Manage sessions (CRUD) | Yes | No | No |
| Update session status | Yes | Yes | No |
| Manage announcements | Yes | Yes | No |
| View operational dashboard | Yes | Yes | No |
| View participant list | Yes | Yes | No |
| Perform check-in | Yes | Yes | No |
| Register for event | Yes | Yes | Yes |
| View personal registration | Yes | Yes | Yes |

All permissions must also be enforced by the backend. Frontend route protection and conditional rendering are not substitutes for server-side authorization.

## 7. State Management Strategy

Use the appropriate state management solution based on the nature of the data.

| State Type | Solution | Examples |
|---|---|---|
| Server State | TanStack Query | Events, sessions, registrations, announcements |
| Global Client State | Zustand | Shared UI state and client preferences |
| Local Component State | React `useState` | Dialog visibility, dropdowns, temporary UI interactions |
| Form State | React Hook Form + Zod | Event forms, session forms, registration forms |
| URL State | Next.js Search Params | Search queries, filters, pagination |

Avoid duplicating server data in Zustand when TanStack Query already manages it.

## 8. Development Guidelines

### Component Guidelines

- Use feature-specific components for business-related UI.
- Use `components/ui/` for generic UI primitives.
- Keep page components focused on composition.
- Avoid oversized components with multiple unrelated responsibilities.
- Prefer reusable components when the same UI pattern appears in multiple features.

### API Integration

- Centralize API configuration in `lib/`.
- Keep endpoint implementations inside feature-specific services.
- Use TanStack Query hooks to consume API services.
- Define request and response types.
- Validate user input using Zod.
- Handle loading, error, empty, and success states.

### Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Components | PascalCase | `EventCard.tsx` |
| Hooks | camelCase with `use` prefix | `useEvents.ts` |
| Services | kebab-case | `event-service.ts` |
| Schemas | kebab-case | `event-schema.ts` |
| Types | PascalCase | `EventTypes.ts` |
| Folders | kebab-case | `event-management/` |

Follow the existing repository convention consistently when implementing new modules.

## 9. Development Priorities

Implementation should follow the MVP workflow to ensure the application can demonstrate its primary business flow.

| Priority | Scope |
|---|---|
| 1 | Authentication and event catalog |
| 2 | Event creation and event details |
| 3 | Session management and rundown |
| 4 | Participant registration and capacity |
| 5 | Operations dashboard and participant check-in |
| 6 | Committee management and announcements |
| 7 | Real-time updates |
| 8 | Animations and additional improvements |
| 9 | Testing, CI/CD, deployment, and monitoring |

The primary end-to-end workflow should be functional as early as possible, ideally within the first six hours of development.

## 10. Deployment

The frontend application is containerized using Docker and deployed to the VM provided by the hackathon organizers.

The frontend team is responsible for:

- Dockerfile configuration.
- Environment variable management.
- Frontend container deployment.
- GitHub Actions CI/CD pipeline.
- Integration with the backend API.
- Monitoring integration.

Deployment configuration follows the separate infrastructure and deployment guidelines provided by the organizers.
