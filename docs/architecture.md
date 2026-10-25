# System Architecture - Le Son Website

## 1. Tech Stack
- **Runtime & Bundler:** Node.js v24 + Vite
- **Frontend Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS (v4 with `@tailwindcss/vite`) + Lucide React Icons
- **Deployment:** GitHub Pages / Vercel / Cloudflare Pages

## 2. Directory Structure
```
├── public/                 # Static assets
│   ├── images/             # Photos, banners, logos
│   ├── fonts/              # Custom web fonts
│   └── icons/              # Favicons & SVGs
├── src/
│   ├── app/                # App configuration, providers & context
│   ├── components/
│   │   ├── layout/         # Header, Footer, Navbar, Container
│   │   ├── ui/             # Reusable UI (Button, Card, Badge, Modal, Input)
│   │   └── sections/       # Hero, About, Services, Projects, Contact
│   ├── pages/              # Page views (Home, About, Services, NotFound)
│   ├── features/           # Feature-specific modules & domain logic
│   ├── hooks/              # Custom React hooks (useScroll, useMediaQuery, etc.)
│   ├── services/           # API calls, email/contact integrations
│   ├── styles/             # Global CSS and Tailwind directives
│   ├── types/              # TypeScript interface & type definitions
│   └── utils/              # Helper functions & formatting utilities
├── docs/                   # Project documentation & guidelines
├── .agents/skills/         # AI workflow & agent custom skills
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 3. Data Flow & State Management
- Local component state via React `useState` / `useReducer` for UI state.
- React Context / Custom Hooks for global configuration (theme, language, toast notifications).
- Service layer (`src/services/`) abstracts asynchronous communication and data fetching.
