import { Hono } from 'hono'
import {
  getAllDroneTypesController,
  getDroneTypeByIdController,
  createDroneTypeController,
  updateDroneTypeController,
  deleteDroneTypeController,
  getDroneTypesByCategoryController
} from './drone-types.controllers'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = new Hono()

router.use(authMiddleware)

router.get('/', getAllDroneTypesController)
router.get('/category/:category', getDroneTypesByCategoryController)
router.get('/:id', getDroneTypeByIdController)
router.post('/', createDroneTypeController)
router.patch('/:id', updateDroneTypeController)
router.delete('/:id', deleteDroneTypeController)

export default router