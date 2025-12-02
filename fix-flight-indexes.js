// Script para limpiar índices problemáticos en la colección flights
// Ejecutar con: node fix-flight-indexes.js

const { MongoClient } = require('mongodb');

async function fixFlightIndexes() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/fpvlog');
  
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    
    const db = client.db();
    const collection = db.collection('flights');
    
    // Obtener índices existentes
    const indexes = await collection.indexes();
    console.log('Índices existentes:', indexes.map(idx => ({ name: idx.name, key: idx.key })));
    
    // Eliminar índices problemáticos que incluyen 'tags' en índices de texto
    const problematicIndexes = indexes.filter(idx => 
      idx.key && 
      Object.values(idx.key).includes('text') && 
      idx.key.tags
    );
    
    for (const idx of problematicIndexes) {
      console.log(`Eliminando índice problemático: ${idx.name}`);
      await collection.dropIndex(idx.name);
    }
    
    console.log('✅ Índices problemáticos eliminados');
    console.log('Ahora reinicia la aplicación para que se creen los nuevos índices correctos');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixFlightIndexes();