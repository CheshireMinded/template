# Multi-stage build for security and size optimization
FROM node:20-alpine AS build
WORKDIR /app

# Install all dependencies (including devDependencies for TypeScript)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npx tsc -p tsconfig.json

# Production stage
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

# Security: Create non-root user to reduce attack surface
# Running as non-root limits impact of container escape vulnerabilities
RUN addgroup -g 1001 -S app && \
    adduser -S app -u 1001 -G app

# Install production dependencies only (reduces attack surface)
# Multi-stage build ensures dev dependencies never reach production image
COPY package*.json ./
RUN npm ci --omit=dev && \
    npm cache clean --force

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Security: Change ownership to non-root user
RUN chown -R app:app /app

# Security: Run as non-root user
USER app

EXPOSE 3000
CMD ["node", "dist/index.js"]

