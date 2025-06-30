import { IUser } from './users.models'
import { 
  getAllUsersRepository, 
  getUserByIdRepository, 
  updateUserRepository, 
  deleteUserRepository,
  getDashboardDataRepository,
  updateProfilePictureRepository
 } from './users.repository'
import { uploadImageService } from '../../utils/image.service'

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


export const getDashboardDataService = async (username: string) => {
  const dashboardData = await getDashboardDataRepository(username)
  if (!dashboardData) {
    throw new Error('Usuario no encontrado')
  }

  const { user, stats, recentFlights, drones } = dashboardData

  return {
    user,
    stats,
    recentFlights,
    drones
  }
}


export const uploadProfileImageService = async (userId: string, file: { type: string, arrayBuffer: () => Promise<ArrayBuffer>, name: string }): Promise<string> => {
  const downloadURL = await uploadImageService(file, {
    folder: 'profile-pictures',
    fileName: userId,
    maxSizeInMB: 5
  })

  const user = await updateProfilePictureRepository(userId, downloadURL)
  if (!user) {
    throw new Error('Usuario no encontrado')
  }

  return downloadURL
}