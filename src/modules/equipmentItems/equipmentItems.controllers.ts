import { Context } from 'hono'
import {
  getAllEquipmentItemsService,
  getEquipmentItemByIdService,
  getEquipmentItemsByUserService,
  getEquipmentItemsByUserAndTypeService,
  getEquipmentItemsByUserAndStatusService,
  createEquipmentItemService,
  updateEquipmentItemService,
  deleteEquipmentItemService,
  uploadEquipmentItemImageService,
  getEquipmentItemStatsService
} from './equipmentItems.services'
import { EquipmentType, EquipmentStatus } from './equipmentItems.models'

export const getAllEquipmentItemsController = async (c: Context) => {
  try {
    const equipmentItems = await getAllEquipmentItemsService()
    
    return c.json({
      success: true,
      data: equipmentItems,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    
    return c.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, 500)
  }
}

export const getEquipmentItemByIdController = async (c: Context) => {
  try {
    const { id } = c.req.param()
    
    const equipmentItem = await getEquipmentItemByIdService(id)
    
    return c.json({
      success: true,
      data: equipmentItem,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    const statusCode = errorMessage.includes('no encontrado') ? 404 : 
                      errorMessage.includes('inválido') ? 400 : 500
    
    return c.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, statusCode as any)
  }
}

export const getEquipmentItemsByUserController = async (c: Context) => {
  try {
    const { userId } = c.req.param()
    const { type, status } = c.req.query()
    
    let equipmentItems
    
    if (type && Object.values(EquipmentType).includes(type as EquipmentType)) {
      equipmentItems = await getEquipmentItemsByUserAndTypeService(userId, type as EquipmentType)
    } else if (status && Object.values(EquipmentStatus).includes(status as EquipmentStatus)) {
      equipmentItems = await getEquipmentItemsByUserAndStatusService(userId, status as EquipmentStatus)
    } else {
      equipmentItems = await getEquipmentItemsByUserService(userId)
    }
    
    return c.json({
      success: true,
      data: equipmentItems,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    const statusCode = errorMessage.includes('inválido') ? 400 : 500
    
    return c.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, statusCode as any)
  }
}

export const createEquipmentItemController = async (c: Context) => {
  try {
    const body = await c.req.json()
    
    const equipmentItem = await createEquipmentItemService(body)
    
    return c.json({
      success: true,
      data: equipmentItem,
      message: 'Elemento de equipamiento creado exitosamente',
      timestamp: new Date().toISOString()
    }, 201)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    const statusCode = errorMessage.includes('inválidos') || errorMessage.includes('inválido') ? 400 : 500
    
    return c.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, statusCode as any)
  }
}

export const updateEquipmentItemController = async (c: Context) => {
  try {
    const { id } = c.req.param()
    const body = await c.req.json()
    
    const equipmentItem = await updateEquipmentItemService(id, body)
    
    return c.json({
      success: true,
      data: equipmentItem,
      message: 'Elemento de equipamiento actualizado exitosamente',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    const statusCode = errorMessage.includes('no encontrado') ? 404 :
                      errorMessage.includes('inválidos') || errorMessage.includes('inválido') ? 400 : 500
    
    return c.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, statusCode as any)
  }
}

export const deleteEquipmentItemController = async (c: Context) => {
  try {
    const { id } = c.req.param()
    
    await deleteEquipmentItemService(id)
    
    return c.json({
      success: true,
      message: 'Elemento de equipamiento eliminado exitosamente',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    const statusCode = errorMessage.includes('no encontrado') ? 404 :
                      errorMessage.includes('inválido') ? 400 : 500
    
    return c.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, statusCode as any)
  }
}

export const uploadEquipmentItemImageController = async (c: Context) => {
  try {
    const { id } = c.req.param()
    const body = await c.req.parseBody()
    const imageFile = body.image as File
    
    if (!imageFile) {
      return c.json({
        success: false,
        error: 'No se proporcionó ninguna imagen',
        timestamp: new Date().toISOString()
      }, 400)
    }
    
    const equipmentItem = await uploadEquipmentItemImageService(id, imageFile)
    
    return c.json({
      success: true,
      data: equipmentItem,
      message: 'Imagen del elemento de equipamiento subida exitosamente',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    const statusCode = errorMessage.includes('no encontrado') ? 404 :
                      errorMessage.includes('inválido') ? 400 : 500
    
    return c.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, statusCode as any)
  }
}

export const getEquipmentItemStatsController = async (c: Context) => {
  try {
    const { userId } = c.req.param()
    
    const stats = await getEquipmentItemStatsService(userId)
    
    return c.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    const statusCode = errorMessage.includes('inválido') ? 400 : 500
    
    return c.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, statusCode as any)
  }
}