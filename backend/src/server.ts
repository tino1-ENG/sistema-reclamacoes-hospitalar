import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectDatabase } from './config/database.js';

async function bootstrap() {
  try {
    // 1. Ligar ao MongoDB
    await connectDatabase();

    // 2. Iniciar escuta HTTP
    app.listen(env.PORT, () => {
      logger.info(`🚀 Servidor HospitalCare ativo na porta ${env.PORT}`);
      logger.info(`📚 Documentação Swagger disponível em: http://localhost:${env.PORT}/api/docs`);
      logger.info(`🏥 Piloto: Hospital Central de Maputo (Moçambique)`);
    });
  } catch (error) {
    logger.error({ err: error }, 'Erro fatal ao inicializar o servidor.');
    process.exit(1);
  }
}

bootstrap();
