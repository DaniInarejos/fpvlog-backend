import { Context } from 'hono'
import { TargetType } from './likes.models'
import {
  toggleLikeService,
  getLikesByTargetService,
  checkUserLikeService,
  getLikesByUserService
} from './likes.services'

export async function toggleLikeController(c: Context) {
  try {
    const { targetId, targetType } = c.req.param()
    const userId = c.get('user')?._id

    const result = await toggleLikeService(userId, targetId, targetType as TargetType)
    return c.json(result)
  } catch (error) {
    return c.json({ error: 'Error al alternar like' }, 500)
  }
}

export async function getLikesByTargetController(c: Context) {
  try {
    const { targetId, targetType } = c.req.param()
    const count = await getLikesByTargetService(targetId, targetType as TargetType)
    return c.json({ count })
  } catch (error) {
    return c.json({ error: 'Error al obtener likes' }, 500)
  }
}

export async function checkUserLikeController(c: Context) {
  try {
    const { targetId, targetType } = c.req.param()
    const userId = c.get('user')?._id

    const hasLike = await checkUserLikeService(userId, targetId, targetType as TargetType)
    return c.json({ hasLike })
  } catch (error) {
    return c.json({ error: 'Error al verificar like' }, 500)
  }
}

export async function getLikesByUserController(c: Context) {
  try {
    const { page, limit } = c.req.query()
    const userId = c.req.param('userId') || c.get('user')?._id

    const result = await getLikesByUserService(
      userId,
      Number(page) || 1,
      Number(limit) || 20
    )
    return c.json(result)
  } catch (error) {
    return c.json({ error: 'Error al obtener likes del usuario' }, 500)
  }
}