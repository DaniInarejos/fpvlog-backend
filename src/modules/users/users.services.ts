import { IUser } from './users.models'
import { 
  getAllUsersRepository, 
  getUserByIdRepository, 
  updateUserRepository, 
  deleteUserRepository,
  getDashboardDataRepository
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


export const getDashboardDataService = async (username: string) => {
  const dashboardData = await getDashboardDataRepository(username)
  if (!dashboardData) {
    throw new Error('Usuario no encontrado')
  }

  const { user, stats, recentFlights, drones } = dashboardData

  return {
    user: {
      _id: user._id,
      username: user.username,
      name: user.name,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      points: user.points
    },
    stats,
    recentFlights,
    drones
  }
}