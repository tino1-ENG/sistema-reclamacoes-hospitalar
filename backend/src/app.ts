import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error-handler.js';
import { swaggerSpec } from './docs/swagger.js';

export const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist/spa');

// Segurança e Cabeçalhos HTTP (Sem bloquear recursos de fontes externas ou imagens)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

// Controlo de Origens (CORS Permissivo para Túneis e Dispositivos Móveis)
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

// Processamento de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rota de Verificação de Saúde do Servidor
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    system: 'HospitalCare Backend',
    location: 'Moçambique (Africa/Maputo)',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
});

// Documentação Swagger / OpenAPI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas da API REST
app.use('/api', routes);

// Servir o Frontend SPA compilado (Produção Ultra-Rápida para Celulares e Túneis)
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Tratamento Global de Erros
app.use(errorHandler);
