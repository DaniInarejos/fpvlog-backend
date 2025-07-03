import { Hono } from 'hono'
import {
  getAllSpotsController,
  getSpotByIdController,
  createSpotController,
  updateSpotController,
  deleteSpotController
} from './spots.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = new Hono()

router.use('*', authMiddleware)

router.get('/', getAllSpotsController)
router.get('/:id', getSpotByIdController)
router.post('/', createSpotController)
router.put('/:id', updateSpotController)
router.delete('/:id', deleteSpotController)

export default router