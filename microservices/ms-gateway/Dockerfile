FROM node:22-alpine3.22 AS stage_base
WORKDIR /app

FROM stage_base AS stage_deps
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

FROM stage_base AS stage_build
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci
COPY . .
RUN npm run build

FROM stage_base AS stage_production
RUN apk add curl -y
COPY --from=stage_build /app/dist ./dist
COPY --from=stage_deps /app/node_modules ./node_modules
COPY --from=stage_build /app/package.json ./package.json
COPY --from=stage_build /app/.env ./.env

CMD [ "npm", "run", "start" ]

