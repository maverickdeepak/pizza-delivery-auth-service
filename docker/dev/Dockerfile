FROM node:18
WORKDIR /usr/src/app
COPY package*.json /usr/src/app
RUN npm install
COPY . .
EXPOSE 5555
CMD [ "npm", "run", "dev" ]