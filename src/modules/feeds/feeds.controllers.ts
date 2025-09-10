import { Context } from 'hono'
import { getGlobalFeedService, getFollowingFeedService } from './feeds.services'

export const getGlobalFeedController = async (c: Context) => {
  try {
    const page = Math.max(1, parseInt(c.req.query('page') || '1'))
    const limit = parseInt(c.req.query('limit') || '20')
    const lastTimestamp = c.req.query('lastTimestamp')

    const feed = await getGlobalFeedService(page, limit, lastTimestamp)
    return c.json(feed)
  } catch (error) {
    console.error('Error in getGlobalFeedController:', error)
    return c.json({ error: 'Error al obtener el feed global' }, 500)
  }
}

export const getFollowingFeedController = async (c: Context) => {
  try {
    const {_id:userId} = c.get('user')
    const page = Math.max(1, parseInt(c.req.query('page') || '1'))
    const limit = parseInt(c.req.query('limit') || '20')
    const lastTimestamp = c.req.query('lastTimestamp')

    const feed = await getFollowingFeedService(userId, page, limit, lastTimestamp)
    return c.json(feed)
  } catch (error) {
    console.error('Error in getFollowingFeedController:', error)
    return c.json({ error: 'Error al obtener el feed de seguidos' }, 500)
  }
}