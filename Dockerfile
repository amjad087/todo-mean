### STAGE 1: Build ###
FROM node:12.7-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod
### STAGE 2: Run ###
FROM nginx
RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/todo /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx