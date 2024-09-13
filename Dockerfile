FROM node:22-alpine
WORKDIR /usr/src/app

RUN chown node:node ./
USER node

COPY --chown=node:node app/package*.json ./

RUN npm install

COPY app/. ./

CMD ["npm", "start"]
