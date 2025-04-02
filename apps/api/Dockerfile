# Base image with configurable Node version
ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine AS base
RUN apk update && apk add --no-cache libc6-compat curl

# Generate a partial monorepo for the API package
FROM base AS builder
WORKDIR /app
RUN yarn global add turbo --network-timeout 1000000
COPY . .
RUN turbo prune --scope=api --docker

# Install dependencies
FROM base AS installer
WORKDIR /app
# Copy the pruned dependencies
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/turbo.json ./turbo.json
RUN yarn install --frozen-lockfile --network-timeout 1000000

# Build the application
FROM base AS sourcer
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore
RUN yarn turbo run build

# Production stage
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 api-group && \
    adduser --system --uid 1001 api-user

# Copy necessary files with proper ownership
COPY --from=sourcer --chown=api-user:api-group /app/ .
COPY --from=sourcer --chown=api-user:api-group /app/apps/api/dist /app/apps/api/dist
COPY --from=sourcer --chown=api-user:api-group /app/node_modules /app/node_modules

# Switch to non-root user
USER api-user

ENV NODE_ENV=production
EXPOSE 4000

CMD [ "node", "apps/api/dist/main.js" ]

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD curl -f http://localhost:4000/health || exit 1