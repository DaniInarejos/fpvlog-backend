import { Types } from 'mongoose'
import UserModel, { IUser } from './users.models'
import { cacheService } from '../../configs/cache'

export async function getAllUsersRepository(): Promise<IUser[]> {
  const cacheKey = 'users:all'
  
  const users = await cacheService.loadData<IUser[]>(
    cacheKey,
    async () => await UserModel.find().select('-password -_id -__v')
  )
  
  return users
}

export async function getUserByIdRepository(id: string): Promise<IUser | null> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid user ID')
  }
  
  const cacheKey = `user:${id}`
  return await cacheService.loadData<IUser | null>(
    cacheKey,
    async () => await UserModel.findById(id).select('-password -_id -__v')
  )
}

export async function updateUserRepository(id: string, data: Partial<IUser>): Promise<IUser | null> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid user ID')
  }
  
  const result = await UserModel.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  ).select('-password -_id -__v')
  
  if (result) {
    await cacheService.deleteMany([
      `user:${id}`,
      'users:all'
    ])
  }
  
  return result
}

export async function deleteUserRepository(id: string): Promise<boolean> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid user ID')
  }
  
  const result = await UserModel.findByIdAndDelete(id)
  
  // Invalidar la caché después de eliminar
  if (result) {
    await cacheService.deleteMany([
      `user:${id}`,
      'users:all'
    ])
  }
  
  return result !== null
}
