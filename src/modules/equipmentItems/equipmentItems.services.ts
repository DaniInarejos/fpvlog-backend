import { Types } from 'mongoose'
import { z } from 'zod'
import { IEquipmentItem, EquipmentType, EquipmentStatus } from './equipmentItems.models'
import {
  findAllEquipmentItemsRepository,
  findEquipmentItemByIdRepository,
  findEquipmentItemsByUserRepository,
  findEquipmentItemsByUserAndTypeRepository,
  findEquipmentItemsByUserAndStatusRepository,
  createEquipmentItemRepository,
  updateEquipmentItemRepository,
  deleteEquipmentItemRepository,
  countEquipmentItemsByUserRepository,
  countEquipmentItemsByUserAndStatusRepository
} from './equipmentItems.repository'
import { logger } from '../../utils/logger'
import { uploadImageService } from '../../utils/image.service'

// Función utilitaria para validar URLs
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Schemas de validación Zod
const createEquipmentItemSchema = z.object({
  userId: z.string().min(1, 'El ID del usuario es requerido'),
  name: z.string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  brand: z.string()
    .max(50, 'La marca no puede exceder 50 caracteres')
    .trim()
    .optional()
    .nullable(),
  type: z.nativeEnum(EquipmentType, { 
    errorMap: () => ({ message: 'Tipo de equipamiento inválido' }) 
  }),
  status: z.nativeEnum(EquipmentStatus, { 
    errorMap: () => ({ message: 'Estado de equipamiento inválido' }) 
  }).default(EquipmentStatus.ACTIVE),
  image: z.string().refine(val => !val || val === '' || z.string().url().safeParse(val).success, {
    message: 'URL de imagen inválida'
  }).optional(),
  notes: z.string().max(1000, 'Las notas no pueden exceder 1000 caracteres').optional(),
  favorite: z.boolean().default(false),
  productLink: z.string().refine(val => !val || val === '' || z.string().url().safeParse(val).success, {
    message: 'productLink debe ser una URL válida'
  }).optional()
})

const updateEquipmentItemSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim()
    .optional(),
  brand: z.string()
    .max(50, 'La marca no puede exceder 50 caracteres')
    .trim()
    .optional()
    .nullable(),
  type: z.nativeEnum(EquipmentType, {
    errorMap: () => ({ message: 'Tipo de equipamiento inválido' })
  }).optional(),
  status: z.nativeEnum(EquipmentStatus, {
    errorMap: () => ({ message: 'Estado de equipamiento inválido' })
  }).optional(),
  image: z.string()
    .optional()
    .nullable()
    .refine((v) => !v || v === '' || isValidUrl(v), {
      message: 'La imagen debe ser una URL válida'
    }),
  notes: z.string().optional().nullable(),
  favorite: z.boolean().optional(),
  productLink: z.string()
    .optional()
    .nullable()
    .refine((v) => !v || v === '' || isValidUrl(v), {
      message: 'El enlace del producto debe ser una URL válida'
    })
})

const equipmentItemQuerySchema = z.object({
  userId: z.string().optional(),
  type: z.nativeEnum(EquipmentType).optional(),
  status: z.nativeEnum(EquipmentStatus).optional(),
  page: z.string().transform(val => parseInt(val) || 1).optional(),
  limit: z.string().transform(val => Math.min(parseInt(val) || 10, 100)).optional()
})

export const getAllEquipmentItemsService = async () => {
  try {
    const equipmentItems = await findAllEquipmentItemsRepository()
    
    logger.info('Equipment items retrieved successfully', {
      count: equipmentItems.length
    })
    
    return equipmentItems
  } catch (error) {
    logger.error('Error retrieving equipment items', { error })
    throw new Error('Error al obtener los elementos de equipamiento')
  }
}

export const getEquipmentItemByIdService = async (id: string) => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID de elemento de equipamiento inválido')
    }
    
    const equipmentItem = await findEquipmentItemByIdRepository(id)
    
    if (!equipmentItem) {
      throw new Error('Elemento de equipamiento no encontrado')
    }
    
    logger.info('Equipment item retrieved successfully', {
      equipmentItemId: id
    })
    
    return equipmentItem
  } catch (error) {
    logger.error('Error retrieving equipment item by ID', { id, error })
    throw error
  }
}

export const getEquipmentItemsByUserService = async (userId: string) => {
  try {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('ID de usuario inválido')
    }
    
    const equipmentItems = await findEquipmentItemsByUserRepository(userId)
    
    logger.info('Equipment items by user retrieved successfully', {
      userId,
      count: equipmentItems.length
    })
    
    return equipmentItems
  } catch (error) {
    logger.error('Error retrieving equipment items by user', { userId, error })
    throw new Error('Error al obtener los elementos de equipamiento del usuario')
  }
}

export const getEquipmentItemsByUserAndTypeService = async (userId: string, type: EquipmentType) => {
  try {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('ID de usuario inválido')
    }
    
    const equipmentItems = await findEquipmentItemsByUserAndTypeRepository(userId, type)
    
    logger.info('Equipment items by user and type retrieved successfully', {
      userId,
      type,
      count: equipmentItems.length
    })
    
    return equipmentItems
  } catch (error) {
    logger.error('Error retrieving equipment items by user and type', { userId, type, error })
    throw new Error('Error al obtener los elementos de equipamiento por tipo')
  }
}

