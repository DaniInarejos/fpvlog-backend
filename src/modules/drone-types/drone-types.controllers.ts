import { Context } from 'hono'
import {
  getAllDroneTypesService,
  getDroneTypeByIdService,
  createDroneTypeService,
  updateDroneTypeService,
  deleteDroneTypeService,
  getDroneTypesByCategoryService
} from './drone-types.services'
import { getErrorMessage } from '../../utils/error'

export async function getAllDroneTypesController(context: Context): Promise<Response> {
  try {
    const droneTypes = await getAllDroneTypesService()
    return context.json(droneTypes)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 500)
  }
}

export async function getDroneTypeByIdController(context: Context): Promise<Response> {
  try {
    const id = context.req.param('id')
    const droneType = await getDroneTypeByIdService(id)
    if (!droneType) {
      return context.json({ error: 'Tipo de drone no encontrado' }, 404)
    }
    return context.json(droneType)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export async function createDroneTypeController(context: Context): Promise<Response> {
  try {
    const data = await context.req.json()
    const droneType = await createDroneTypeService(data)
    return context.json(droneType, 201)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export async function updateDroneTypeController(context: Context): Promise<Response> {
  try {
    const id = context.req.param('id')
    const data = await context.req.json()
    const droneType = await updateDroneTypeService(id, data)
    if (!droneType) {
      return context.json({ error: 'Tipo de drone no encontrado' }, 404)
    }
    return context.json(droneType)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export async function deleteDroneTypeController(context: Context): Promise<Response> {
  try {
    const id = context.req.param('id')
    const deleted = await deleteDroneTypeService(id)
    if (!deleted) {
      return context.json({ error: 'Tipo de drone no encontrado' }, 404)
    }
    return context.json({ message: 'Tipo de drone eliminado correctamente' })
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export async function getDroneTypesByCategoryController(context: Context): Promise<Response> {
  try {
    const category = context.req.param('category')
    const droneTypes = await getDroneTypesByCategoryService(category)
    return context.json(droneTypes)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 500)
  }
}