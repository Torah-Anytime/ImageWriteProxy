FROM node:14-alpine
WORKDIR /app

COPY . ./

RUN npm install --production

RUN npm run build

ENTRYPOINT [ "npm", "start" ]