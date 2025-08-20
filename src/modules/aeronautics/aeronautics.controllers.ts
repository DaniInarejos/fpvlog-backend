import { Context } from 'hono';
import { getAeronauticsDataService, refreshAeronauticsData } from './aeronautics.services';
import { gunzipSync } from 'zlib';

export const getAeronauticsDataController = async (c: Context) => {
  try {
    console.log('📡 Iniciando petición de datos aeronáuticos...');
    const startTime = Date.now();
    
    const result = await getAeronauticsDataService();
    
    const processingTime = Date.now() - startTime;
    console.log(`⚡ Datos procesados en ${processingTime}ms`);
    
    // ✅ CORRECCIÓN: Descomprimir los datos antes de enviar
    const decompressedData = gunzipSync(result.data).toString('utf8');
    const jsonData = JSON.parse(decompressedData);
    
    // Headers optimizados (sin Content-Encoding ya que enviamos JSON sin comprimir)
    c.header('Content-Type', 'application/json; charset=utf-8');
    c.header('Cache-Control', 'public, max-age=604800, immutable');
    c.header('ETag', `"${Date.now()}"`);
    c.header('X-Original-Size', result.size.toString());
    c.header('X-Compressed-Size', result.data.length.toString());
    c.header('X-Cache-Status', result.isFromCache ? 'HIT' : 'MISS');
    c.header('X-Processing-Time', `${processingTime}ms`);
    
    // ✅ Enviar JSON descomprimido
    return c.json(jsonData);
  } catch (error) {
    console.error('❌ Error en aeronautics controller:', error);
    
    // Determinar el tipo de error para dar una respuesta más específica
    let errorMessage = 'Failed to retrieve aeronautics data';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        errorMessage = 'La API de ENAIRE está tardando demasiado en responder. Inténtalo de nuevo más tarde.';
        statusCode = 504; // Gateway Timeout
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Error de conexión con la API de ENAIRE. Verifica tu conexión a internet.';
        statusCode = 502; // Bad Gateway
      } else {
        errorMessage = error.message;
      }
    }
    
    return c.json({ 
      success: false, 
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, statusCode);
  }
};

export const refreshAeronauticsDataController = async (context: Context) => {
  try {
    console.log('🔄 Iniciando refresh manual de datos aeronáuticos...');
    const startTime = Date.now();
    
    const data = await refreshAeronauticsData();
    
    const processingTime = Date.now() - startTime;
    console.log(`✅ Refresh completado en ${processingTime}ms`);
    
    return context.json({
      success: true,
      message: 'Datos actualizados correctamente',
      processingTime: `${processingTime}ms`,
      ...data
    });
  } catch (error) {
    console.error('❌ Error al refrescar datos aeronáuticos:', error);
    
    let errorMessage = 'Error al refrescar datos aeronáuticos';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        errorMessage = 'Timeout al conectar con la API de ENAIRE. La operación tardó demasiado.';
        statusCode = 504;
      } else {
        errorMessage = error.message;
      }
    }
    
    return context.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, statusCode);
  }
};