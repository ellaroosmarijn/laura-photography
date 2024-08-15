# Laura's Wedding Photography Database
This repository contains the database schema and related scripts for Laura's Wedding Photography project, developed by Ella.

## Project Overview
This database is designed to support Laura's wedding photography business, managing events, scenes, media, and share links for wedding photography sessions. It uses PostgreSQL as the database provider and Prisma as the ORM.

## Schema Overview

### Models
- **Event**: Represents a wedding event with scenes and share links.
- **Scene**: Represents a specific scene within an event, containing media.
- **Media**: Stores information about images, including web and high-resolution URLs.
- **ShareLink**: Manages shareable links for events with expiration dates.

## Setup
1. Clone this repository
2. Install dependencies: `pnpm install`
3. Set up your environment variables:
- Create a `.env` file in the root directory
- Add your database URL:
  ```
  DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
  ```
4. Run database migrations: `npx prisma migrate dev`

## Testing
This project uses Vitest for unit and end-to-end testing. Here are the available test commands:

### Unit Tests
- Run unit tests: `pnpm test`
- Watch mode for unit tests: `pnpm test:watch`
- Generate unit test coverage: `pnpm test:coverage`

### End-to-End Tests
- Run E2E tests: `pnpm test:e2e`
- Watch mode for E2E tests: `pnpm test:e2e:watch`
- Generate E2E test coverage: `pnpm test:e2e:coverage`

## Development
To make changes to the database schema:

1. Modify the `schema.prisma` file
2. Run `npx prisma migrate dev` to create a new migration
3. Commit the changes and the new migration files
4. Run `npx prisma generate` to update your prisma client with the changes 

## Deployment
When deploying to production:

1. Ensure the production environment has the correct `DATABASE_URL`
2. Run `npx prisma migrate deploy` to apply any pending migrations

## Notes
This is a private project developed by Ella for Laura's Wedding Photography business. It is not intended for public contribution or distribution.