# Stage 1: Builder - Install dependencies and build the Next.js application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and lock files (yarn.lock or package-lock.json)
# Using `*` ensures either yarn.lock or package-lock.json is copied if it exists
COPY package.json yarn.lock* package-lock.json* ./

# Install dependencies
# Using `|| true` to prevent build failure if one of the install commands fails (e.g., no yarn.lock for yarn install)
RUN yarn install --frozen-lockfile || npm install --force

# Copy the rest of the application code
COPY . .

# Build the Next.js application for production
RUN yarn build || npm run build

# Stage 2: Runner - Serve the built Next.js application
FROM node:18-alpine AS runner

WORKDIR /app

# Set environment variables for production build
ENV NODE_ENV production

# Next.js will use this to determine where to serve static assets from.
# Make sure your frontend code is still pointing to the backend via http://127.0.0.1:5000.
# If you deploy these to different servers later, you'd change this URL.
# ENV NEXT_PUBLIC_BACKEND_URL=http://backend:5000 # IMPORTANT: Use 'backend' (service name) as hostname, not localhost, because they are in the same Docker network

# Copy necessary files from the builder stage
# These are the optimized build output and node_modules for production.
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
# Copy package.json if your start script relies on it (common for `npm start`)
COPY --from=builder /app/package.json ./package.json

# Expose the port Next.js serves on (default 3000)
EXPOSE 3000

# Command to run the Next.js application in production mode
CMD ["npm", "start"]