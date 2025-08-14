import { Types } from 'mongoose'
import { ILike, TargetType } from './likes.models'
import {
  createLikeRepository,
  deleteLikeRepository,
  getLikesByTargetRepository,
  checkUserLikeRepository,
  getLikesByUserRepository
} from './likes.repository'

export async function toggleLikeService({userId, targetId, targetType}: {userId: string, targetId: string, targetType: TargetType}): Promise<{ liked: boolean, count: number }> {
  const hasLike = await checkUserLikeRepository(userId, targetId, targetType)

  if (hasLike) {
    await deleteLikeRepository(userId, targetId, targetType)
  } else {
    await createLikeRepository({
      userId: new Types.ObjectId(userId),
      targetId: new Types.ObjectId(targetId),
      targetType
    })
  }

  const count = await getLikesByTargetRepository(targetId, targetType)
  return { liked: !hasLike, count }
}

export async function getLikesByTargetService(targetId: string, targetType: TargetType): Promise<number> {
  return await getLikesByTargetRepository(targetId, targetType)
}

export async function checkUserLikeService(userId: string, targetId: string, targetType: TargetType): Promise<boolean> {
  return await checkUserLikeRepository(userId, targetId, targetType)
}

export async function getLikesByUserService(userId: string, page?: number, limit?: number) {
  return await getLikesByUserRepository(userId, page, limit)
}