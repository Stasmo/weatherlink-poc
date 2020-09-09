FROM node:12

ADD . .

RUN npm install

CMD npm start
