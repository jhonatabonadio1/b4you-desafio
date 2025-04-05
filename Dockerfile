FROM node:18-alpine

RUN apk update && apk add openssl

WORKDIR /usr/src/app/b4you

COPY package*.json ./

RUN yarn

COPY . .

COPY ./dist/ /b4you/

EXPOSE 3333

CMD [ "yarn", "prisma", "generate"]

CMD [ "yarn", "start"]