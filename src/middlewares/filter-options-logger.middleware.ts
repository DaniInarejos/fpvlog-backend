import { Context, Next } from 'hono'
import { logger } from 'hono/logger'

export const filterOptionsLogger = () => {
  return async (context: Context, next: Next) => {
    if (context.req.method === 'OPTIONS' || context.req.path === '/health') {
      await next()
      return
    }
    
    return logger()(context, next)
  }
}