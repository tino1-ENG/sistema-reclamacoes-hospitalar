# ==========================================
# HospitalCare Frontend — Dockerfile Multi-Stage
# Vue 3 / Quasar Framework / Nginx Alpine
# ==========================================

# 1. Estágio de Compilação (Build)
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Argumento e variável de ambiente para a API em produção
ARG VITE_API_URL="http://localhost:5000/api"
ENV VITE_API_URL=${VITE_API_URL}
ENV API_URL=${VITE_API_URL}

RUN npm run build

# 2. Estágio de Execução (Nginx Web Server)
FROM nginx:alpine AS runner

# Copiar artefactos estáticos gerados pelo Quasar
COPY --from=builder /app/dist/spa /usr/share/nginx/html

# Copiar configuração otimizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
