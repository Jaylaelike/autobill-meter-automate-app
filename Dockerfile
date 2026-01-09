# Multi-stage Docker build for GE Automate Meter Node
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm db:generate

# ==================== Backend Stage ====================
FROM base AS backend

# Set working directory
WORKDIR /app

# Copy backend files
COPY monitor.js chaigmai.js ./
COPY src/ ./src/
COPY prisma/ ./prisma/

# Create logs directory
RUN mkdir -p logs

# Expose port (if needed for health checks)
EXPOSE 3001

# Start backend monitor
CMD ["pnpm", "start"]

# ==================== Frontend Build Stage ====================
FROM base AS frontend-builder

# Set working directory for frontend
WORKDIR /app/frontend/meter-reading-dashboard

# Copy frontend package files
COPY frontend/meter-reading-dashboard/package.json frontend/meter-reading-dashboard/pnpm-lock.yaml ./

# Install frontend dependencies
RUN pnpm install --frozen-lockfile

# Copy frontend source
COPY frontend/meter-reading-dashboard/ ./

# Build frontend
RUN pnpm build

# ==================== Frontend Production Stage ====================
FROM node:18-alpine AS frontend

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy built frontend
COPY --from=frontend-builder /app/frontend/meter-reading-dashboard/.next ./.next
COPY --from=frontend-builder /app/frontend/meter-reading-dashboard/public ./public
COPY --from=frontend-builder /app/frontend/meter-reading-dashboard/package.json ./
COPY --from=frontend-builder /app/frontend/meter-reading-dashboard/pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Expose port
EXPOSE 3000

# Start frontend
CMD ["pnpm", "start"]

# ==================== Full Application Stage ====================
FROM base AS app

# Create logs directory
RUN mkdir -p logs

# Copy all application files
COPY monitor.js chaigmai.js ./
COPY src/ ./src/
COPY prisma/ ./prisma/
COPY frontend/ ./frontend/

# Build frontend
WORKDIR /app/frontend/meter-reading-dashboard
RUN pnpm install --frozen-lockfile
RUN pnpm build

# Return to app root
WORKDIR /app

# Create startup script
RUN echo '#!/bin/sh\n\
echo "Starting GE Automate Meter Node..."\n\
\n\
# Run database migrations\n\
pnpm db:push\n\
\n\
# Start backend monitor in background\n\
node monitor.js > logs/monitor.log 2>&1 &\n\
BACKEND_PID=$!\n\
\n\
# Start frontend dashboard\n\
cd frontend/meter-reading-dashboard\n\
pnpm start &\n\
FRONTEND_PID=$!\n\
\n\
# Wait for both processes\n\
wait $BACKEND_PID $FRONTEND_PID\n\
' > start.sh && chmod +x start.sh

# Expose ports
EXPOSE 3000 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
CMD ["./start.sh"]