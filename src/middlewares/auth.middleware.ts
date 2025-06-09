import { Context, Next } from 'hono'
import authService from '../modules/auth/auth.services'

export async function authMiddleware(context: Context, next: Next) {

  try {
    const authHeader = context.req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return context.json({ error: 'No autorizado' }, 401)
    }

    const token = authHeader.split(' ')[1]
    const user = await authService.validateToken(token)
    
    // Añadir el usuario al contexto
    context.set('user', user)
    await next()
  } catch (error) {
    return context.json({ error: 'No autorizado' }, 401)
  }
}