import { Hono } from 'hono'
import { authMiddleware } from '../../middlewares/auth.middleware'
import {
  toggleLikeController,
  getLikesByTargetController,
  checkUserLikeController,
  getLikesByUserController
} from './likes.controllers'

const likesRouter = new Hono()

likesRouter.use(authMiddleware)

likesRouter.post('/:targetType/:targetId', toggleLikeController)
likesRouter.get('/:targetType/:targetId/count', getLikesByTargetController)
likesRouter.get('/:targetType/:targetId/check', checkUserLikeController)
likesRouter.get('/user/:userId?', getLikesByUserController)

export default likesRouter