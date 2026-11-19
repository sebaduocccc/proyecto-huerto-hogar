# ---------- etapa 1: compilar el frontend ----------
FROM docker.io/library/node:22-alpine AS build
WORKDIR /app

# primero solo package.json para cachear las dependencias
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# en produccion la API esta en el mismo servidor (nginx la reenvia al backend)
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---------- etapa 2: servir con nginx ----------
FROM docker.io/library/nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
