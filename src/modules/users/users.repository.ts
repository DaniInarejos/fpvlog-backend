import { Types } from 'mongoose'
import UserModel, { IUser } from './users.models'

export async function getAllUsersRepository(): Promise<IUser[]> {
  return await UserModel.find().select('-password -_id -__v')
}

export async function getUserByIdRepository(id: string): Promise<IUser | null> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid user ID')
  }
  return await UserModel.findById(id).select('-password -_id -__v')
}

export async function updateUserRepository(id: string, data: Partial<IUser>): Promise<IUser | null> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid user ID')
  }
  return await UserModel.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  ).select('-password -_id -__v')
}

export async function deleteUserRepository(id: string): Promise<boolean> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid user ID')
  }
  const result = await UserModel.findByIdAndDelete(id)
  return result !== null
}