export const getEquipmentItemsByUserAndStatusService = async (userId: string, status: EquipmentStatus) => {
  try {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('ID de usuario inválido')
    }
    
    const equipmentItems = await findEquipmentItemsByUserAndStatusRepository(userId, status)
    
    logger.info('Equipment items by user and status retrieved successfully', {
      userId,
      status,
      count: equipmentItems.length
    })
    
    return equipmentItems
  } catch (error) {
    logger.error('Error retrieving equipment items by user and status', { userId, status, error })
    throw new Error('Error al obtener los elementos de equipamiento por estado')
  }
}

export const createEquipmentItemService = async (data: unknown) => {
  try {
    const validatedData = createEquipmentItemSchema.parse(data)
    
    // Convertir userId a ObjectId
    const equipmentItemData = {
      ...validatedData,
      userId: new Types.ObjectId(validatedData.userId)
    }
    
    const equipmentItem = await createEquipmentItemRepository(equipmentItemData as any)
    
    logger.info('Equipment item created successfully', {
      equipmentItemId: equipmentItem._id,
      userId: validatedData.userId,
      type: validatedData.type
    })
    
    return equipmentItem
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Equipment item creation validation failed', { errors: error.errors })
      throw new Error(`Datos inválidos: ${error.errors.map(e => e.message).join(', ')}`)
    }
    
    logger.error('Error creating equipment item', { error })
    throw new Error('Error al crear el elemento de equipamiento')
  }
}

export const updateEquipmentItemService = async (id: string, data: unknown) => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID de elemento de equipamiento inválido')
    }
    
    const validatedData = updateEquipmentItemSchema.parse(data)
    
    const equipmentItem = await updateEquipmentItemRepository(id, validatedData as any)
    
    if (!equipmentItem) {
      throw new Error('Elemento de equipamiento no encontrado')
    }
    
    logger.info('Equipment item updated successfully', {
      equipmentItemId: id,
      updatedFields: Object.keys(validatedData)
    })
    
    return equipmentItem
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Equipment item update validation failed', { errors: error.errors })
      throw new Error(`Datos inválidos: ${error.errors.map(e => e.message).join(', ')}`)
    }
    
    logger.error('Error updating equipment item', { id, error })
    throw error
  }
}

export const deleteEquipmentItemService = async (id: string) => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID de elemento de equipamiento inválido')
    }
    
    const equipmentItem = await deleteEquipmentItemRepository(id)
    
    if (!equipmentItem) {
      throw new Error('Elemento de equipamiento no encontrado')
    }
    
    logger.info('Equipment item deleted successfully', {
      equipmentItemId: id
    })
    
    return equipmentItem
  } catch (error) {
    logger.error('Error deleting equipment item', { id, error })
    throw error
  }
}

export const uploadEquipmentItemImageService = async (id: string, imageFile: File) => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID de elemento de equipamiento inválido')
    }

    // Verificar que el elemento existe
    const equipmentItem = await findEquipmentItemByIdRepository(id)
    if (!equipmentItem) {
      throw new Error('Elemento de equipamiento no encontrado')
    }

    // Subir imagen
    const imageUrl = await uploadImageService(imageFile, 'equipment-items')
    
    // Actualizar el elemento con la nueva imagen
    const updatedEquipmentItem = await updateEquipmentItemRepository(id, { image: imageUrl })

    logger.info('Equipment item image uploaded successfully', {
      equipmentItemId: id,
      imageUrl
    })

    return updatedEquipmentItem
  } catch (error) {
    logger.error('Error uploading equipment item image', { id, error })
    throw error
  }
}

export const toggleEquipmentItemFavoriteService = async (id: string, userId: string) => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID de elemento de equipamiento inválido')
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('ID de usuario inválido')
    }

    const equipmentItem = await findEquipmentItemByIdRepository(id)
    
    if (!equipmentItem) {
      throw new Error('Elemento de equipamiento no encontrado')
    }

    // Verificar que el usuario es el propietario del elemento
    if (equipmentItem.userId.toString() !== userId) {
      throw new Error('No tienes permisos para modificar este elemento')
    }

    // Toggle del estado favorite
    const newFavoriteStatus = !equipmentItem.favorite
    const updatedEquipmentItem = await updateEquipmentItemRepository(id, { favorite: newFavoriteStatus })

    logger.info('Equipment item favorite status toggled successfully', {
      equipmentItemId: id,
      userId,
      newFavoriteStatus
    })

    return updatedEquipmentItem
  } catch (error) {
    logger.error('Error toggling equipment item favorite status', { id, userId, error })
    throw error
  }
}

export const getEquipmentItemStatsService = async (userId: string) => {
  try {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('ID de usuario inválido')
    }
    
    const [total, active, archived, sold, lost] = await Promise.all([
      countEquipmentItemsByUserRepository(userId),
      countEquipmentItemsByUserAndStatusRepository(userId, EquipmentStatus.ACTIVE),
      countEquipmentItemsByUserAndStatusRepository(userId, EquipmentStatus.ARCHIVED),
      countEquipmentItemsByUserAndStatusRepository(userId, EquipmentStatus.SOLD),
      countEquipmentItemsByUserAndStatusRepository(userId, EquipmentStatus.LOST)
    ])
    
    const stats = {
      total,
      byStatus: {
        active,
        archived,
        sold,
        lost
      }
    }
    
    logger.info('Equipment item stats retrieved successfully', {
      userId,
      stats
    })
    
    return stats
  } catch (error) {
    logger.error('Error retrieving equipment item stats', { userId, error })
    throw new Error('Error al obtener las estadísticas de equipamiento')
  }
}