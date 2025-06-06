import { Context } from "hono"
import mongoose from "mongoose"


export const healthController = (context:Context) => {
    const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    return context.json({
      status: 'ok',
      uptime: process.uptime(),
      mongo: mongoStatus
    })
  }