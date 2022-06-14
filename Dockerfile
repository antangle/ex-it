FROM node:16

WORKDIR /usr/app

COPY package*.json /usr/app

RUN npm install

COPY . /usr/app

EXPOSE 3000

RUN npm install nodemon -g

RUN npm run build

CMD ["nodemon", "dist/main.js"]