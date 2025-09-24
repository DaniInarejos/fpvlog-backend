import { Types } from 'mongoose'
import EquipmentItem from './equipmentItems.models'
import type { IEquipmentItem, EquipmentType, EquipmentStatus } from './equipmentItems.models'
import { cacheService } from '../../configs/cache'

type CreateEquipmentItemData = Omit<IEquipmentItem, '_id' | 'createdAt' | 'updatedAt'>
type UpdateEquipmentItemData = Partial<Omit<CreateEquipmentItemData, 'userId'>>

export const findAllEquipmentItemsRepository = async () => {
  const cacheKey = 'equipmentItems:all'
  
  return await cacheService.loadData<IEquipmentItem[]>(
    cacheKey,
    async () => await EquipmentItem.find().sort({ createdAt: -1 as const }).populate('userId', 'username name lastName')
  )
}

export const findEquipmentItemByIdRepository = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null
  
  const cacheKey = `equipmentItems:${id}`
  
  return await cacheService.loadData<IEquipmentItem | null>(
    cacheKey,
    async () => await EquipmentItem.findById(id).populate('userId', 'username name lastName')
  )
}

export const findEquipmentItemsByUserRepository = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) return []
  
  const cacheKey = `equipmentItems:user:${userId}`
  
  return await cacheService.loadData<IEquipmentItem[]>(
    cacheKey,
    async () => await EquipmentItem.find({ userId }).sort({ createdAt: -1 as const })
  )
}

export const findEquipmentItemsByUserAndTypeRepository = async (userId: string, type: EquipmentType) => {
  if (!Types.ObjectId.isValid(userId)) return []
  
  const cacheKey = `equipmentItems:user:${userId}:type:${type}`
  
  return await cacheService.loadData<IEquipmentItem[]>(
    cacheKey,
    async () => await EquipmentItem.find({ userId, type }).sort({ createdAt: -1 as const })
  )
}

export const findEquipmentItemsByUserAndStatusRepository = async (userId: string, status: EquipmentStatus) => {
  if (!Types.ObjectId.isValid(userId)) return []
  
  const cacheKey = `equipmentItems:user:${userId}:status:${status}`
  
  return await cacheService.loadData<IEquipmentItem[]>(
    cacheKey,
    async () => await EquipmentItem.find({ userId, status }).sort({ createdAt: -1 as const })
  )
}

export const createEquipmentItemRepository = async (data: CreateEquipmentItemData) => {
  const equipmentItem = new EquipmentItem(data)
  const result = await equipmentItem.save()
  
  // Invalidar caché relacionado
  await cacheService.deleteMany([
    'equipmentItems:all',
    `equipmentItems:user:${data.userId._id}`,
    `equipmentItems:user:${data.userId._id}:type:${data.type}`,
    `equipmentItems:user:${data.userId._id}:status:${data.status}`
  ])
  
  
  return result
}

export const updateEquipmentItemRepository = async (id: string, data: UpdateEquipmentItemData) => {
  if (!Types.ObjectId.isValid(id)) return null
  
  const result = await EquipmentItem.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  ).populate('userId', 'username name lastName')
  
  if (result) {
    // Invalidar caché relacionado
    await cacheService.deleteMany([
      'equipmentItems:all',
      `equipmentItems:${id}`,
      `equipmentItems:user:${result.userId._id}`,
      `equipmentItems:user:${result.userId._id}:type:${result.type}`,
      `equipmentItems:user:${result.userId._id}:status:${result.status}`
    ])
  }
  
  return result
}

export const deleteEquipmentItemRepository = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null
  
  const equipmentItem = await EquipmentItem.findById(id)
  if (!equipmentItem) return null
  
  const result = await EquipmentItem.findByIdAndDelete(id)
  
  if (result) {
    // Invalidar caché relacionado
    await cacheService.deleteMany([
      'equipmentItems:all',
      `equipmentItems:${id}`,
      `equipmentItems:user:${equipmentItem.userId._id}`,
      `equipmentItems:user:${equipmentItem.userId._id}:type:${equipmentItem.type}`,
      `equipmentItems:user:${equipmentItem.userId._id}:status:${equipmentItem.status}`
    ])
  }
  
  return result
}

export const countEquipmentItemsByUserRepository = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) return 0
  
  const cacheKey = `equipmentItems:count:user:${userId}`
  
  return await cacheService.loadData<number>(
    cacheKey,
    async () => await EquipmentItem.countDocuments({ userId })
  )
}

export const countEquipmentItemsByUserAndStatusRepository = async (userId: string, status: EquipmentStatus) => {
  if (!Types.ObjectId.isValid(userId)) return 0
  
  const cacheKey = `equipmentItems:count:user:${userId}:status:${status}`
  
  return await cacheService.loadData<number>(
    cacheKey,
    async () => await EquipmentItem.countDocuments({ userId, status })
  )
}
