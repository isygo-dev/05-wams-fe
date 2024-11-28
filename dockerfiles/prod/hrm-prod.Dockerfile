# Use an official Node.js, and it should be version 16 and above
FROM node:20-alpine
# Set the working directory in the container
WORKDIR app/
COPY ./apps/wams-hrm-fe /app/apps/wams-hrm-fe
COPY ./apps/wams-hrm-fe/docker-prod.env /app/apps/wams-hrm-fe/.env
COPY ./packages /app/packages
COPY package.json /app
COPY pnpm-workspace.yaml /app
COPY turbo.json /app
RUN npm install -g pnpm@8.15.7
RUN npm install turbo --global
RUN pnpm install
RUN pnpm run build:docker-prod
EXPOSE 4006

WORKDIR app/apps/wams-hrm-fe
CMD ["pnpm", "start:docker-prod"]