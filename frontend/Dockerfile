# Use a lightweight Node.js image
FROM node:20-alpine AS base

# Install dependencies in a separate stage
FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* ./
RUN \
    if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    else npm install --immutable; \
    fi

# Build the Next.js application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# This disables telemetry (optional, but good practice for CI/CD)
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production stage for the Next.js application
FROM base AS runner
WORKDIR /app

# Set production environment variables
ENV NODE_ENV production
# Next.js defaults to PORT 3000, which is fine

# Copy necessary files from the build stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# Expose the port Next.js runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]