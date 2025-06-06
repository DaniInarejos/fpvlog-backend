import { serve } from '@hono/node-server'
import { app } from './app'
import { config } from 'dotenv'
import connectDB from './configs/database'

config()
await connectDB()

serve({ fetch: app.fetch, port: parseInt(process.env.PORT || '3000') })
console.log(`API running on http://localhost:${process.env.PORT || 3000}`)