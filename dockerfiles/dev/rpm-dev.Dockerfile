# Use an official Node.js, and it should be version 16 and above
FROM node:20-alpine
# Set the working directory in the container
WORKDIR app/
COPY ./apps/wams-rpm-fe /app/apps/wams-rpm-fe
COPY ./apps/wams-rpm-fe/docker-dev.env /app/apps/wams-rpm-fe/.env
COPY ./packages /app/packages
COPY package.json /app
COPY pnpm-workspace.yaml /app
COPY turbo.json /app
RUN npm install -g pnpm@8.15.7
RUN npm install turbo --global
RUN pnpm install
RUN pnpm run build:docker-dev
EXPOSE 4002

WORKDIR app/apps/wams-rpm-fe
CMD ["pnpm", "start:docker-dev"]