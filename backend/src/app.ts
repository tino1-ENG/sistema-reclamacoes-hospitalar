import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error-handler.js';
import { swaggerSpec } from './docs/swagger.js';

export const app = express();

// Segurança e Cabeçalhos HTTP
app.use(helmet());

// Controlo de Origens (CORS)
app.use(
  cors({
    origin: [env.CORS_ORIGIN, 'http://localhost:9000', 'http://127.0.0.1:9000'],
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

// Tratamento Global de Erros
app.use(errorHandler);
