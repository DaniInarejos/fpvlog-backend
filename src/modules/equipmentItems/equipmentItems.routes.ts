import { Hono } from 'hono'
import {
  getAllEquipmentItemsController,
  getEquipmentItemByIdController,
  createEquipmentItemController,
  updateEquipmentItemController,
  deleteEquipmentItemController,
  uploadEquipmentItemImageController
} from './equipmentItems.controllers'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = new Hono()

// Rutas públicas (si las necesitas)
// router.get('/', getAllEquipmentItemsController)
// router.get('/:id', getEquipmentItemByIdController)

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware)

// Rutas protegidas
router.get('/', getAllEquipmentItemsController)
router.get('/:id', getEquipmentItemByIdController)
router.post('/', createEquipmentItemController)
router.patch('/:id', updateEquipmentItemController)
router.delete('/:id', deleteEquipmentItemController)

// Ruta para subir imágenes
router.post('/:id/image', uploadEquipmentItemImageController)

export default router