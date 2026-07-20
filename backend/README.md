# Mathematics Backend

API and Learning Engine for the Mathematics Platform.

## Tech Stack

- **Runtime:** Node.js (ESM)
- **Framework:** Express
- **Database ORM:** Prisma (PostgreSQL)
- **Validation:** Zod
- **Logging:** Pino
- **Testing:** Vitest
- **Linting:** ESLint
- **Formatting:** Prettier

## Architecture

Modular monolith. Each domain module owns its controller, service, repository,
validators, errors, routes, tests, and public index. Cross-module imports pass
through each module's public index.

### Current Modules

- `health` — Service health check (no database required)

## Scripts

| Script               | Description                              |
|----------------------|------------------------------------------|
| `npm run dev`        | Start dev server with hot-reload         |
| `npm start`          | Start production server                  |
| `npm test`           | Run tests                                |
| `npm run lint`       | Lint code                                |
| `npm run format`     | Format code with Prettier                |
| `npm run prisma:validate` | Validate Prisma schema             |
| `npm run verify`     | Run full verification suite              |
