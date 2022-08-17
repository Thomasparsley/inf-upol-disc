# Build stage
FROM node:16-alpine AS build

RUN apk update

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN npm i
RUN npm run 'build'


# Run stagge
FROM node:16-alpine

RUN apk update

RUN mkdir /app
WORKDIR /app

COPY --from=build ./dist /app
COPY ./package.json /app
COPY ./package-lock.json /app

RUN npm install --production

CMD [ "node", "index.js" ]
