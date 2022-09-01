# Build stage
FROM node:16-alpine AS build

RUN apk update

RUN mkdir /app
COPY ./bot /app/bot
WORKDIR /app/bot

RUN npm install
RUN npm run 'build'


# Run stagge
FROM node:16-alpine

RUN apk update

RUN mkdir /app
RUN mkdir /app/bot
WORKDIR /app/bot

COPY --from=build /app/bot/dist /app/bot
COPY --from=build /app/bot/package.json /app/bot
COPY ./templates /app

RUN npm install --production

CMD [ "node", "index.js" ]
