import { Context } from 'hono'
import authService from './auth.services'
import { getErrorMessage } from '../../utils/error'

export async function registerUser(context: Context) {
  try {
    const data = await context.req.json()
    const result = await authService.register(data)
    return context.json(result, 201)
  } catch (error) {
    console.log(error)
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export async function loginUser(context: Context) {
  try {
    const data = await context.req.json()
    const result = await authService.login(data)
    return context.json(result)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 401)
  }
}

export async function requestPasswordReset(context: Context) {
  try {
    const data = await context.req.json()
    await authService.requestPasswordReset(data)
    return context.json({ message: 'Si el email existe, recibirás un enlace de recuperación' }, 200)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export async function resetPassword(context: Context) {
  try {
    const data = await context.req.json()
    await authService.resetPassword(data)
    return context.json({ message: 'Contraseña actualizada correctamente' }, 200)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export default {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword
}