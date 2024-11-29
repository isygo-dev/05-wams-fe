# Use an official Node.js, and it should be version 16 and above
FROM node:20-alpine
# Set the working directory in the container
WORKDIR app/
COPY ./apps/wams-gateway-fe /app/apps/wams-gateway-fe
COPY ./apps/wams-gateway-fe/docker-prod.env /app/apps/wams-gateway-fe/.env
COPY ./packages /app/packages
COPY package.json /app
COPY pnpm-workspace.yaml /app
COPY turbo.json /app
RUN npm install -g pnpm@9.12.3
RUN npm install turbo --global
RUN pnpm install
RUN pnpm run build:docker-prod
EXPOSE 4000

WORKDIR app/apps/wams-gateway-fe
CMD ["pnpm", "start:docker-prod"]