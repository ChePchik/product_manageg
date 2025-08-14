FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production && cp -R node_modules /prod_node_modules

# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY tsconfig.json ./
COPY src ./src
COPY ormconfig.ts ./
RUN npm ci
RUN npm run build
# RUN npm run docker:init

# 

# Runtime image
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /prod_node_modules ./node_modules
COPY --from=build /app/build ./build
COPY ormconfig.ts ./
EXPOSE 3000
# runtime needs dotenv file from env vars only
CMD ["node", "build/src/index.js"]