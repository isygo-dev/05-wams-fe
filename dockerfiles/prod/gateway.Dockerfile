# Use a lightweight Node.js 20 image
FROM node:20-alpine

# Create and set working directory
WORKDIR /app

# Copy root configuration files
COPY package.json pnpm-workspace.yaml turbo.json .npmrc ./

# Copy only necessary folders for build
COPY ./apps/wams-gateway-fe ./apps/wams-gateway-fe
COPY ./apps/wams-gateway-fe/docker-prod.env ./apps/wams-gateway-fe/.env
COPY ./packages ./packages

# Install pnpm globally and turbo
RUN npm install -g pnpm@9.12.3 turbo

# Install project dependencies
RUN pnpm install --frozen-lockfile

# Build only the current app with turbo
RUN pnpm turbo run build:docker-prod --filter=apps/wams-gateway-fe...

# Set working directory to the sysadmin frontend app
WORKDIR /app/apps/wams-gateway-fe

# Expose default port
EXPOSE 4000

# Start the frontend app using turbo filtered start
CMD ["pnpm", "turbo", "run", "start:docker-prod", "--filter=apps/wams-gateway-fe..."]