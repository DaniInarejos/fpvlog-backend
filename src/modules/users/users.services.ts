import { IUser } from './users.models'
import { 
  getAllUsersRepository, 
  getUserByIdRepository, 
  updateUserRepository, 
  deleteUserRepository
 } from './users.repository'

export async function getAllUsersService(): Promise<IUser[]> {
  try {
    return await getAllUsersRepository()
  } catch (error) {
    throw new Error(`Failed to get users: ${error.message}`)
  }
}

export async function getUserByIdService(id: string): Promise<IUser | null> {
  try {
    return await getUserByIdRepository(id)
  } catch (error) {
    throw new Error(`Failed to get user: ${error.message}`)
  }
}

export async function updateUserService(id: string, data: Partial<IUser>): Promise<IUser | null> {
  try {
    return await updateUserRepository(id, data)
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`)
  }
}

export async function deleteUserService(id: string): Promise<boolean> {
  try {
    return await deleteUserRepository(id)
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`)
  }
}