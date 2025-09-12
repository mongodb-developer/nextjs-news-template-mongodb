# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js template for building full-stack applications with MongoDB and Better Auth for authentication. The project uses TypeScript, Tailwind CSS with shadcn/ui components, and is optimized for deployment on Vercel.

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
- **Server-side config**: `lib/auth.ts` - Contains the main auth instance with GitHub OAuth and email/password providers
- **Client-side**: `lib/auth-client.ts` - React client for authentication methods
- **API routes**: `app/api/auth/[...all]/route.ts` - Handles all auth endpoints via Better Auth's Next.js handler

### Database Layer
- **Connection**: `lib/mongodb.ts` - MongoDB client with development/production connection handling
- **Database name**: Configurable via `MONGODB_DB` env var (defaults to "better-auth")
- **Connection reuse**: Uses global variable in development for HMR compatibility

### Project Structure
- `app/` - Next.js App Router pages and API routes
- `lib/` - Core utilities (auth, database, utils)
- `components/ui/` - shadcn/ui components (Button, Badge)

## Environment Variables

Required variables (see `.env.example`):
- `MONGODB_URI` - MongoDB Atlas connection string
- `BETTER_AUTH_SECRET` - Secure secret key (minimum 32 characters)
- `BETTER_AUTH_URL` - Base URL for auth (http://localhost:3000 for dev)
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET` - GitHub OAuth credentials

Optional:
- `MONGODB_DB` - Database name (defaults to "better-auth")

## Authentication Features

- Email/password authentication
- GitHub OAuth integration
- MongoDB session storage
- Async auth instance initialization to handle database connections

## Development Notes

- Uses Turbopack for faster development builds
- Dark mode enabled by default in layout
- MongoDB connections are cached in development to prevent connection exhaustion during HMR
- Better Auth requires environment validation on startup - missing required variables will throw errors immediately