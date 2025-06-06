import { Context } from 'hono'
import authSertivce from './auth.services'
import { getErrorMessage } from '@utils/error'

export async function registerUser(context: Context) {
  try {
    const data = await context.req.json()
    const result = await authSertivce.register(data)
    return context.json(result, 201)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export async function loginUser(context: Context) {
  try {
    const data = await context.req.json()
    const result = await authSertivce.login(data)
    return context.json(result)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 401)
  }
}

export default {
  registerUser,
  loginUser
}