import { Hono } from 'hono'
import { 
  getAllFlightsController,
  getFlightByIdController,
  updateFlightController,
  deleteFlightController,
  createFlightController
} from './flights.controllers'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = new Hono()

router.use(authMiddleware)

router.post('/', createFlightController)
router.get('/', getAllFlightsController)
router.get('/:id', getFlightByIdController)
router.patch('/:id', updateFlightController)
router.delete('/:id', deleteFlightController)
router.get('/', getAllFlightsController)

export default router