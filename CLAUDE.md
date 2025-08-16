# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 13 application called "戯曲図書館" (Gikyoku Tosyokan / Theater Library), a web platform for searching and discovering theatrical scripts. The application allows users to search scripts by parameters like cast size, play duration, and categories.

## Tech Stack

- **Framework**: Next.js 13.4.19 with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Analytics**: Google Analytics (gtag), Vercel Analytics
- **Email**: Resend
- **Deployment Environment**: Vercel (with PostgreSQL database)

## Development Commands

```bash
# Development
npm run dev          # Start development server

# Build & Production
npm run build        # Build production bundle
npm run start        # Start production server
npm run lint         # Run ESLint

# Database Management
npx prisma generate                          # Generate Prisma client
npx prisma migrate dev --name <migration-name>  # Create new migration
npx prisma migrate deploy                    # Deploy migrations to production
npx prisma db seed                           # Seed database

# Docker Commands (if using Docker)
make up             # Start Docker containers
make down           # Stop Docker containers
make shell          # Access container shell
make psql           # Connect to local PostgreSQL
make psql-prd       # Connect to production PostgreSQL
```

## Architecture

### Core Data Models (Prisma)

- **Post**: Theatrical scripts with metadata (playtime, cast requirements, synopsis)
- **Author**: Script authors with profiles and social links
- **Category**: Script categories with many-to-many relationship to posts
- **ParentComment/ChildComment**: Nested commenting system
- **Rating**: User ratings for scripts
- **Access**: View tracking by IP address
- **News**: Platform news/updates

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
- `/api/search` - Search functionality
- `/api/sendmail` - Email sending via Resend
- `/api/popular` - Popular content retrieval
- `/api/createComment` - Comment creation

### Key Components

- **SearchForm**: Advanced search interface with filters
- **PostCard/PostCardList**: Script display components
- **Layout**: Main layout wrapper with header/footer
- **CustomMarkdown**: Markdown renderer for content
- **Modal**: Reusable modal system
- **Form/***: Various form components for data entry

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