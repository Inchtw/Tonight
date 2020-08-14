FROM node:alpine

WORKDIR /tonight/app

COPY package*.json . /tonight/app/

RUN npm install

COPY . .


CMD [ "npm", "start" ]