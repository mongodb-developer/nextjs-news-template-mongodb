# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js template for building full-stack applications with MongoDB and Better Auth for authentication. The project demonstrates modern React patterns including Suspense, optimistic updates, server actions, server components, client components, API routes, shadcn/ui integration, and Zod validation. It features a Hacker News-style post submission and voting system and is optimized for deployment on Vercel.

## Common Commands

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality

### Setup
- `cp .env.example .env` - Copy environment variables template
- `npm install` - Install dependencies

## Architecture

### Authentication System
The project uses Better Auth with MongoDB adapter:
- **Server-side config**: `lib/auth.ts` - Contains the main auth instance with GitHub OAuth provider
- **Client-side**: `lib/auth-client.ts` - React client for authentication methods
- **API routes**: `app/api/auth/[...all]/route.ts` - Handles all auth endpoints via Better Auth's Next.js handler
- **Form wrapper**: `components/PostSubmissionFormWrapper.tsx` - Client component for reactive authentication state

### Database Layer
- **Connection**: `lib/mongodb.ts` - MongoDB client with development/production connection handling
- **Database name**: Configurable via `MONGODB_DB` env var (defaults to "better-auth")
- **Connection reuse**: Uses global variable in development for HMR compatibility
- **Status monitoring**: `components/DatabaseStatusBadge.tsx` - Real-time database connection status

### Post Management System
- **Data layer**: `lib/posts.ts` - Server functions with caching using Next.js `unstable_cache`
- **Server components**: `components/PostListServer.tsx` - Server-side post rendering with Suspense
- **Client interactions**: `components/PostItem.tsx` - Optimistic voting with `useOptimistic` hook
- **Form handling**: `components/PostSubmissionForm.tsx` - React Hook Form with Zod validation
- **Server actions**: `lib/actions.ts` - Server actions for post submission and voting
- **Data fetching**: `lib/posts.ts` - Cached server functions with `unstable_cache` and tag-based revalidation
- **Pagination**: `components/PostListPagination.tsx` - Client-side pagination with URL state

### Modern React Patterns
- **Suspense**: Used for loading states in post lists
- **Optimistic updates**: Real-time UI updates before server confirmation
- **Server actions**: Form submission and voting without client-side API calls
- **Server components**: SEO-friendly server-side rendering
- **Client components**: Interactive elements with proper hydration
- **React Hook Form**: Type-safe form handling with Zod validation
- **Cache management**: Strategic cache invalidation with revalidateTag

### Project Structure
- `app/` - Next.js App Router pages and API routes
- `lib/` - Core utilities (auth, database, schemas, actions, posts)
- `components/` - React components (both server and client)
- `components/ui/` - shadcn/ui components (Button, Badge, Form, Input, etc.)

## Environment Variables

Required variables (see `.env.example`):
- `MONGODB_URI` - MongoDB Atlas connection string
- `BETTER_AUTH_SECRET` - Secure secret key (minimum 32 characters)
- `BETTER_AUTH_URL` - Base URL for auth (http://localhost:3000 for dev)
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET` - GitHub OAuth credentials (required for authentication)

Optional:
- `MONGODB_DB` - Database name (defaults to "better-auth")

## Features

### Authentication Features
- GitHub OAuth integration with proper error handling
- MongoDB session storage with automatic cleanup
- Async auth instance initialization to handle database connections
- Login/signup pages with GitHub authentication
- Reactive authentication state with immediate UI updates

### Application Features
- Hacker News-style post submission system
- Real-time voting with optimistic UI updates
- Pagination with URL state management
- Form validation using Zod schemas
- Toast notifications for user feedback
- Responsive design with dark mode
- Database connection status monitoring

## Development Notes

- Uses Turbopack for faster development builds
- Dark mode enabled by default in layout
- MongoDB connections are cached in development to prevent connection exhaustion during HMR
- Better Auth requires environment validation on startup - missing required variables will throw errors immediately
- Posts are cached using Next.js cache with strategic revalidation on mutations
- Optimistic updates provide immediate user feedback while maintaining data consistency
- Server actions eliminate the need for client-side API calls for mutations