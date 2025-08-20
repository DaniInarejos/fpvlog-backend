import { gzipSync } from 'zlib';
import { AeronauticsApiResponse, AeronauticsResponse } from './aeronautics.types';

interface CacheEntry {
  data: Buffer; // Datos ya comprimidos
  timestamp: number;
  uncompressedSize: number;
}

interface CompressedDataResult {
  data: Buffer;
  size: number;
  isFromCache: boolean;
}

class AeronauticsCache {
  private cache: CacheEntry | null = null;
  private readonly CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 semana
  private readonly ENAIRE_API_URL = 'https://servais.enaire.es/insignia/rest/services/NSF_SRV/SRV_UAS_ZG_V0/MapServer/2/query?where=1%3D1&outFields=*&f=geojson';
  private readonly MAX_RETRIES = 3;
  private readonly TIMEOUT_MS = 120000; // 2 minutos
  private readonly RETRY_DELAY_MS = 5000; // 5 segundos entre reintentos

  async getCompressedData(): Promise<CompressedDataResult> {
    const now = Date.now();
    
    // Verificar si el cache es válido
    if (this.cache && (now - this.cache.timestamp) < this.CACHE_DURATION) {
      console.log('📋 Usando datos desde cache en memoria');
      return {
        data: this.cache.data,
        size: this.cache.uncompressedSize,
        isFromCache: true
      };
    }

    console.log('🔄 Obteniendo datos frescos desde ENAIRE API...');
    // Obtener datos frescos y comprimirlos
    const freshData = await this.fetchFromEnaireAPI();
    const responseData: AeronauticsResponse = {
      data: this.filterFeatureProperties(freshData),
      cachedAt: new Date().toISOString(),
      source: 'api'
    };
    
    const jsonString = JSON.stringify({
      success: true,
      ...responseData
    });
    
    const compressedData = gzipSync(jsonString);
    
    // Guardar en cache
    this.cache = {
      data: compressedData,
      timestamp: now,
      uncompressedSize: jsonString.length
    };

    console.log(`💾 Datos cacheados: ${(jsonString.length / 1024 / 1024).toFixed(2)}MB → ${(compressedData.length / 1024 / 1024).toFixed(2)}MB comprimido`);

    return {
      data: compressedData,
      size: jsonString.length,
      isFromCache: false
    };
  }

  private async fetchFromEnaireAPI(): Promise<AeronauticsApiResponse> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        console.log(`🔄 Intento ${attempt}/${this.MAX_RETRIES} - Conectando a ENAIRE API...`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);
        
        const response = await fetch(this.ENAIRE_API_URL, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'FPVLog-Backend/1.0',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive'
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data || !data.features || !Array.isArray(data.features)) {
          throw new Error('Formato de respuesta inválido desde ENAIRE API');
        }

        console.log(`✅ Datos obtenidos exitosamente: ${data.features.length} zonas aeronáuticas`);
        return data as AeronauticsApiResponse;
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.error(`❌ Intento ${attempt}/${this.MAX_RETRIES} falló:`, lastError.message);
        
        // Si no es el último intento, esperar antes del siguiente
        if (attempt < this.MAX_RETRIES) {
          console.log(`⏳ Esperando ${this.RETRY_DELAY_MS / 1000}s antes del siguiente intento...`);
          await this.delay(this.RETRY_DELAY_MS);
        }
      }
    }

    // Si llegamos aquí, todos los intentos fallaron
    console.error(`❌ Todos los intentos fallaron. Último error:`, lastError?.message);
    throw new Error(`Failed to fetch data from ENAIRE API after ${this.MAX_RETRIES} attempts: ${lastError?.message || 'Unknown error'}`);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private filterFeatureProperties(apiResponse: AeronauticsApiResponse): AeronauticsApiResponse {
    return {
      type: apiResponse.type,
      features: apiResponse.features.map(feature => ({
        type: feature.type,
        id: feature.id,
        geometry: feature.geometry,
        properties: {
          Name: feature.properties.Name || null,
          Type: feature.properties.Type || '',
          Reasons: feature.properties.Reasons || '',
          Message: feature.properties.Message || '',
          Lower: feature.properties.Lower || null,
          LowerReference: feature.properties.LowerReference || 'AGL',
          Upper: feature.properties.Upper || null,
          UpperReference: feature.properties.UpperReference || 'AGL',
          Email: feature.properties.Email || '',
          Phone: feature.properties.Phone || '',
          UpdateDateTime: feature.properties.UpdateDateTime || new Date().toISOString(),
          Identifier: feature.properties.Identifier || '',
          Country: feature.properties.Country || 'ESP',
          UOM: feature.properties.UOM || null,
          Day: feature.properties.Day || 'ANY'
        }
      }))
    };
  }

  // Método para limpiar el cache manualmente
  clearCache(): void {
    this.cache = null;
    console.log('🗑️ Cache limpiado manualmente');
  }
}

const aeronauticsCache = new AeronauticsCache();

export const getAeronauticsDataService = async (): Promise<CompressedDataResult> => {
  const result = await aeronauticsCache.getCompressedData();
  
  console.log(`📊 Datos aeronáuticos: ${(result.size / 1024 / 1024).toFixed(2)}MB → ${(result.data.length / 1024 / 1024).toFixed(2)}MB comprimido (${((1 - result.data.length / result.size) * 100).toFixed(1)}% reducción)`);
  
  return result;
};

export const refreshAeronauticsData = async (): Promise<AeronauticsResponse> => {
  console.log('🔄 Refrescando datos aeronáuticos manualmente...');
  
  // Limpiar cache existente
  aeronauticsCache.clearCache();
  
  // Obtener datos frescos
  const result = await aeronauticsCache.getCompressedData();
  
  // Descomprimir para devolver los datos JSON
  const jsonString = result.data.toString('utf8');
  const parsedData = JSON.parse(jsonString);
  
  return {
    data: parsedData.data,
    cachedAt: parsedData.cachedAt,
    source: parsedData.source
  };
};