import { Hono } from 'hono'
import { getGlobalFeedController, getFollowingFeedController } from './feeds.controllers'
import { authMiddleware } from '../../middlewares/auth.middleware'

const feedsRouter = new Hono()

feedsRouter.get('/global', authMiddleware, getGlobalFeedController)
feedsRouter.get('/following', authMiddleware, getFollowingFeedController)

export default feedsRouter