FROM node:10.15-alpine

RUN mkdir -p /tracing-api
WORKDIR /tracing-api

COPY package.json package-lock.json ./
RUN npm install --production
COPY src/ ./src/
COPY config.js ./

ENV NODE_ENV production

EXPOSE 3000
CMD [ "npm", "start" ]
