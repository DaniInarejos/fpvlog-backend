import { Context } from 'hono'
import {
  getAllDroneBrandsService,
  getDroneBrandByIdService,
  createDroneBrandService,
  updateDroneBrandService,
  deleteDroneBrandService,
  getDroneBrandsByCountryService
} from './drone-brands.services'
import { getErrorMessage } from '../../utils/error'

export async function getAllDroneBrandsController(context: Context): Promise<Response> {
  try {
    const brands = await getAllDroneBrandsService()
    return context.json(brands)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 500)
  }
}

export async function getDroneBrandByIdController(context: Context): Promise<Response> {
  try {
    const id = context.req.param('id')
    const brand = await getDroneBrandByIdService(id)
    if (!brand) {
      return context.json({ error: 'Marca de drone no encontrada' }, 404)
    }
    return context.json(brand)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export async function createDroneBrandController(context: Context): Promise<Response> {
  try {
    const data = await context.req.json()
    const brand = await createDroneBrandService(data)
    return context.json(brand, 201)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export async function updateDroneBrandController(context: Context): Promise<Response> {
  try {
    const id = context.req.param('id')
    const data = await context.req.json()
    const brand = await updateDroneBrandService(id, data)
    if (!brand) {
      return context.json({ error: 'Marca de drone no encontrada' }, 404)
    }
    return context.json(brand)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export async function deleteDroneBrandController(context: Context): Promise<Response> {
  try {
    const id = context.req.param('id')
    const deleted = await deleteDroneBrandService(id)
    if (!deleted) {
      return context.json({ error: 'Marca de drone no encontrada' }, 404)
    }
    return context.json({ message: 'Marca de drone eliminada correctamente' })
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export async function getDroneBrandsByCountryController(context: Context): Promise<Response> {
  try {
    const country = context.req.param('country')
    const brands = await getDroneBrandsByCountryService(country)
    return context.json(brands)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 500)
  }
}