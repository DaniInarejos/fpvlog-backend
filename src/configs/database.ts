import mongoose from 'mongoose'
import { logger } from '../utils/logger'

interface DatabaseConfig {
  maxRetries: number
  retryInterval: number
  timeout: number
  // 🆕 Nuevas configuraciones
  maxPoolSize: number
  minPoolSize: number
  maxIdleTimeMS: number
}

const dbConfig: DatabaseConfig = {
  maxRetries: 2,
  retryInterval: 5000,
  timeout: 10000,
  // 🔧 Configuración de Pool optimizada
  maxPoolSize: 20,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
}

const formatError = (error: any): string => {
  if (error.code === 8000 && error.codeName === 'AtlasError') {
    return 'Error de autenticación: Credenciales inválidas'
  }
  return error.message || 'Error desconocido'
}

const connectWithRetry = async (retryCount = 0): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI
    
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable not defined')
    }

    await mongoose.connect(mongoUri, {
      heartbeatFrequencyMS: 2000,
      maxPoolSize: dbConfig.maxPoolSize,
      minPoolSize: dbConfig.minPoolSize,
      maxIdleTimeMS: dbConfig.maxIdleTimeMS,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    })

    logger.info('✅ MongoDB connected successfully')
  } catch (error) {
    const formattedError = formatError(error)
    logger.error(`❌ Connection attempt ${retryCount + 1}/${dbConfig.maxRetries + 1} failed: ${formattedError}`)

    if (retryCount < dbConfig.maxRetries) {
      logger.info(`🔄 Retrying connection in ${dbConfig.retryInterval / 1000} seconds...`)
      await new Promise(resolve => setTimeout(resolve, dbConfig.retryInterval))
      return connectWithRetry(retryCount + 1)
    }

    logger.error('❌ Maximum number of attempts reached. Exiting process.')
    process.exit(1)
  }
}

mongoose.connection.on('disconnected', () => {
  logger.info('🔌 MongoDB disconnected')
})

mongoose.connection.on('error', (error) => {
  const formattedError = formatError(error)
  logger.error('🚨 MongoDB connection error:', formattedError)
})

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  logger.info('MongoDB connection closed due to application termination')
  process.exit(0)
})

export default connectWithRetry