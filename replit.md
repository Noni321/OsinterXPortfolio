# Osinter x - OSINT Portfolio Website

## Overview

Osinter x is a cyberpunk-themed portfolio website showcasing Open Source Intelligence (OSINT) expertise. The application features a dark, terminal-style aesthetic with neon green accents, designed to present skills in digital forensics, data analysis, and cyber investigation. Built as a full-stack TypeScript application using React for the frontend and Express for the backend, it emphasizes visual effects like glitch animations, typewriter text, and Matrix-style rain overlays to create an immersive hacker/cyberpunk experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server, configured with HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing (alternative to React Router)
- React Query (TanStack Query) for server state management and API data fetching

**UI Component System**
- Shadcn/ui component library using the "new-york" style preset
- Radix UI primitives for accessible, unstyled components
- Custom styling via Tailwind CSS with extensive customization for cyberpunk theme
- Component aliases configured for clean imports (@/components, @/lib, @/hooks)

**Styling Approach**
- Tailwind CSS with custom color palette for cyberpunk aesthetic:
  - Primary: Neon green (#39ff14) for accents and glowing effects
  - Background: Deep black (#050505) with variants for depth
  - Custom CSS variables for theming (HSL-based color system)
- Monospace fonts (Fira Code) for terminal-style typography
- Custom animations and effects (glitch, typewriter, Matrix rain canvas overlay)
- Dark mode as default with class-based theme switching support

**State & Data Management**
- React Query configured with custom query functions for API requests
- Centralized API client in `lib/queryClient.ts` with error handling
- Credential-based authentication (cookies) with 401 handling strategies
- Toast notifications for user feedback via custom hook

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for type-safe API development
- HTTP server creation for potential WebSocket upgrades
- Middleware stack: JSON parsing, URL-encoded bodies, request logging
- Separation of concerns: routes, storage interface, static serving

**Storage Layer**
- Abstract storage interface (`IStorage`) for flexibility
- In-memory implementation (`MemStorage`) as default/development storage
- Database schema defined with Drizzle ORM for PostgreSQL
- User management methods: CRUD operations via typed interfaces

**Database Design**
- Drizzle ORM configured for PostgreSQL via Neon serverless driver
- Schema location: `shared/schema.ts` for type sharing between client/server
- Migration management via Drizzle Kit (output to `/migrations` directory)
- Zod schemas generated from Drizzle for runtime validation

**API Structure**
- Routes prefixed with `/api` for clear separation from static content
- Centralized route registration in `server/routes.ts`
- Request/response logging with timing information
- Error handling with appropriate status codes and JSON responses

### Build & Deployment Strategy

**Development Mode**
- Vite middleware integration for HMR and instant updates
- Custom development server setup in `server/vite.ts`
- Dynamic HTML template injection with cache-busting query parameters
- Replit-specific plugins for error modals, cartography, and dev banners

**Production Build**
- Separate client and server builds via custom build script
- Client: Vite static build to `dist/public`
- Server: esbuild bundling to `dist/index.cjs` (CommonJS for Node compatibility)
- Selective dependency bundling to reduce cold start times (allowlist approach)
- Static file serving from built assets with SPA fallback to index.html

**Type Safety & Validation**
- Shared TypeScript types between client and server via `shared/` directory
- Path aliases for clean imports across the codebase
- Zod schemas for runtime validation of user inputs and API data
- Drizzle-Zod integration for database schema validation

### Design System Implementation

**Theme Configuration**
- Custom Tailwind config extending default theme with:
  - Cyber color palette (neon, cyber-black, cyber-dark, cyber-gray)
  - Custom border radius values
  - HSL-based color variables for dynamic theming
  - Extended shadow system for elevation effects
- CSS custom properties for runtime theme customization
- Hover and active state elevations for interactive feedback

**Visual Effects Architecture**
- Canvas-based Matrix rain effect rendered in hero section
- Framer Motion for declarative animations (glitch, typewriter, scroll-based)
- Lucide React for consistent icon system
- Custom glow effects using box-shadow and opacity layers

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL connection via Neon's serverless driver
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-kit**: Migration tooling and schema management
- **express**: Web server framework
- **react**: UI library (v18+)
- **vite**: Build tool and dev server

### UI & Interaction Libraries
- **@radix-ui/***: Collection of accessible UI primitives (20+ components)
- **@tanstack/react-query**: Server state management
- **framer-motion**: Animation library for advanced effects
- **lucide-react**: Icon system
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation integration
- **wouter**: Lightweight routing

### Styling & Theming
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant styling
- **clsx** & **tailwind-merge**: Conditional class composition
- **autoprefixer**: CSS vendor prefixing

### Validation & Type Safety
- **zod**: Schema validation library
- **drizzle-zod**: Bridge between Drizzle ORM and Zod
- **zod-validation-error**: Enhanced validation error messages

### Session & Authentication
- **express-session**: Session middleware
- **connect-pg-simple**: PostgreSQL session store
- **passport** & **passport-local**: Authentication strategies (configured but not actively used)

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production server
- **@replit/vite-plugin-***: Replit-specific development enhancements
- **TypeScript**: Type system and compiler

### Database Configuration
- Database connection via `DATABASE_URL` environment variable
- Drizzle configured for PostgreSQL dialect
- Schema and migrations managed separately for version control