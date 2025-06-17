import { Types } from 'mongoose'
import DroneModel, { IDrone } from './drones.models'
import { cacheService } from '../../configs/cache'

export async function createDroneRepository(data: Partial<IDrone>): Promise<IDrone> {
  const drone = new DroneModel(data)
  const savedDrone = await drone.save()
  
  // Invalidar caché después de crear
  await Promise.all([
    cacheService.delete('drones:all'),
    cacheService.delete(`drones:user:${data.userId}`)
  ])
  
  return savedDrone
}

export async function getAllDronesRepository(): Promise<IDrone[]> {
  const cacheKey = 'drones:all'
  
  return await cacheService.loadData<IDrone[]>(
    cacheKey,
    async () => await DroneModel.find().select('-__v')
    )
}

export async function getDronesByUserRepository(userId: Types.ObjectId): Promise<IDrone[]> {
  const cacheKey = `drones:user:${userId}`
  
  return await cacheService.loadData<IDrone[]>(
    cacheKey,
    async () => await DroneModel.find({ userId }).select('-__v')
  )
}

export async function getDroneByIdRepository(id: string): Promise<IDrone | null> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid drone ID')
  }
  
  const cacheKey = `drone:${id}`
  return await cacheService.loadData<IDrone | null>(
    cacheKey,
    async () => await DroneModel.findById(id).select('-__v')
  )
}

export async function updateDroneRepository(id: string, data: Partial<IDrone>): Promise<IDrone | null> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid drone ID')
  }
  
  const result = await DroneModel.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  ).select('-__v')
  
  if (result) {
    await cacheService.deleteMany([
      `drone:${id}`,
      'drones:all',
      `drones:user:${result.userId}`
    ])
  }
  
  return result
}

export async function deleteDroneRepository(id: string): Promise<boolean> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid drone ID')
  }
  
  const drone = await DroneModel.findById(id)
  const result = await DroneModel.findByIdAndDelete(id)
  
  if (result && drone) {
    await cacheService.deleteMany([
      `drone:${id}`,
      'drones:all',
      `drones:user:${drone.userId}`
    ])
  }
  
  return result !== null
}

export class DroneRepository {
  async findAll(): Promise<IDrone[]> {
    return await DroneModel.find()
      .populate('typeId', 'name category')
      .populate('brandId', 'name country')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
  }

  async findById(id: string): Promise<IDrone | null> {
    return await DroneModel.findById(id)
      .populate('typeId', 'name category description')
      .populate('brandId', 'name country website')
      .populate('userId', 'name email')
  }

  async findByUserId(userId: string): Promise<IDrone[]> {
    return await DroneModel.find({ userId })
      .populate('typeId', 'name category')
      .populate('brandId', 'name country')
      .sort({ createdAt: -1 })
  }
}