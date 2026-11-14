FROM node:24.22.1-alpine3.24

WORKDIR /app

ENV port=8080

COPY package.json ./
RUN npm install
COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]
