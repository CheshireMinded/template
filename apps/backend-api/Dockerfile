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

# Create non-root user
RUN addgroup -g 1001 -S app && \
    adduser -S app -u 1001 -G app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && \
    npm cache clean --force

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Change ownership to non-root user
RUN chown -R app:app /app

USER app

EXPOSE 3000
CMD ["node", "dist/index.js"]

