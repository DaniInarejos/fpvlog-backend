import { Types } from 'mongoose'
import FollowerModel, { IFollower } from './followers.models'
import UserModel from '../users/users.models'
import { cacheService } from '../../configs/cache'

export const createFollowRelationRepository = async (followerId: string, followingId: string): Promise<IFollower> => {
  if (!Types.ObjectId.isValid(followerId) || !Types.ObjectId.isValid(followingId)) {
    throw new Error('Invalid user ID')
  }

  const followRelation = new FollowerModel({
    follower: new Types.ObjectId(followerId),
    following: new Types.ObjectId(followingId)
  })

  const result = await followRelation.save()
  
  // Limpiar cache
  await cacheService.deleteMany([
    `user:${followerId}`,
    `user:${followingId}`,
    `followers:${followingId}`,
    `following:${followerId}`
  ])
  
  return result
}

export const deleteFollowRelationRepository = async (followerId: string, followingId: string): Promise<boolean> => {
  if (!Types.ObjectId.isValid(followerId) || !Types.ObjectId.isValid(followingId)) {
    throw new Error('Invalid user ID')
  }

  const result = await FollowerModel.findOneAndDelete({
    follower: followerId,
    following: followingId
  })

  if (result) {
    // Limpiar cache
    await cacheService.deleteMany([
      `user:${followerId}`,
      `user:${followingId}`,
      `followers:${followingId}`,
      `following:${followerId}`
    ])
  }

  return !!result
}

export const getFollowersRepository = async (userId: string, page: number = 1, limit: number = 20) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID')
  }

  const skip = (page - 1) * limit
  const cacheKey = `followers:${userId}:${page}:${limit}`
  
  return await cacheService.loadData(
    cacheKey,
    async () => {
      const followers = await FollowerModel.find({ following: userId })
        .populate('follower', 'username name lastName profilePicture')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })

      const total = await FollowerModel.countDocuments({ following: userId })

      return {
        followers: followers.map(f => f.follower),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    }
  )
}

export const getFollowingRepository = async (userId: string, page: number = 1, limit: number = 20) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID')
  }

  const skip = (page - 1) * limit
  const cacheKey = `following:${userId}:${page}:${limit}`
  
  return await cacheService.loadData(
    cacheKey,
    async () => {
      const following = await FollowerModel.find({ follower: userId })
        .populate('following', 'username name lastName profilePicture')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })

      const total = await FollowerModel.countDocuments({ follower: userId })

      return {
        following: following.map(f => f.following),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    }
  )
}

export const checkIsFollowingRepository = async (followerId: string, followingId: string): Promise<boolean> => {
  if (!Types.ObjectId.isValid(followerId) || !Types.ObjectId.isValid(followingId)) {
    return false
  }

  const relation = await FollowerModel.findOne({
    follower: followerId,
    following: followingId
  })
  
  return !!relation
}

export const updateUserFollowArraysRepository = async (followerId: string, followingId: string, action: 'add' | 'remove') => {
  const operation = action === 'add' ? '$addToSet' : '$pull'
  
  await Promise.all([
    UserModel.findByIdAndUpdate(followerId, {
      [operation]: { following: followingId }
    }),
    UserModel.findByIdAndUpdate(followingId, {
      [operation]: { followers: followerId }
    })
  ])
}