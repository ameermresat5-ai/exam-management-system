FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

COPY backend/src ./src
COPY database /database

EXPOSE 5000

CMD ["npm", "start"]