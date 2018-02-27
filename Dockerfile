FROM node:carbon

WORKDIR /usr/src/app
COPY Decrypt/package*.json ./
RUN ls && npm install
COPY Decrypt .

EXPOSE 3000
CMD [ "npm", "start" ]