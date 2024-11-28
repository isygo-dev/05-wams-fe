# Use an official Node.js, and it should be version 16 and above
FROM node:20-alpine
# Set the working directory in the container
WORKDIR app/
COPY ./apps/smart-code-fe /app/apps/smart-code-fe
COPY ./apps/smart-code-fe/dev-be-local.env /app/apps/smart-code-fe/.env
COPY ./packages /app/packages
COPY package.json /app
COPY pnpm-workspace.yaml /app
COPY turbo.json /app
RUN npm install -g pnpm@8.15.7
RUN npm install turbo --global
RUN pnpm install
RUN pnpm run build:dev-be-local
EXPOSE 4008

WORKDIR app/apps/smart-code-fe
CMD ["pnpm", "start:dev-be-local"]