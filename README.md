# Gaster OS - Personal Portfolio

A retro desktop-style personal portfolio built with Next.js, React, and TypeScript.

Instead of a normal portfolio page, this project presents my work as a small operating-system inspired desktop. Visitors can boot into "Gaster OS", open files, explore project writeups, drag windows around, and use a classic menu bar inspired by early Macintosh/System 1 interfaces.

## About The Project

This portfolio was created as a university student project to showcase my software engineering work in a more interactive way. I wanted the site to feel like a small digital space rather than a static resume page.

The app includes:

- A boot screen with animated startup text
- A desktop interface styled like an old-school operating system
- Desktop icons for About Me, Projects, Bouldering, and hidden content
- A top menu bar with project/system actions and external links
- Draggable windows with close buttons
- A Projects folder containing individual project files
- Project writeups with text, images, and GitHub links
- Responsive sizing so windows stay inside the desktop on smaller screens
- Touch-friendly behavior for mobile users

## Featured Projects

The portfolio currently includes writeups for:

- Personal Portfolio / Gaster OS
- F1 Race ML Platform
- FAANG Stock Data Analytics
- Face Detection Client-Server System
- UQ Mahjong Society Scoreboard
- Visual Effect project
- Society Landing Page

It also includes a bouldering section, because climbing is a big part of how I think about problem solving: try, fail, adjust, and eventually send it.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- chicago.css
- CSS modules/global styling through `globals.css`

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app in your browser:

```text
http://localhost:3000
```

Build for production:

```bash
npm run build
```

Start the production build:

```bash
npm run start
```

Run linting:

```bash
npm run lint
```

## Project Structure

```text
src/
  app/
    globals.css        Global styling, desktop theme, windows, icons, loading UI
    layout.tsx         Root layout and metadata
    page.tsx           Switches between boot screen and desktop

  components/
    Bootscreen.tsx     Startup screen before entering the desktop
    Desktop.tsx        Main desktop state, icons, windows, sizing, restart logic
    Header.tsx         Top menu bar, menu actions, time display
    Icon.tsx           Desktop and folder icons
    Window.tsx         Draggable window component and content renderer
    FolderView.tsx     Projects folder grid
    Loading.tsx        Startup loading window
    Popup.tsx          Experimental popup component

  data/
    windows.ts         Portfolio content, project writeups, links, and folder files

public/
  assets/              Icons, images, screenshots, and portfolio media
```

## Main Features

### Boot Flow

The site starts with a fake terminal-style boot screen. After the boot text finishes, users can press any key or click to enter the desktop.

### Desktop Interface

The desktop is a contained OS-like screen with icons, a menu bar, window management, and retro visual styling. It uses React state to track open windows, prevent duplicate windows, and keep windows inside the visible desktop area.

### Draggable Windows

Each window can be dragged with pointer events, so it works with both mouse and touch input. Window positions are clamped to stay inside the desktop.

### Project Folder

The Projects folder opens into a grid of text-file icons. Each file opens a separate writeup from `src/data/windows.ts`, making it easy to add or edit portfolio content without changing the window rendering logic.

### Custom Content Renderer

Window content supports:

- Headings
- Bullet points
- Bold and underline styling
- Images
- External links

This lets each project page feel like a small document inside the desktop.

## What I Learned

Through this project, I practiced:

- Structuring a React app with reusable components
- Managing multiple pieces of UI state cleanly
- Handling drag interactions with pointer events
- Building responsive layouts with fixed visual constraints
- Turning content data into reusable rendered UI
- Designing a portfolio that feels personal instead of generic
- Debugging layout details like window bounds, z-index, menu sizing, and mobile behavior

## Future Improvements

Some ideas I may add later:

- More keyboard shortcuts
- Better window focus and z-index ordering
- Minimize/maximize behavior
- More hidden files or Easter eggs
- More polished mobile layout
- Extra project writeups and live demo links

## Author

Gaster Chiang  
Software Engineering student at The University of Queensland

- GitHub: [ayocsy](https://github.com/ayocsy)
- LinkedIn: [sheung-yan-chiang](https://www.linkedin.com/in/sheung-yan-chiang)
- Instagram: [ayoclimb](https://www.instagram.com/ayoclimb/)

