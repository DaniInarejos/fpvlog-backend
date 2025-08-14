import { Context, Next } from 'hono'
import { logger } from 'hono/logger'

// Middleware personalizado que filtra las peticiones OPTIONS del log
export const filterOptionsLogger = () => {
  return async (context: Context, next: Next) => {
    // Si es una petición OPTIONS, continúa sin loggear
    if (context.req.method === 'OPTIONS') {
      await next()
      return
    }
    
    // Para cualquier otro método, usa el logger normal de Hono
    return logger()(context, next)
  }
}