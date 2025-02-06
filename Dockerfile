FROM node:18-alpine AS builder
WORKDIR /usr/src/app

RUN npm i -g pnpm

COPY package.json ./
RUN if [ -f pnpm-lock.yaml ]; then cp pnpm-lock.yaml ./; fi

RUN pnpm install 
ENV NODE_ENV=PRODUCTION

COPY . .

RUN pnpm run build

COPY .env .env

RUN export $(cat .env | xargs)

EXPOSE ${APP_PORT}

CMD [ "npm", "run", "start:prod" ]
