import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore
}
import mongoose from 'mongoose';

/**
 * Script de Migração Local -> MongoDB Atlas
 * Copia todas as coleções do MongoDB local (127.0.0.1:27017/hospitalcare)
 * para o cluster na nuvem MongoDB Atlas.
 */

async function migrate() {
  const targetUri = process.argv[2] || process.env.TARGET_DATABASE_URL;

  if (!targetUri) {
    console.error('❌ Por favor, forneça a URL de conexão do MongoDB Atlas.');
    console.log('Exemplo: npm run migrate:atlas "mongodb+srv://admin:senha@cluster0.xxx.mongodb.net/hospitalcare?retryWrites=true&w=majority"');
    process.exit(1);
  }

  const localUri = process.env.LOCAL_DATABASE_URL || 'mongodb://127.0.0.1:27017/hospitalcare';

  console.log(`🔌 1. A ligar ao MongoDB local: ${localUri}...`);
  const localConn = await mongoose.createConnection(localUri).asPromise();
  console.log('✅ Ligado ao MongoDB local.');

  console.log(`☁️ 2. A ligar ao MongoDB Atlas na nuvem...`);
  const targetConn = await mongoose.createConnection(targetUri).asPromise();
  console.log('✅ Ligado ao MongoDB Atlas na nuvem com sucesso!');

  const collections = await localConn.db!.listCollections().toArray();
  console.log(`📦 Encontradas ${collections.length} coleções locais para migrar.`);

  for (const collInfo of collections) {
    const collName = collInfo.name;
    if (collName.startsWith('system.')) continue;

    const localColl = localConn.db!.collection(collName);
    const targetColl = targetConn.db!.collection(collName);

    const docs = await localColl.find({}).toArray();
    console.log(`   - [${collName}]: ${docs.length} documentos encontrados.`);

    if (docs.length > 0) {
      await targetColl.deleteMany({});
      await targetColl.insertMany(docs);
      console.log(`     ✅ ${docs.length} documentos copiados para o Atlas.`);
    }
  }

  console.log('\n🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
  console.log('Todos os utilizadores, reclamações e configurações locais agora estão no MongoDB Atlas.');

  await localConn.close();
  await targetConn.close();
  process.exit(0);
}

migrate().catch((err) => {
  console.error('❌ Erro durante a migração:', err);
  process.exit(1);
});
