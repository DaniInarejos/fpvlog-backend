import { Context } from 'hono'
import {
  createDroneService,
  getAllDronesService,
  getDronesByUserService,
  getDroneByIdService,
  updateDroneService,
  deleteDroneService,
  uploadDroneImageService
} from './drones.services'
import { getErrorMessage } from '../../utils/error'

export async function createDroneController(context: Context): Promise<Response> {
  try {
    const droneTuCreate = await context.req.json()
    const user = context.get('user')
    const droneCreated = await createDroneService({ ...droneTuCreate, userId: user._id })
    return context.json(droneCreated, 201)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export async function getAllDronesController(context: Context): Promise<Response> {
  try {
    const drones = await getAllDronesService()
    return context.json(drones)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 500)
  }
}

export async function getDronesByUserController(context: Context): Promise<Response> {
  try {
    const userId = context.req.param('id')
    const currentUser = context.get('user')
    
    // Verificar que el usuario autenticado solo pueda acceder a sus propios drones
    if (currentUser._id.toString() !== userId) {
      return context.json({ error: 'Not authorized to access this user\'s drones' }, 403)
    }
    
    const drones = await getDronesByUserService(currentUser._id)
    return context.json(drones)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 500)
  }
}

export async function getDroneByIdController(context: Context): Promise<Response> {
  try {
    const id = context.req.param('id')
    const drone = await getDroneByIdService(id)
    if (!drone) {
      return context.json({ error: 'Drone no encontrado' }, 404)
    }
    return context.json(drone)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export async function updateDroneController(context: Context): Promise<Response> {
  try {
    const id = context.req.param('id')
    const user = context.get('user')
    const existingDrone = await getDroneByIdService(id)

    if (!existingDrone) {
      return context.json({ error: 'Drone no encontrado' }, 404)
    }

    if (existingDrone.userId.toString() !== user._id.toString()) {
      return context.json({ error: 'No autorizado para actualizar este drone' }, 403)
    }

    const data = await context.req.json()
    const drone = await updateDroneService(id, data)
    return context.json(drone)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export async function deleteDroneController(context: Context): Promise<Response> {
  try {
    const id = context.req.param('id')
    const user = context.get('user')
    const existingDrone = await getDroneByIdService(id)

    if (!existingDrone) {
      return context.json({ error: 'Drone no encontrado' }, 404)
    }

    if (existingDrone.userId.toString() !== user._id.toString()) {
      return context.json({ error: 'No autorizado para eliminar este drone' }, 403)
    }

    await deleteDroneService(id)
    return context.json({ message: 'Drone eliminado exitosamente' })
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export async function uploadDroneImageController(context: Context): Promise<Response> {
  try {
    const id = context.req.param('id')
    const user = context.get('user')
    const existingDrone = await getDroneByIdService(id)

    if (!existingDrone) {
      return context.json({ error: 'Drone no encontrado' }, 404)
    }

    if (existingDrone.userId.toString() !== user._id.toString()) {
      return context.json({ error: 'No autorizado para actualizar este drone' }, 403)
    }

    const body = await context.req.parseBody()
    const file = body.image

    if (!file || !(file instanceof File)) {
      return context.json({ error: 'No se proporcionó ninguna imagen válida' }, 400)
    }
    const drone = await uploadDroneImageService(id, file)
    return context.json(drone)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}