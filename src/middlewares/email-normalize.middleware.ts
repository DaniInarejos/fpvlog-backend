import { logger } from '@utils/logger'
import { Context, Next } from 'hono'

export const emailNormalizeMiddleware = async (context: Context, next: Next) => {
    if (['POST', 'PUT', 'PATCH'].includes(context.req.method)) {
    const contentType = context.req.header('content-type')
    
    if (contentType?.includes('application/json')) {
      try {
        const body = await context.req.json()
        
        if (body?.email && typeof body.email === 'string') {
          body.email = body.email.trim().toLowerCase()
        }
        
        context.set('body', body)
      } catch (error) {
       logger.error(`Error in normalize email ${error}`)
      }
    }
  }
   next()
}