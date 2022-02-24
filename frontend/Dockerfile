FROM node:16-alpine as build

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .
RUN yarn build-storybook

FROM nginx:1.21-alpine as serve

RUN mkdir -p /etc/nginx/conf.d
COPY ./storybook.conf /etc/nginx/conf.d

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/storybook-static .
