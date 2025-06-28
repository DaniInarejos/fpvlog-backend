import { Types } from 'mongoose'
import UserModel from '../users/users.models'
import { cacheService } from '../../configs/cache'
import { getFeedItemsAggregation, getTotalDronesAggregation, getTotalFlightsAggregation } from './feeds.aggregations'

const getFeedItems = async (query: any, page: number, limit: number, lastTimestamp?: string) => {
  const items = await UserModel.aggregate(getFeedItemsAggregation(query, page, limit, lastTimestamp))

  // Contar totales
  const [totalUsers, totalDrones, totalFlights] = await Promise.all([
    UserModel.countDocuments(query.users),
    UserModel.aggregate(getTotalDronesAggregation(query)).then(result => (result[0]?.total || 0)),
    UserModel.aggregate(getTotalFlightsAggregation(query)).then(result => (result[0]?.total || 0))
  ])

  const totalItems = totalUsers + totalDrones + totalFlights
  const totalPages = Math.ceil(totalItems / limit)
  const hasNextPage = page < totalPages
  const nextTimestamp = items.length > 0 ? items[items.length - 1].createdAt.toISOString() : null

  return {
    items,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      hasNextPage,
      nextTimestamp
    }
  }
}

export const getGlobalFeedRepository = async (page: number = 1, limit: number = 20, lastTimestamp?: string) => {
  // TODO ya le metere cache a esto cuando lo deje fino
  // const cacheKey = `globalFeed:${page}:${limit}:${lastTimestamp || 'none'}` 

 const query = {
        flights: { 'visibility.isPublic': true },
        drones: { 'visibility.isPublic': true },
        users: { 'privacySettings.profileVisibility': 'public' }
      }

      return await getFeedItems(query, page, limit, lastTimestamp)
}

export const getFollowingFeedRepository = async (userId: string, page: number = 1, limit: number = 20, lastTimestamp?: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('ID de usuario inválido')
  }
    // TODO 
    // const cacheKey = `followingFeed:${userId}:${page}:${limit}:${lastTimestamp || 'none'}`

  const user = await UserModel.findById(userId)
      if (!user) {
        throw new Error('Usuario no encontrado')
      }

      const query = {
        flights: {
          $or: [
            { userId: { $in: user.following }, 'visibility.isVisibleToFollowers': true },
            { userId: { $in: user.following }, 'visibility.isPublic': true }
          ]
        },
        drones: {
          $or: [
            { userId: { $in: user.following }, 'visibility.isVisibleToFollowers': true },
            { userId: { $in: user.following }, 'visibility.isPublic': true }
          ]
        },
        users: {
          _id: { $in: user.following },
          $or: [
            { 'privacySettings.profileVisibility': 'public' },
            { 'privacySettings.profileVisibility': 'followers' }
          ]
        }
      }

      return await getFeedItems(query, page, limit, lastTimestamp)

}