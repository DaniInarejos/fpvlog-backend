import { Context } from 'hono'
import { z } from 'zod'  // Añadir esta importación
import {
  getAllSpotsService,
  getSpotByIdService,
  getSpotsByUserService,
  createSpotService,
  updateSpotService,
  deleteSpotService
} from './spots.service'

export const getAllSpotsController = async (context: Context) => {
  try {
    const spots = await getAllSpotsService()
    return context.json(spots)
  } catch (error) {
    return context.json({ error: 'Error al obtener los spots' }, 500)
  }
}

export const getSpotByIdController = async (context: Context) => {
  try {
    const spot = await getSpotByIdService(context.req.param('id'))
    return context.json(spot)
  } catch (error) {
    return context.json({ error: 'Error al obtener el spot' }, 500)
  }
}

export const getSpotsByUserController = async (context: Context) => {
  try {
    const spots = await getSpotsByUserService(context.req.param('id'))
    return context.json(spots)
  } catch (error) {
    return context.json({ error: 'Error al obtener los spots del usuario' }, 500)
  }
}

export const createSpotController = async (context: Context) => {
  try {
    const data = await context.req.json()

    const spot = await createSpotService(data)
    return context.json(spot, 201)
  } catch (error) {
    console.error('Error creating spot:', error)
    if (error instanceof z.ZodError) {
      return context.json({ 
        error: 'Error de validación', 
        details: error.errors 
      }, 400)
    }
    return context.json({ 
      error: 'Error al crear el spot',
      message: error
    }, 500)
  }
}

export const updateSpotController = async (context: Context) => {
  try {
  console.log("HOLA1L")
    const data = await context.req.json()
  console.log("HOLA2L")
    const spot = await updateSpotService(context.req.param('id'), data)
    return context.json(spot)
  } catch (error) {
    return context.json({ error: 'Error al actualizar el spot' }, 500)
  }
}

export const deleteSpotController = async (context: Context) => {
  try {
    await deleteSpotService(context.req.param('id'))
    return context.json({ message: 'Spot eliminado correctamente' })
  } catch (error) {
    return context.json({ error: 'Error al eliminar el spot' }, 500)
  }
}