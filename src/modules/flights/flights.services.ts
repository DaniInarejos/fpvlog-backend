import { Types } from 'mongoose'
import { IFlight } from './flights.models'
import { 
  getAllFlightsRepository, 
  getFlightByIdRepository, 
  updateFlightRepository, 
  deleteFlightRepository,
  createFlightRepository,
  getFlightsByUserRepository,
  getVisibleFlightsRepository
} from './flights.repository'
import { checkIsFollowingService, getFollowingService } from '../followers/followers.services'
import { getUserByIdService } from '../users/users.services'
import { logger } from '../../utils/logger'
import { uploadImageService } from '../../utils/image.service'

export const createFlightService = async (data: Partial<IFlight>): Promise<IFlight> => {
  return await createFlightRepository(data)
}

export const getAllFlightsService = async (): Promise<IFlight[]> => {
  return await getAllFlightsRepository()
}

export const getFlightsByUserService = async (userId: Types.ObjectId): Promise<IFlight[]> => {
  return await getFlightsByUserRepository(userId)
}

export const getFlightByIdService = async (id: string): Promise<IFlight | null> => {
  return await getFlightByIdRepository(id)
}

export const updateFlightService = async (id: string, data: Partial<IFlight>): Promise<IFlight | null> => {
  return await updateFlightRepository(id, data)
}

export const deleteFlightService = async (id: string): Promise<boolean> => {
  return await deleteFlightRepository(id)
}

export const getVisibleFlightsService = async (
  viewerId: string, 
  ownerId?: string, 
  page: number = 1, 
  limit: number = 20
) => {
  try {
    const skip = (page - 1) * limit
    let query: any = {}

    if (ownerId) {
      // Ver vuelos de un usuario específico
      query.userId = ownerId
      
      if (viewerId !== ownerId) {
        // No es el propietario, verificar permisos
        const owner = await getUserByIdService(ownerId)
        const userIsFollowing = await checkIsFollowingService(viewerId, ownerId)
        
        if (!owner) {
          throw new Error('Usuario no encontrado')
        }

        // Aplicar filtros de privacidad
        if (userIsFollowing && owner.privacySettings?.allowFollowersToSeeFlights) {
          query['visibility.isVisibleToFollowers'] = true
        } else {
          query['visibility.isPublic'] = true
        }
      }
    } else {
      // Ver vuelos de usuarios que sigue
      const followingResult = await getFollowingService(viewerId, 1, 1000)
      const followingIds = followingResult.following.map((user: any) => user._id)
      
      query = {
        $or: [
          { userId: viewerId }, // Sus propios vuelos
          {
            userId: { $in: followingIds },
            'visibility.isVisibleToFollowers': true
          },
          { 'visibility.isPublic': true }
        ]
      }
    }

    // Usar el repository en lugar de acceder directamente al modelo
    const result = await getVisibleFlightsRepository(query, skip, limit)

    return {
      flights: result.flights,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit)
      }
    }
  } catch (error) {
    logger.error('Error al obtener vuelos visibles:', error)
    throw error
  }
}

export async function uploadFlightImageService(id: string, file: File): Promise<IFlight | null> {
  const imageUrl = await uploadImageService(file, {
    folder: 'flights',
    fileName: `flight-${id}`,
    maxSizeInMB: 5
  })
  return await updateFlightRepository(id, { image: imageUrl })
}
