# Wekof Backend

A TypeScript-based REST API built with Express.js, Prisma, and PostgreSQL.

## Project Structure

```
├── src/
│   ├── controllers/      # Request handlers
│   ├── lib/             # Shared libraries and configurations
│   ├── middlewares/     # Express middlewares
│   ├── schemas/         # Zod validation schemas
│   ├── index.ts         # Application entry point
│   ├── routes.ts        # API routes
│   └── swagger.ts       # API documentation
├── prisma/
│   └── migrations/      # Database migrations
├── docker-compose.yml   # Docker services configuration
├── Dockerfile          # Application container configuration
└── tsconfig.json       # TypeScript configuration
```

## Tech Stack

- **Runtime**: Bun
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **API Documentation**: Swagger/OpenAPI
- **Container**: Docker

## Getting Started

1. Clone the repository
2. Copy `.env.local.example` to `.env.local` and adjust variables if needed
3. Start the development environment:
   ```bash
   bun run dev
   ```
4. Access the API at `http://localhost:8080`
5. View API documentation at `http://localhost:8080/api-docs`

## Available Scripts

### Development
- `bun run dev` - Start the development environment with Docker
- `bun run down` - Stop and remove all containers
- `bun run docker:logs` - View Docker container logs

### Database
- `bun run db:up` - Start only the database container
- `bun run db:down` - Stop the database container
- `bun run db:restart` - Restart the database container
- `bun run prisma:generate` - Generate Prisma client
- `bun run prisma:migrate` - Run database migrations
- `bun run prisma:studio` - Open Prisma Studio

### Production
- `bun run build` - Build the TypeScript project
- `bun run start:prod` - Run the production build
- `bun run docker:prod` - Run containers in production mode

### Other
- `bun run lint` - Run TypeScript type checking
- `bun run test` - Run tests

## Development

- The application runs in watch mode during development
- API documentation is available in development mode
- Database runs on port 5433 (host) and maps to 5432 (container)
- Use `bun run docker:logs` to view container logs
- Run `bun run prisma:migrate` after making changes to Prisma schema 