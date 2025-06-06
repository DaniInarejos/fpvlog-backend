import mongoose from 'mongoose'

interface DatabaseConfig {
  maxRetries: number
  retryInterval: number
  timeout: number
}

const dbConfig: DatabaseConfig = {
  maxRetries: 2,
  retryInterval: 5000,
  timeout: 10000,
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
      throw new Error('Variable de entorno MONGO_URI no definida')
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: dbConfig.timeout,
      heartbeatFrequencyMS: 2000,
    })

    console.log('✅ MongoDB conectado exitosamente')
  } catch (error) {
    const formattedError = formatError(error)
    console.error(`❌ Intento de conexión ${retryCount + 1}/${dbConfig.maxRetries + 1} falló: ${formattedError}`)

    if (retryCount < dbConfig.maxRetries) {
      console.log(`🔄 Reintentando conexión en ${dbConfig.retryInterval / 1000} segundos...`)
      await new Promise(resolve => setTimeout(resolve, dbConfig.retryInterval))
      return connectWithRetry(retryCount + 1)
    }

    console.error('❌ Número máximo de intentos alcanzado. Saliendo del proceso.')
    process.exit(1)
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('🔌 MongoDB desconectado')
})

mongoose.connection.on('error', (error) => {
  const formattedError = formatError(error)
  console.error('🚨 Error de conexión MongoDB:', formattedError)
})

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('Conexión a MongoDB cerrada por terminación de la aplicación')
  process.exit(0)
})

export default connectWithRetry