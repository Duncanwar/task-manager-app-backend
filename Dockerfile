#Installs Node.js image
FROM node:20-bullseye-slim AS base

# sets the working directory for any RUN, CMD, COPY command
# all files we put in the Docker container running the server will be in /usr/src/app (e.g. /usr/src/app/package.json)
WORKDIR /usr/src/app

# Copies package.json, package-lock.json, tsconfig.json, .env to the root of WORKDIR
COPY  ./src ./src

# Installs packages
RUN yarn install

# Runs the dev npm script to build & start the server
CMD npm run dev
