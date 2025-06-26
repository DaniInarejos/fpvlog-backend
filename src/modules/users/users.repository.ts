import { Types } from 'mongoose'
import UserModel, { IUser } from './users.models'
import { cacheService } from '../../configs/cache'
import { dashboardAggregation } from "./aggregations/dashboard"

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
    async () => await UserModel.findById(id).select('-password -__v')
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

export const getDashboardDataRepository = async (username: string) => {
  const aggregation = dashboardAggregation(username)
  const result = await UserModel.aggregate(aggregation).exec()

  if (!result || result.length === 0) return null

  return result[0]
}


export const updateProfilePictureRepository = async (userId: string, imageUrl: string): Promise<IUser | null> => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID')
  }
  
  const result = await UserModel.findByIdAndUpdate(
    userId,
    { $set: { profilePicture: imageUrl } },
    { new: true }
  ).select('-password -__v')
  
  if (result) {
    await cacheService.deleteMany([
      `user:${userId}`,
      'users:all'
    ])
  }
  
  return result
}
