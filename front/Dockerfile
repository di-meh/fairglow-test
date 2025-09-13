FROM node:lts-alpine AS build-stage

WORKDIR /app

COPY package*.json /app/

RUN npm ci

COPY ./ /app/

ARG VITE_API_URL=${VITE_API_URL}

CMD ["npm", "run", "dev"]