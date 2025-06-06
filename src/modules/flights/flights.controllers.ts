import { Context } from 'hono'
import { 
  getAllFlightsService, 
  getFlightByIdService, 
  updateFlightService, 
  deleteFlightService,
  createFlightService,
  getFlightsByUserService
} from './flights.services'
import { getErrorMessage } from '../../utils/error'

export async function createFlightController(context: Context): Promise<Response> {
  try {
    const data = await context.req.json()
    const user = context.get('user')
    const flight = await createFlightService({ ...data, userId: user._id })
    return context.json(flight, 201)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export async function getAllFlightsController(context: Context): Promise<Response> {
  try {
    const flights = await getAllFlightsService()
    return context.json(flights)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 500)
  }
}

export async function getFlightsByUserController(context: Context): Promise<Response> {
  try {
    const user = context.get('user')
    const flights = await getFlightsByUserService(user._id)
    return context.json(flights)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 500)
  }
}

export async function getFlightByIdController(context: Context): Promise<Response> {
  try {
    const id = context.req.param('id')
    const user = context.get('user')
    const flight = await getFlightByIdService(id)
    
    if (!flight) {
      return context.json({ error: 'Vuelo no encontrado' }, 404)
    }

    if (flight.userId.toString() !== user._id.toString()) {
      return context.json({ error: 'No autorizado para ver este vuelo' }, 403)
    }

    return context.json(flight)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export async function updateFlightController(context: Context): Promise<Response> {
  try {
    const id = context.req.param('id')
    const user = context.get('user')
    const data = await context.req.json()
    
    const existingFlight = await getFlightByIdService(id)
    if (!existingFlight) {
      return context.json({ error: 'Vuelo no encontrado' }, 404)
    }

    if (existingFlight.userId.toString() !== user._id.toString()) {
      return context.json({ error: 'No autorizado para actualizar este vuelo' }, 403)
    }

    const flight = await updateFlightService(id, data)
    return context.json(flight)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export async function deleteFlightController(context: Context): Promise<Response> {
  try {
    const id = context.req.param('id')
    const user = context.get('user')

    const existingFlight = await getFlightByIdService(id)
    if (!existingFlight) {
      return context.json({ error: 'Vuelo no encontrado' }, 404)
    }

    if (existingFlight.userId.toString() !== user._id.toString()) {
      return context.json({ error: 'No autorizado para eliminar este vuelo' }, 403)
    }

    await deleteFlightService(id)
    return context.json({ message: 'Vuelo eliminado exitosamente' })
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}