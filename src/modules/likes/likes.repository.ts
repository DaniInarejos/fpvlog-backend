import { Types } from 'mongoose'
import LikeModel, { ILike, TargetType } from './likes.models'
import { cacheService } from '../../configs/cache'

export async function createLikeRepository(data: Partial<ILike>): Promise<ILike> {
  const like = new LikeModel(data)
  const result = await like.save()
  
  await cacheService.deleteMany([
    `likes:${data.targetType}:${data.targetId}`,
    `likes:user:${data.userId}`
  ])
  
  return result
}

export async function deleteLikeRepository(userId: string, targetId: string, targetType: TargetType): Promise<boolean> {
  if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(targetId)) {
    throw new Error('ID inválido')
  }

  const result = await LikeModel.findOneAndDelete({
    userId,
    targetId,
    targetType
  })

  if (result) {
    await cacheService.deleteMany([
      `likes:${targetType}:${targetId}`,
      `likes:user:${userId}`
    ])
  }

  return !!result
}

export async function getLikesByTargetRepository(targetId: string, targetType: TargetType): Promise<number> {
  if (!Types.ObjectId.isValid(targetId)) {
    throw new Error('ID de objetivo inválido')
  }

  const cacheKey = `likes:${targetType}:${targetId}`
  
  return await cacheService.loadData<number>(
    cacheKey,
    async () => await LikeModel.countDocuments({ targetId, targetType })
  )
}

export async function checkUserLikeRepository(userId: string, targetId: string, targetType: TargetType): Promise<boolean> {
  if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(targetId)) {
    return false
  }

  const like = await LikeModel.findOne({
    userId,
    targetId,
    targetType
  })

  return !!like
}

export async function getLikesByUserRepository(userId: string, page: number = 1, limit: number = 20): Promise<{
  likes: ILike[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}> {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('ID de usuario inválido')
  }

  const skip = (page - 1) * limit
  const cacheKey = `likes:user:${userId}:${page}:${limit}`

  return await cacheService.loadData(
    cacheKey,
    async () => {
      const [likes, total] = await Promise.all([
        LikeModel.find({ userId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        LikeModel.countDocuments({ userId })
      ])

      return {
        likes,
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