import { serve } from '@hono/node-server'
import { app } from './app'
import { logger } from './utils/logger'
import { config } from 'dotenv'
import connectDB from './configs/database'



config()
await connectDB()
serve({
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3000
  }, (info) => {
    logger.info(`API running on http://localhost:${info.port}`)
  })