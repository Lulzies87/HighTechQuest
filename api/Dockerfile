FROM node:18

WORKDIR /usr/src/app

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# Start the server
CMD ["npm", "run", "start"]