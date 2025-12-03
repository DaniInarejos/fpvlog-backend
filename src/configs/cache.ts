import { createClient, RedisClientType } from 'redis'
import { logger } from '../utils/logger'
import config from './index'

type MemoryEntry = { value: unknown; expiresAt: number }

let client: RedisClientType | null = null
if (config.redis.url) {
  try {
    client = createClient({ url: config.redis.url })
  } catch {
    client = null
  }
}

async function testConnection(): Promise<void> {
  if (!client) {
    logger.warn('Redis disabled or missing configuration, using in-memory cache')
    return
  }
  try {
    await client.connect()
    await client.ping()
    logger.info('✅ Redis connection established successfully')
  } catch (error) {
    logger.warn('❌ Redis connection failed: falling back to in-memory cache', error as any)
    client = null
  }
}

void testConnection()

interface CacheOptions {
  ttl?: number
}

export class CacheService {
  private defaultTTL = config.redis.ttl
  private memory = new Map<string, MemoryEntry>()

  private now(): number {
    return Date.now()
  }

  async get<T>(key: string): Promise<T | null> {
    if (client) {
      try {
        const raw = await client.get(key)
        if (raw == null) return null
        return deserialize<T>(raw)
      } catch {}
    }
    const entry = this.memory.get(key)
    if (!entry) return null
    if (entry.expiresAt <= this.now()) {
      this.memory.delete(key)
      return null
    }
    return entry.value as T
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    const ttl = options?.ttl || this.defaultTTL
    if (client) {
      try {
        await client.set(key, serialize(value), { EX: ttl })
      } catch {}
    }
    this.memory.set(key, { value, expiresAt: this.now() + ttl * 1000 })
  }

  async delete(key: string): Promise<void> {
    if (client) {
      try {
        await client.del(key)
      } catch {}
    }
    this.memory.delete(key)
  }

  async deleteMany(keys: string[]): Promise<void> {
    if (keys.length === 0) return
    const patterns = keys.filter(k => k.includes('*'))
    const exacts = keys.filter(k => !k.includes('*'))
    await Promise.all(exacts.map(k => this.delete(k)))
    await Promise.all(patterns.map(p => this.deletePattern(p)))
  }

  // NUEVO: Método para borrar claves que coincidan con un patrón
  async deletePattern(pattern: string): Promise<void> {
    if (client) {
      try {
        const keys = await client.keys(pattern)
        if (keys.length > 0) {
          await client.del(keys)
        }
      } catch (error) {
        logger.error('Error deleting cache pattern:', error)
      }
    }
    const regex = new RegExp('^' + pattern.split('*').map(escapeRegex).join('.*') + '$')
    for (const key of this.memory.keys()) {
      if (regex.test(key)) this.memory.delete(key)
    }
  }

  async clear(): Promise<void> {
    if (client) {
      try {
        await client.flushAll()
      } catch {}
    }
    this.memory.clear()
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

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function serialize<T>(value: T): string {
  return JSON.stringify(value)
}

function deserialize<T>(raw: string): T {
  try {
    return JSON.parse(raw) as T
  } catch {
    return raw as unknown as T
  }
}

export const cacheService = new CacheService()
