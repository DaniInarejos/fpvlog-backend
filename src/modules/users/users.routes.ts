import { Hono } from 'hono'
import { 
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  getProfileController,
  getDashboardController
 } from './users.controllers'
import { getDronesByUserController } from '../drones/drones.controllers'
import { getFlightsByUserController } from '../flights/flights.controllers'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { uploadProfileImageController } from './users.controllers'

const router = new Hono()
router.get('/dashboard/:username', getDashboardController)

router.use(authMiddleware)

router.get('/profile', getProfileController)

router.get('/', getAllUsersController)
router.get('/:id', getUserByIdController)
router.patch('/:id', updateUserController)
router.delete('/:id', deleteUserController)
router.get('/:id/drones', getDronesByUserController)
router.get('/:id/flights', getFlightsByUserController)

router.post('/:id/image-profile', uploadProfileImageController)

export default router