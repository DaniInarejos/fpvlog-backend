import { Context } from 'hono'
import { 
  followUserService,
  unfollowUserService,
  getFollowersService,
  getFollowingService,
  checkIsFollowingService
} from './followers.services'
import { getErrorMessage } from '../../utils/error'

export const followUserController = async (context: Context): Promise<Response> => {
  try {
    const followerId = context.get('user')?._id?.toString()
    const followingId = context.req.param('userId')

    if (!followerId) {
      return context.json({ error: 'Usuario no autenticado' }, 401)
    }

    const result = await followUserService(followerId, followingId)
    return context.json(result)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export const unfollowUserController = async (context: Context): Promise<Response> => {
  try {
    const followerId = context.get('user')?._id?.toString()
    const followingId = context.req.param('userId')

    if (!followerId) {
      return context.json({ error: 'Usuario no autenticado' }, 401)
    }

    const result = await unfollowUserService(followerId, followingId)
    return context.json(result)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export const getFollowersController = async (context: Context): Promise<Response> => {
  try {
    const userId = context.req.param('userId')
    const page = parseInt(context.req.query('page') || '1')
    const limit = parseInt(context.req.query('limit') || '20')

    const result = await getFollowersService(userId, page, limit)
    return context.json(result)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 500)
  }
}

export const getFollowingController = async (context: Context): Promise<Response> => {
  try {
    const userId = context.req.param('userId')
    const page = parseInt(context.req.query('page') || '1')
    const limit = parseInt(context.req.query('limit') || '20')

    const result = await getFollowingService(userId, page, limit)
    return context.json(result)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 500)
  }
}

export const checkIsFollowingController = async (context: Context): Promise<Response> => {
  try {
    const followerId = context.get('user')?._id?.toString()
    const followingId = context.req.param('userId')

    if (!followerId) {
      return context.json({ error: 'Usuario no autenticado' }, 401)
    }

    const isFollowing = await checkIsFollowingService(followerId, followingId)
    return context.json({ isFollowing })
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 500)
  }
}