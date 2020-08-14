FROM node:alpine

WORKDIR /tonight/app

COPY package*.json . /tonight/app/

RUN npm install

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]