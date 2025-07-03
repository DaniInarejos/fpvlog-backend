import { Hono } from 'hono'
import { authMiddleware } from '../../middlewares/auth.middleware'
import {
  createComponentController,
  deleteComponentController,
  getAllComponentsController,
  getComponentByIdController,
  getComponentsByTypeController,
  getComponentsByUserController,
  searchComponentsController,
  updateComponentController
} from './components.controller'

const componentsRouter = new Hono()

componentsRouter.get('/', getAllComponentsController)
componentsRouter.get('/search', searchComponentsController)
componentsRouter.get('/type/:type', getComponentsByTypeController)
componentsRouter.get('/user/:userId', getComponentsByUserController)
componentsRouter.get('/:id', getComponentByIdController)

// Rutas protegidas
componentsRouter.use('/*', authMiddleware)
componentsRouter.post('/', createComponentController)
componentsRouter.put('/:id', updateComponentController)
componentsRouter.delete('/:id', deleteComponentController)

export default componentsRouter