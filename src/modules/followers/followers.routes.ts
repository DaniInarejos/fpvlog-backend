import { Hono } from 'hono'
import { 
  followUserController,
  unfollowUserController,
  getFollowersController,
  getFollowingController,
  checkIsFollowingController
} from './followers.controllers'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = new Hono()

router.post('/:userId/follow', authMiddleware, followUserController)
router.delete('/:userId/follow', authMiddleware, unfollowUserController)
router.get('/:userId/followers', getFollowersController)
router.get('/:userId/following', getFollowingController)
router.get('/:userId/is-following', authMiddleware, checkIsFollowingController)

export default router