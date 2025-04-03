# Base image with configurable versions
ARG NODE_VERSION=22
ARG ALPINE_VERSION=3.21
ARG PNPM_VERSION="^10.0.0"
ARG TURBO_VERSION="^2.4.4"

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS alpine
RUN apk update && apk add --no-cache libc6-compat curl

FROM alpine AS base

# Pnpm ENV
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN \
    # Install pnpm
    # corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
    npm install -g pnpm@${PNPM_VERSION} turbo@${TURBO_VERSION}

# Generate a partial monorepo for the API package
FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune --scope=api --docker

# Install dependencies
FROM base AS installer
WORKDIR /app
# Copy the pruned dependencies
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/turbo.json ./turbo.json
RUN  --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Build the application
FROM base AS sourcer
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore
RUN pnpm turbo run build

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