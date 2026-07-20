# Mathematics Platform

A gamified mathematics learning platform.

## Project Structure

```
mathematics/
├── backend/         # API and Learning Engine (Node.js + Express + Prisma)
├── frontend/        # Visual / game experience (separate project)
├── infrastructure/  # Docker and deployment configurations
├── docs/            # Product and architecture references
│   └── blueprint/   # Product blueprint documents
├── private/         # Private source material (gitignored)
├── compose.yaml     # PostgreSQL service definition (INACTIVE — see below)
├── .env.example     # Environment variable template
└── README.md        # This file
```

## Why PostgreSQL in Docker?

PostgreSQL runs inside a Docker container to keep the development environment
consistent across machines. No need to install PostgreSQL directly on your host.
The database service is defined in `compose.yaml`.

> **⚠️ compose.yaml is currently INACTIVE.** It has been reviewed but will not
> be started until explicitly approved. Do not run `docker compose up` without
> confirmation.

## Why Prisma as the Source of Truth?

Prisma schema (`backend/prisma/schema.prisma`) is the single source of truth
for the database schema. Every model, relation, and constraint is defined there.
Migrations are generated from this schema, ensuring the database always matches
the application's expectations.

> **⚠️ The first Prisma migration has NOT been created yet.** It will be
> generated only after the Knowledge Core schema has been reviewed and approved.
> Do not run `npx prisma migrate dev` until then.

## Getting Started

### Prerequisites

- Node.js >= 20
- npm >= 10
- Docker (for PostgreSQL — not required for local development/testing)

### Setup

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Copy environment file
cp .env.example .env
# Edit .env with your settings

# 3. Start development server (no database required for health endpoint)
npm run dev
```

### Available Scripts (backend)

| Script               | Description                                    |
|----------------------|------------------------------------------------|
| `npm run dev`        | Start development server with hot-reload       |
| `npm start`          | Start production server                        |
| `npm test`           | Run tests                                      |
| `npm run lint`       | Lint code                                      |
| `npm run format`     | Format code with Prettier                      |
| `npm run format:check` | Check formatting with Prettier               |
| `npm run prisma:validate` | Validate Prisma schema                   |
| `npm run verify`     | Run full verification suite (no Docker needed) |

## License

Proprietary — All rights reserved.
