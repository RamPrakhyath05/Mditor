FROM node:22-alpine

WORKDIR /app

COPY backend/package*.json ./

RUN npm ci

COPY backend .

EXPOSE 1234

CMD ["npm", "run", "ws"]
