# syntax=docker/dockerfile:1

FROM node:24-bookworm-slim AS builder
ENV HUSKY=0
RUN corepack enable && corepack prepare pnpm@11.20.0 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG NEXT_PUBLIC_API_URL=/api
ARG NEXT_PUBLIC_GRAPHQL_URL=/graphql
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GRAPHQL_URL=$NEXT_PUBLIC_GRAPHQL_URL
RUN pnpm build

FROM node:24-bookworm-slim AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
WORKDIR /app
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
# npm is bundled in the base image but unused at runtime (only `node server.js`
# runs here); dropping it removes its bundled vulnerable `tar` dependency.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
USER node
EXPOSE 3000
CMD ["node", "server.js"]
