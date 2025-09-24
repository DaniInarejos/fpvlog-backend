import { Hono } from 'hono'
import { 
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  getProfileController,
  getDashboardController,
  getUserGroupsController,
  getEquipmentItemsByUserController,
  getEquipmentItemStatsController,
  toggleEquipmentItemFavoriteController
 } from './users.controllers'
import { getFlightsByUserController } from '../flights/flights.controllers'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { uploadProfileImageController } from './users.controllers'
import { getSpotsByUserController } from '../spots/spots.controller'

const router = new Hono()
router.get('/dashboard/:username', getDashboardController)

router.use(authMiddleware)

router.get('/profile', getProfileController)

router.get('/', getAllUsersController)
router.get('/:id', getUserByIdController)
router.patch('/:id', updateUserController)
router.delete('/:id', deleteUserController)
router.get('/:id/flights', getFlightsByUserController)
router.get('/:id/spots', getSpotsByUserController)
router.get('/:id/groups', getUserGroupsController)
router.get('/:id/equipment-items', getEquipmentItemsByUserController)
router.get('/:id/equipment-items/stats', getEquipmentItemStatsController)
router.patch('/:id/equipment-items/:equipmentItemId/favorite', toggleEquipmentItemFavoriteController)

router.post('/:id/image-profile', uploadProfileImageController)

export default router