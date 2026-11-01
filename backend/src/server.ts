import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectDatabase } from './config/database.js';
import { Department } from './models/index.js';
import { seed } from './database/seed.js';

async function bootstrap() {
  try {
    // 1. Ligar ao MongoDB
    await connectDatabase();

    // 2. Auto-inicialização de dados se a base de dados estiver vazia (ex: novo cluster MongoDB Atlas)
    try {
      const deptCount = await Department.countDocuments();
      if (deptCount === 0) {
        logger.info('📦 Base de dados vazia detetada. A executar inicialização automática de sementeira (seed)...');
        await seed(false);
      }
    } catch (seedErr) {
      logger.warn({ err: seedErr }, 'Aviso: Não foi possível verificar ou executar a inicialização automática.');
    }

    // 3. Iniciar escuta HTTP
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
