# ==========================================
# HospitalCare Backend — Dockerfile Multi-Stage
# Node.js 20 Alpine / Express / TypeScript / MongoDB
# ==========================================

# 1. Estágio de Compilação (Build)
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build

# 2. Estágio de Execução (Production Runner)
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# Utilizador sem privilégios de root para segurança hospitalar
USER node

EXPOSE 5000

CMD ["node", "dist/server.js"]
