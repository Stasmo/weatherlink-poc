FROM node:12-alpine

ADD . .

RUN npm install

CMD npm start
