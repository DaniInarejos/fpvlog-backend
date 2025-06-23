import { 
  createFollowRelationRepository,
  deleteFollowRelationRepository,
  getFollowersRepository,
  getFollowingRepository,
  checkIsFollowingRepository,
  updateUserFollowArraysRepository
} from './followers.repository'
import { getUserByIdRepository } from '../users/users.repository'

export const followUserService = async (followerId: string, followingId: string) => {
  if (followerId === followingId) {
    throw new Error('No puedes seguirte a ti mismo')
  }

  const [follower, following] = await Promise.all([
    getUserByIdRepository(followerId),
    getUserByIdRepository(followingId)
  ])

  if (!follower || !following) {
    throw new Error('Usuario no encontrado')
  }

  // Verificar si ya lo sigue
  const isAlreadyFollowing = await checkIsFollowingRepository(followerId, followingId)
  if (isAlreadyFollowing) {
    throw new Error('Ya sigues a este usuario')
  }

  // Crear la relación de seguimiento
  await createFollowRelationRepository(followerId, followingId)
  
  // Actualizar los arrays en los usuarios
  await updateUserFollowArraysRepository(followerId, followingId, 'add')

  return { message: 'Usuario seguido exitosamente' }
}

export const unfollowUserService = async (followerId: string, followingId: string) => {
  // Verificar si realmente lo sigue
  const isFollowing = await checkIsFollowingRepository(followerId, followingId)
  if (!isFollowing) {
    throw new Error('No sigues a este usuario')
  }

  // Eliminar la relación de seguimiento
  await deleteFollowRelationRepository(followerId, followingId)
  
  // Actualizar los arrays en los usuarios
  await updateUserFollowArraysRepository(followerId, followingId, 'remove')

  return { message: 'Dejaste de seguir al usuario' }
}

export const getFollowersService = async (userId: string, page: number = 1, limit: number = 20) => {
  return await getFollowersRepository(userId, page, limit)
}

export const getFollowingService = async (userId: string, page: number = 1, limit: number = 20) => {
  return await getFollowingRepository(userId, page, limit)
}

export const checkIsFollowingService = async (followerId: string, followingId: string): Promise<boolean> => {
  return await checkIsFollowingRepository(followerId, followingId)
}