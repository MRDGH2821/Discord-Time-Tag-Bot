FROM node:lts-slim

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY ./out ./out

RUN useradd ttg-bot

USER ttg-bot

HEALTHCHECK NONE

CMD ["node", "./out/index.js"]