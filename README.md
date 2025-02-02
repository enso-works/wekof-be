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
2. Run the development environment:
   ```bash
   docker compose up
   ```
3. Access the API at `http://localhost:8080`
4. View API documentation at `http://localhost:8080/api-docs`

## Development

- The application runs in watch mode during development
- API documentation is available in development mode
- Database runs on port 5433 (host) and maps to 5432 (container)
- Prisma migrations can be run using `bun run prisma:migrate` 