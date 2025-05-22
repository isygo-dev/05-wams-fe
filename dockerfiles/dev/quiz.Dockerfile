# Use a lightweight Node.js 20 image
FROM node:20-alpine

# Create and set working directory
WORKDIR /app

# Copy root configuration files
COPY package.json pnpm-workspace.yaml turbo.json .npmrc ./

# Copy only necessary folders for build
COPY ./apps/wams-quizz-fe ./apps/wams-quizz-fe
COPY ./apps/wams-quizz-fe/docker-dev.env ./apps/wams-quizz-fe/.env
COPY ./packages ./packages

# Install pnpm globally and turbo
RUN npm install -g pnpm@9.12.3 turbo

# Install project dependencies
RUN pnpm install --frozen-lockfile

# Build only the current app with turbo
RUN pnpm turbo run build:docker-dev --filter=apps/wams-quizz-fe...

# Set working directory to the sysadmin frontend app
WORKDIR /app/apps/wams-quizz-fe

# Expose default port
EXPOSE 4005

# Start the frontend app using turbo filtered start
CMD ["pnpm", "turbo", "run", "start:docker-dev", "--filter=apps/wams-quizz-fe..."]