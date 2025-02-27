# Use an official Node.js, and it should be version 16 and above
FROM node:20-alpine
# Set the working directory in the container
WORKDIR app/
COPY ./apps/wams-cms-fe /app/apps/wams-cms-fe
COPY ./apps/wams-cms-fe/docker-prod.env /app/apps/wams-cms-fe/.env
COPY ./packages /app/packages
COPY package.json /app
COPY pnpm-workspace.yaml /app
COPY turbo.json /app
RUN npm install -g pnpm@9.12.3
RUN npm install turbo --global
RUN pnpm install
RUN pnpm run build:docker-prod
EXPOSE 4003

WORKDIR app/apps/wams-cms-fe
CMD ["pnpm", "start:docker-prod"]