import { Hono } from 'hono'
import {
  createDroneController,
  getAllDronesController,
  getDroneByIdController,
  updateDroneController,
  deleteDroneController
} from './drones.controllers'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = new Hono()

router.use(authMiddleware)

router.get('/', getAllDronesController)
router.get('/:id', getDroneByIdController)
router.post('/', createDroneController)
router.patch('/:id', updateDroneController)
router.delete('/:id', deleteDroneController)

export default router