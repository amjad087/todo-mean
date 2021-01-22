### STAGE 1: Build ###
FROM node:12.7-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json /usr/src/app/
RUN npm install
RUN npm install -g @angular/cli@9.0.3
COPY . /usr/src/app/

EXPOSE 4200
CMD ng serve --host 0.0.0.0