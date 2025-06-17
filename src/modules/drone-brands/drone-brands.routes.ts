import { Hono } from 'hono'
import {
  getAllDroneBrandsController,
  getDroneBrandByIdController,
  createDroneBrandController,
  updateDroneBrandController,
  deleteDroneBrandController,
  getDroneBrandsByCountryController
} from './drone-brands.controllers'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = new Hono()

router.use(authMiddleware)

router.get('/', getAllDroneBrandsController)
router.get('/country/:country', getDroneBrandsByCountryController)
router.get('/:id', getDroneBrandByIdController)
router.post('/', createDroneBrandController)
router.patch('/:id', updateDroneBrandController)
router.delete('/:id', deleteDroneBrandController)

export default router