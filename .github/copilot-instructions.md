# Copilot Instructions for Desktop Portfolio

## Project Overview

This is a **retro-styled desktop portfolio website** built with Next.js that mimics a 1990s OS interface. Users interact with a simulated desktop environment featuring draggable windows, icons, and a menu bar system. The entire UI is a single-page interactive experience.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, chicago.css (retro styling library)

## Architecture & Key Patterns

### Component Hierarchy

- **`Desktop.tsx`** (client component) — Main orchestrator managing window state, opening/closing windows, desktop interactions
- **`Header.tsx`** (client component) — Menu bar with dropdowns; handles menu interactions and external links
- **`Window.tsx`** (client component) — Renders individual draggable windows with titlebar and content lookup from `WINDOW_CONTENT`
- **`Icon.tsx`** — Desktop icons that trigger window open on double-click
- **`Bootscreen.tsx`**, **`Loading.tsx`** — Loading states during app startup
- **`app/page.tsx`** — Entry point that orchestrates Bootscreen → Loading → Desktop flow

### Data Flow

- **`data/windows.ts`** contains the `WINDOW_CONTENT` object: a Record mapping window types (strings like "about", "system", "projects") to `{title, body[]}` objects
- Window instances are created with a `type` field that looks up content from this object
- **Desktop state** tracks `WindowInstance[]` with `{id, type, x, y}` — position is managed locally; content is fetched from the centralized data object

### State Management

- All stateful logic lives in `Desktop.tsx` using React hooks (`useState`, `useRef`)
- Windows stack by default (z-index determined by render order); each window gets a unique ID
- **"Already opened" prevention:** `opened` array tracks window types to prevent duplicate windows of the same type
- Desktop position calculation: windows offset by `windows.length * 20` pixels to avoid overlap

## Developer Workflows

### Running the Project

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Run ESLint (uses eslint-config-next)
```

### Adding New Content Windows

1. Add entry to `WINDOW_CONTENT` in [data/windows.ts](data/windows.ts):
   ```typescript
   mywindow: {
     title: "My Window",
     body: ["Line 1", "Line 2", "..."]
   }
   ```
2. Add menu item in [Header.tsx](components/Header.tsx) `Menuitems` object that calls `props.onOpenWindow?.("mywindow")`
3. Window automatically renders via `Window.tsx` lookup

### Adding Desktop Icons

1. Create `IconInstance` in `Desktop.tsx`
2. Render `<Icon name="..." type="..." onDoubleClick={() => openWindow("type")} x={} y={} />`
3. Icon styling is in [globals.css](app/globals.css) — uses chicago.css classes for retro aesthetic

## Project-Specific Conventions

### Styling

- **CSS Custom Properties** define the retro OS theme: `--os-bg`, `--os-window`, `--os-text-light`, `--os-text-dark`, etc.
- **Tailwind + chicago.css** together create the retro UI; chicago.css provides Win95-style components
- **CRT effect wrapper:** All content wrapped in `.crt` and `.desktop-wrapper` divs for screen aesthetic
- Position absolute elements use inline `style={{top: y, left: x}}` for window/icon placement (not Tailwind)

### Type Safety

- Window instances use `WindowInstance` type with `id` (unique), `type` (content key), `x`, `y`
- Menu items use `MenuItem[]` type with `label` and `onSelect` callback
- All components typed with explicit `Props` interfaces

### Retro Interaction Patterns

- **Double-click to open** (standard icon behavior)
- **Menu bar dropdown toggle** — clicking menu toggles its dropdown; selecting item closes menu
- **Window close button** — removes window from state via `closeWindow(id)`
- **Prevent duplicate windows** — if window type already in `opened` array, `openWindow()` returns early
- **External links** open in new tabs via `window.open(url, "_blank")`

## Critical Integration Points

### Desktop ↔ Header

- Header receives `onOpenWindow`, `onRestart`, `onCloseActiveWindow`, `onOpenLink` callbacks
- Menu selections directly trigger these callbacks from `Desktop` parent
- Restart callback performs a full app reload (expected behavior: restart the OS simulation)

### Desktop ↔ Window

- Window close button calls `windowClose?.(windowId)` which triggers `Desktop.closeWindow(id)`
- This removes window from state and cleans up `opened` tracking array

### Data Access Pattern

- **All window content is static and centralized** in [data/windows.ts](data/windows.ts)
- `Window.tsx` does: `WINDOW_CONTENT[windowType]?.body` — lookup by string key
- Adding content requires editing only the data file, not component logic

## Common Tasks & Patterns

### Modify Window Content
Edit the relevant entry in [data/windows.ts](data/windows.ts) — no component changes needed

### Add/Remove Menu Items
Edit `Menuitems` object in [Header.tsx](components/Header.tsx#L23) — ensure callback is one of the `HeaderProps` functions

### Change Retro Aesthetic
Edit CSS variables in `:root` in [app/globals.css](app/globals.css#L5) or modify chicago.css imports

### Debug Window State
Check `windows` array in `Desktop.tsx` — each window must have unique `id` and valid `type` key in `WINDOW_CONTENT`

## Notes for AI Agents

- This is a **portfolio project** — content is intentionally static and about the creator (Gaster Chiang)
- The retro 90s aesthetic is intentional and core to the design; maintain it when making UI changes
- Loading screen has a 3-second delay — this is intentional for the OS boot experience
- All interactive state lives in `Desktop.tsx` — components are mostly presentational
