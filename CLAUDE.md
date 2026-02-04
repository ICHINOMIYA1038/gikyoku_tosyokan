# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 13 application called "戯曲図書館" (Gikyoku Tosyokan / Theater Library), a web platform for searching and discovering theatrical scripts. The application allows users to search scripts by parameters like cast size, play duration, and categories.

## Tech Stack

- **Framework**: Next.js 13.4.19 with TypeScript
- **Database**: PostgreSQL with Prisma ORM (via Vercel Postgres with PgBouncer)
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Analytics**: Google Analytics (gtag), Vercel Analytics
- **Email**: Resend
- **Deployment**: Vercel (serverless functions)
- **Image Storage**: AWS S3

## Development Commands

```bash
# Development
npm run dev          # Start development server

# Build & Production
npm run build        # Build production bundle (includes prisma generate)
npm run start        # Start production server
npm run lint         # Run ESLint

# Database Management
npx prisma generate                             # Generate Prisma client
npx prisma migrate dev --name <migration-name>  # Create new migration
npx prisma migrate deploy                       # Deploy migrations to production
npx prisma db seed                              # Seed database

# Docker Commands
make up             # Start Docker containers
make down           # Stop Docker containers
make shell          # Access container shell
make psql           # Connect to local PostgreSQL
make psql-prd       # Connect to production PostgreSQL
make backup-prd     # Backup production database
make restore-local  # Restore from backup to local
```

## Architecture

### Core Data Models (Prisma)

- **Post**: Theatrical scripts with metadata (playtime, cast requirements, synopsis, ratings)
- **Author**: Script authors with profiles and social links (Twitter)
- **Category**: Script categories with many-to-many relationship to posts
- **ParentComment/ChildComment**: Nested commenting system
- **Rating**: User ratings for scripts (by IP address)
- **Access**: View tracking by IP address and date (unique constraint)
- **News**: Platform news/updates
- **Announcement**: User-submitted performance announcements with venue/ticket info

### Page Structure

- `/` - Homepage with search functionality
- `/posts/[id]` - Individual script detail pages
- `/authors/[id]` - Author profile pages
- `/categories/[id]` - Category listing pages
- `/admin/*` - Admin panel for content management
- `/support/*` - Support pages (about, contact, privacy policy, etc.)
- `/news/publish/*` - News publishing interface

### API Routes

- `/api/posts/*` - CRUD operations for scripts
- `/api/authors/*` - Author management
- `/api/categories/*` - Category management
- `/api/search` - Search functionality (also `search-edge.ts` for Edge runtime)
- `/api/*-cached` - Cached versions of endpoints (home, authors, categories, search)
- `/api/announcements/*` - Performance announcement CRUD
- `/api/sendmail` - Email sending via Resend
- `/api/popular` - Popular content retrieval
- `/api/createComment` - Comment creation
- `/api/feed.xml` - RSS feed generation (accessible via `/feed.xml` or `/rss.xml`)

### Key Components

- **SearchForm/MobileSearchForm**: Advanced search interface with filters (responsive)
- **PostCard/PostCardList**: Script display components
- **Layout**: Main layout wrapper with header/footer
- **Header/MobileHeader**: Responsive navigation
- **CustomMarkdown**: Markdown renderer for content
- **Modal**: Reusable modal system
- **Form/***: Various form components for data entry
- **Comments**: Nested comment display and submission

### Lib Utilities

- **prisma.ts**: Singleton Prisma client with connection pooling optimization
- **cache.ts/search-cache.ts**: In-memory caching for API responses
- **db-utils.ts/api-utils.ts**: Database and API helper functions
- **seoUtils.ts**: SEO metadata generation
- **gtag.js**: Google Analytics tracking

## Environment Variables

The application uses environment-specific files:
- `.env.local` - Local development
- `.env.production` - Production environment

Required variables:
- `POSTGRES_PRISMA_URL` - Prisma connection string (pooled)
- `POSTGRES_URL_NON_POOLING` - Direct database connection
- Google Analytics ID (configured in `lib/gtag.js`)
- AWS S3 credentials (for image storage)
- Resend API key (for email)

## Important Considerations

1. **Database Migrations**: Always create migrations when modifying the schema
2. **Image Domains**: Configure allowed domains in `next.config.js` for Next.js Image optimization
3. **Japanese Content**: The application is primarily in Japanese with UTF-8 encoding
4. **SEO**: Custom SEO component for meta tags
5. **Analytics**: Google Analytics tracking is implemented throughout
6. **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## Database Connection (Vercel/Serverless)

This project runs on Vercel's serverless environment. Key points:

- Uses PgBouncer for connection pooling (`pgbouncer=true` in connection string)
- `connection_limit=1` per serverless function to prevent pool exhaustion
- Global Prisma singleton in `lib/prisma.ts` to reuse connections in warm instances
- For troubleshooting connection issues, see `DATABASE_OPTIMIZATION.md`

Required URL parameters for `POSTGRES_PRISMA_URL`:
```
?pgbouncer=true&connect_timeout=15&pool_timeout=15&connection_limit=1
```