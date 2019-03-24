FROM node:11-alpine

RUN mkdir -p /opt/backend-app
WORKDIR /opt/backend-app

COPY package.json .
RUN npm install --quiet

RUN npm install nodemon -g --quiet

COPY . .

EXPOSE ${APP_PORT}

CMD npm start