// src/db/mongo.ts
import mongoose from 'mongoose'
import { logger } from '../utils/logger'

interface DatabaseConfig {
  maxRetries: number
  retryInterval: number
  timeout: number
  maxPoolSize: number
  maxIdleTimeMS: number
  serverSelectionTimeoutMS: number
  socketTimeoutMS: number
  heartbeatFrequencyMS?: number
}

const dbConfig: DatabaseConfig = {
  maxRetries: 2,
  retryInterval: 5000,               // 5s entre intentos
  timeout: 10000,                    // no usado directamente, mantenido por compat
  maxPoolSize: 20,
  maxIdleTimeMS: 180000,             // 3min para adelgazar el pool en reposo
  serverSelectionTimeoutMS: 10000,   // 10s para elegir servidor
  socketTimeoutMS: 45000,            // 45s inactividad de socket
  // heartbeatFrequencyMS: 10000,    // deja el default o descomenta si quieres 10s
}

// ---------- Utilidades ----------
const formatError = (error: any): string => {
  if (error?.code === 8000 && error?.codeName === 'AtlasError') {
    return 'Error de autenticación: Credenciales inválidas'
  }
  return error?.message || 'Error desconocido'
}

// ---------- Estado global para evitar duplicados ----------
declare global {
  // Promesa singleton de conexión
  // eslint-disable-next-line no-var
  var __mongooseConnPromise: Promise<typeof mongoose> | null
  // Para no registrar listeners múltiples
  // eslint-disable-next-line no-var
  var __mongooseListenersAttached: boolean | undefined
}
global.__mongooseConnPromise ??= null
global.__mongooseListenersAttached ??= false

// ---------- Listeners (una sola vez) ----------
const attachConnectionListenersOnce = () => {
  if (global.__mongooseListenersAttached) return
  global.__mongooseListenersAttached = true

  mongoose.connection.on('disconnected', () => {
    logger.info('🔌 MongoDB disconnected')
  })

  mongoose.connection.on('error', (error) => {
    const formattedError = formatError(error)
    logger.error('🚨 MongoDB connection error:', formattedError)
  })
}

// ---------- Señales de cierre ordenado ----------
const graceful = async (signal: string) => {
  try {
    await mongoose.connection.close()
    logger.info(`MongoDB connection closed due to ${signal}`)
  } catch (err) {
    logger.warn(`Error closing MongoDB on ${signal}: ${formatError(err)}`)
  } finally {
    process.exit(0)
  }
}

process.on('SIGINT', () => graceful('SIGINT'))
process.on('SIGTERM', () => graceful('SIGTERM'))

// ---------- Conexión con reintentos y protección anti-duplicados ----------
const connectWithRetry = async (retryCount = 0): Promise<void> => {
  const mongoUri = process.env.MONGO_URI
  if (!mongoUri) {
    throw new Error('MONGO_URI environment variable not defined')
  }

  // Si ya hay una conexión establecida, no hagas nada
  if (mongoose.connection.readyState === 1) {
    logger.info('✅ MongoDB already connected — reusing existing pool')
    attachConnectionListenersOnce()
    return
  }

  // Si está conectando, espera a la promesa existente
  if (mongoose.connection.readyState === 2 && global.__mongooseConnPromise) {
    logger.info('⏳ MongoDB is currently connecting — awaiting existing connection')
    attachConnectionListenersOnce()
    await global.__mongooseConnPromise
    return
  }

  // Si existe promesa anterior pero el estado no es connecting, resetea
  if (global.__mongooseConnPromise && mongoose.connection.readyState !== 2) {
    global.__mongooseConnPromise = null
  }

  try {
    const options: mongoose.ConnectOptions = {
      // Pooling
      maxPoolSize: dbConfig.maxPoolSize,
      // minPoolSize NO establecido (por defecto 0) para evitar coste fijo y fugas al reiniciar
      maxIdleTimeMS: dbConfig.maxIdleTimeMS,

      // Timeouts
      serverSelectionTimeoutMS: dbConfig.serverSelectionTimeoutMS,
      socketTimeoutMS: dbConfig.socketTimeoutMS,

      // Otros
      bufferCommands: false,
      // ...(dbConfig.heartbeatFrequencyMS ? { heartbeatFrequencyMS: dbConfig.heartbeatFrequencyMS } : {}),
    }

    attachConnectionListenersOnce()

    // Crea y guarda la promesa singleton antes de await para deduplicar llamados concurrentes
    global.__mongooseConnPromise = mongoose.connect(mongoUri, options)
    await global.__mongooseConnPromise

    logger.info('✅ MongoDB connected successfully')
  } catch (error) {
    const formattedError = formatError(error)
    logger.error(`❌ Connection attempt ${retryCount + 1}/${dbConfig.maxRetries + 1} failed: ${formattedError}`)

    // Importantísimo: cierra cualquier estado parcial antes de reintentar
    try {
      await mongoose.disconnect()
    } catch {
      // ignore
    }
    global.__mongooseConnPromise = null

    if (retryCount < dbConfig.maxRetries) {
      const seconds = Math.round(dbConfig.retryInterval / 1000)
      logger.info(`🔄 Retrying connection in ${seconds} seconds...`)
      await new Promise((resolve) => setTimeout(resolve, dbConfig.retryInterval))
      return connectWithRetry(retryCount + 1)
    }

    logger.error('❌ Maximum number of attempts reached. Exiting process.')
    process.exit(1)
  }
}

// ---------- API opcional para cerrar manualmente ----------
export const disconnectFromMongo = async () => {
  try {
    await mongoose.disconnect()
    global.__mongooseConnPromise = null
    logger.info('🔒 MongoDB disconnected manually')
  } catch (err) {
    logger.warn(`Error on manual disconnect: ${formatError(err)}`)
  }
}

export default connectWithRetry
