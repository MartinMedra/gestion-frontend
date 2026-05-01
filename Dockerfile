FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build de producción
RUN npm run build

# Servir el build con un servidor estático simple
RUN npm install -g serve

EXPOSE 5173

CMD serve -s dist -l 5173