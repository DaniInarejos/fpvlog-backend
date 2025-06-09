import { IUser } from './users.models'
import { 
  getAllUsersRepository, 
  getUserByIdRepository, 
  updateUserRepository, 
  deleteUserRepository
 } from './users.repository'

export async function getAllUsersService(): Promise<IUser[]> {
  return await getAllUsersRepository()
}

export async function getUserByIdService(id: string): Promise<IUser | null> {
  return await getUserByIdRepository(id)
}

export async function updateUserService(id: string, data: Partial<IUser>): Promise<IUser | null> {
  return await updateUserRepository(id, data)
}

export async function deleteUserService(id: string): Promise<boolean> {
  return await deleteUserRepository(id)
}