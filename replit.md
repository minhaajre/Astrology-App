# The Universal Matrix - Numerology Calculator

## Overview

A data-intensive numerology web application that calculates life paths, personal cycles, compatibility scores, and timing advice based on birth dates and names. The app provides personalized numerological insights through a professional dark-themed interface with clear information hierarchy.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: Shadcn UI (New York style) with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming (light/dark mode support)
- **Design System**: Material Design principles adapted for data-dense numerology displays

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Structure**: RESTful endpoints prefixed with `/api`
- **Build Process**: Custom build script using esbuild for server bundling, Vite for client

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for shared types between client and server
- **Current Storage**: In-memory storage implementation (`MemStorage` class) with interface for database migration
- **Session Management**: Prepared for connect-pg-simple but currently using memory

### Project Structure
```
client/           # React frontend application
  src/
    components/   # UI components (numerology-specific + shadcn/ui)
    pages/        # Route pages
    lib/          # Utilities, numerology calculations, theme, query client
    hooks/        # Custom React hooks
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route definitions
  storage.ts      # Data access layer
  static.ts       # Static file serving for production
  vite.ts         # Vite dev server integration
shared/           # Shared code between client and server
  schema.ts       # Drizzle schema and Zod validation
```

### Key Design Patterns
- **Progressive Disclosure**: Tab-based navigation reveals complexity in digestible chunks
- **Numerical Prominence**: Large, bold typography for key numbers (Life Path, compatibility scores)
- **Component Composition**: Reusable metric tiles, accordions, and display components
- **Theme Context**: React context for dark/light mode toggle with localStorage persistence

### Numerology Features
- Life Path calculation with master number support (11, 22, 33)
- Personal Year/Month/Day cycles
- Vietnamese Zodiac integration
- Compatibility calculator between two people
- Timing advisor for optimal days
- Name numerology (Expression, Soul Urge, Personality numbers)
- Export panel for report generation

## External Dependencies

### Database
- **PostgreSQL**: Primary database (requires `DATABASE_URL` environment variable)
- **Drizzle Kit**: Database migrations via `db:push` command

### UI Libraries
- **Radix UI**: Full suite of accessible primitives (dialog, tabs, accordion, etc.)
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel component
- **Recharts**: Charting library for data visualization
- **date-fns**: Date manipulation and formatting

### Form Handling
- **React Hook Form**: Form state management
- **Zod**: Schema validation (integrated with Drizzle via drizzle-zod)

### Development Tools
- **Replit Plugins**: Runtime error overlay, cartographer, dev banner (development only)
- **Google Fonts**: DM Sans, Fira Code, Geist Mono, Architects Daughter