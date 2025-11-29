# Hand4Pal Frontend - AI Coding Agent Instructions

## Project Overview
**Hand4Pal** is a charity donation platform built with Angular 21 (standalone components), connecting citizens, associations, and administrators. The frontend communicates with a Spring Boot backend gateway at `http://localhost:8080/api`.

## Architecture & Patterns

### Component Structure
- **Standalone components only** - no NgModules. All components use `standalone: true` and explicit imports
- **MVVM pattern** - components use ViewModels (not services) for business logic
  - Services (`src/app/core/services/`) handle HTTP and state management
  - ViewModels (`src/app/core/viewmodels/`) contain UI logic and expose observables
  - Components subscribe to ViewModel observables via `async` pipe or `.subscribe()` with cleanup

**Example**: `LoginComponent` uses `AuthViewModel`, which wraps `AuthService`:
```typescript
// Component injects ViewModel, not Service
constructor(public authViewModel: AuthViewModel) {}

// Subscribe to ViewModel observables
this.authViewModel.loading$.pipe(takeUntil(this.destroy$))
  .subscribe(loading => this.loading = loading);
```

### Reactive State Management
- **BehaviorSubjects** for state in services (e.g., `currentUserSubject` in `AuthService`)
- **Signals** used sparingly (only in `App` and `AssociationDashboard` for local UI state)
- **RxJS operators**: Prefer `pipe(takeUntil(destroy$))` for subscription cleanup in components
- **Observable naming**: Use `$` suffix (e.g., `currentUser$`, `loading$`)

### Authentication Flow
1. **Token storage**: JWT tokens stored in `localStorage` as `authToken`
2. **Auto-injection**: `authInterceptor` (functional interceptor) adds `Authorization: Bearer <token>` to all non-auth requests
3. **Token refresh**: Interceptor catches 401 errors and calls `refreshAccessToken()` before retrying
4. **Route guards**: `authGuard` (functional guard) checks authentication + role via `route.data['role']`
   - Roles: `ADMINISTRATOR`, `ASSOCIATION`, `CITIZEN`
   - See `app.routes.ts` for protected routes with `canActivate: [authGuard]`

### API Integration
- **Gateway URL**: All services use `http://localhost:8080/api/{endpoint}`
- **Service pattern**: Each service defines `private readonly API_URL` constant
- **Models**: Interfaces in `src/app/core/models/` match backend DTOs exactly (e.g., `AuthResponse`, `User`)
- **Error handling**: Services throw errors; ViewModels catch and expose via `error$` observable

## Styling & UI

### Tailwind Configuration
- Custom color palette defined in `tailwind.config.js`:
  - `primary`: `#00a651` (green) with `primary-hover`
  - `secondary`: `#ed1c24` (red)
  - `accent`: `#000000` (black)
- Use utility classes in templates (already configured for `src/**/*.{html,ts}`)

### Component Styles
- Each component has dedicated `.css` file for component-specific styles
- Global styles in `src/styles.css`
- Prefer Tailwind utilities over custom CSS

## Development Workflow

### Running the App
```bash
npm start  # Starts dev server on http://localhost:4200
```

### Code Generation
Use Angular CLI schematics (all standalone):
```bash
ng generate component pages/my-page --standalone
ng generate service core/services/my-service
```

### Testing
- Test runner: **Vitest** (not Karma/Jasmine)
- Run tests: `npm test`
- Spec files: `*.spec.ts` alongside components

### Build
```bash
npm run build  # Production build to dist/
npm run watch  # Development build with watch mode
```

## File Naming Conventions
- **Components**: `feature-name.component.ts` (kebab-case)
- **Services**: `feature.service.ts`
- **Models**: `feature.models.ts` (plural)
- **ViewModels**: `feature.viewmodel.ts`
- **Guards/Interceptors**: `feature.guard.ts`, `feature.interceptor.ts`

## Key Files Reference
- **App bootstrap**: `src/main.ts` → `src/app/app.ts` (root component using signals for title)
- **App config**: `src/app/app.config.ts` (providers: router, HttpClient with interceptors)
- **Routes**: `src/app/app.routes.ts` (role-based protection examples)
- **Auth logic**: `core/services/auth.service.ts` + `core/viewmodels/auth.viewmodel.ts`
- **Shared components**: `src/app/shared/navbar/`, `footer/`, `comment/`, `donation-modal/`

## TypeScript Configuration
- **Strict mode enabled** (`strict: true`, `noImplicitReturns`, `noFallthroughCasesInSwitch`)
- **Experimental decorators** enabled for Angular
- Target: ES2022

## Common Patterns to Follow
1. **Dependency injection**: Use `inject()` in functional guards/interceptors, constructor injection in classes
2. **Form handling**: Reactive forms (`ReactiveFormsModule`, `FormBuilder`) - see `LoginComponent`
3. **Navigation**: Inject `Router` and use `router.navigate(['/path'])`
4. **Cleanup**: Implement `OnDestroy` with `destroy$ = new Subject<void>()` for RxJS subscriptions
5. **French comments**: Code comments are in French (project language preference)

## Backend Integration Notes
- Backend expects specific role values: `ADMINISTRATOR`, `ASSOCIATION`, `CITIZEN`
- Auth endpoints: `/auth/register/citizen`, `/auth/register/association`, `/auth/login`, `/auth/refresh`
- Profile endpoints: `/profile`, `/profile/change-password`
- Admin endpoints: `/admin/users/*` (require ADMINISTRATOR role)
