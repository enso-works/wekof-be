FROM oven/bun:1

WORKDIR /app

# Copy package.json first
COPY package.json .
COPY tsconfig.json .

# Install dependencies (this will create bun.lockb if it doesn't exist)
RUN bun install

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Build TypeScript files
RUN bun run build

# Expose the port the app runs on
EXPOSE 8080

# Start the application in development mode
CMD ["bun", "run", "start:dev"] 