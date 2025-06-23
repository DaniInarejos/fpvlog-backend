import { Hono } from 'hono'
import { 
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  getProfileController
 } from './users.controllers'
import { getDronesByUserController } from '../drones/drones.controllers'
import { getFlightsByUserController } from '../flights/flights.controllers'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = new Hono()

router.use(authMiddleware)

router.get('/profile', getProfileController)

router.get('/', getAllUsersController)
router.get('/:id', getUserByIdController)
router.patch('/:id', updateUserController)
router.delete('/:id', deleteUserController)
router.get('/:id/drones', getDronesByUserController)
router.get('/:id/flights', getFlightsByUserController)

export default router