import { Redis } from '@upstash/redis'
import { config } from './index'

const redis = new Redis({
  url: config.redis.url,
  token: config.redis.token,
})

// Verificar la conexión
async function testConnection() {
  try {
    await redis.ping()
    console.log('✅ Redis connection established successfully')
  } catch (error) {
    console.error('❌ Redis connection failed:', error)
    process.exit(1)
  }
}

testConnection()

interface CacheOptions {
  ttl?: number
}

export class CacheService {
  private defaultTTL = config.redis.ttl // Usar el TTL de la configuración

  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key)
    return value as T | null
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    const ttl = options?.ttl || this.defaultTTL
    await redis.set(key, value, { ex: ttl })
  }

  async delete(key: string): Promise<void> {
    await redis.del(key)
  }

  async deleteMany(keys: string[]): Promise<void> {
    if (keys.length === 0) return
    await Promise.all(keys.map(key => this.delete(key)))
  }

  async clear(): Promise<void> {
    await redis.flushall()
  }

  async loadData<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    const cachedData = await this.get<T>(key)
    
    if (cachedData) {
      return cachedData
    }

    const data = await fetchFn()
    await this.set(key, data, options)
    return data
  }
}

export const cacheService = new CacheService()
