import { Types } from 'mongoose'
import { cacheService } from '../../../../configs/cache'
import { logger } from '../../../../utils/logger'
// Cambiar la línea 2:
import TopicComment, { ITopicComment } from './topic-comments.models'

// Crear comentario en topic
export const createTopicCommentRepository = async (commentData: {
  topicId: string
  authorId: string
  content: string
  parentId?: string
}): Promise<ITopicComment> => {
  try {
    const comment = new TopicComment({
      ...commentData,
      topicId: new Types.ObjectId(commentData.topicId),
      authorId: new Types.ObjectId(commentData.authorId),
      parentId: commentData.parentId ? new Types.ObjectId(commentData.parentId) : null
    })

    const savedComment = await comment.save()
    await savedComment.populate('authorId', 'username profilePicture')

    // Invalidar cache usando patrones - SOLUCIONADO
    await Promise.all([
      cacheService.deletePattern(`topic_comments_${commentData.topicId}_*`),
      cacheService.delete(`topic:${commentData.topicId}`),
      cacheService.deletePattern(`group:*:topics:*`) 
    ])
    
    if (commentData.parentId) {
      await cacheService.deletePattern(`topic_comment_replies_${commentData.parentId}_*`)
    }

    return savedComment
  } catch (error) {
    logger.error('Error creating topic comment:', error)
    throw error
  }
}

// Obtener comentarios de un topic
export const findTopicCommentsRepository = async (
  topicId: string,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const cacheKey = `topic_comments_${topicId}_${page}_${limit}`
    
    return await cacheService.loadData(
      cacheKey,
      async () => {
        const skip = (page - 1) * limit
        
        const [comments, total] = await Promise.all([
          TopicComment.find({ 
            topicId: new Types.ObjectId(topicId),
            parentId: null // Solo comentarios principales
          })
          .populate('authorId', 'username profilePicture')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
          
          TopicComment.countDocuments({ 
            topicId: new Types.ObjectId(topicId),
            parentId: null
          })
        ])

        return {
          comments,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalComments: total,
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1
          }
        }
      },
      { ttl: 300 } // 5 minutos
    )
  } catch (error) {
    logger.error('Error finding topic comments:', error)
    throw error
  }
}

// Obtener respuestas de un comentario de topic
export const findTopicCommentRepliesRepository = async (
  commentId: string,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const cacheKey = `topic_comment_replies_${commentId}_${page}_${limit}`
    
    return await cacheService.loadData(
      cacheKey,
      async () => {
        const skip = (page - 1) * limit
        
        const [replies, total] = await Promise.all([
          TopicComment.find({ 
            parentId: new Types.ObjectId(commentId)
          })
          .populate('authorId', 'username profilePicture')
          .sort({ createdAt: 1 })
          .skip(skip)
          .limit(limit)
          .lean(),
          
          TopicComment.countDocuments({ 
            parentId: new Types.ObjectId(commentId)
          })
        ])

        return {
          replies,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalReplies: total,
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1
          }
        }
      },
      { ttl: 300 }
    )
  } catch (error) {
    logger.error('Error finding topic comment replies:', error)
    throw error
  }
}

export const updateTopicCommentRepository = async (
  commentId: string,
  content: string
): Promise<ITopicComment | null> => {
  try {
    const comment = await TopicComment.findByIdAndUpdate(
      commentId,
      { content, updatedAt: new Date() },
      { new: true }
    ).populate('authorId', 'username profilePicture')

    if (comment) {
      // Invalidar cache usando patrones - SOLUCIONADO
      await Promise.all([
        cacheService.deletePattern(`topic_comments_${comment.topicId}_*`),
        cacheService.delete(`topic:${comment.topicId}`),
        cacheService.deletePattern(`group:*:topics:*`)
      ])
      
      if (comment.parentId) {
        await cacheService.deletePattern(`topic_comment_replies_${comment.parentId}_*`)
      }
    }

    return comment
  } catch (error) {
    logger.error('Error updating topic comment:', error)
    throw error
  }
}

export const deleteTopicCommentRepository = async (commentId: string): Promise<boolean> => {
  try {
    const comment = await TopicComment.findById(commentId)
    if (!comment) return false

    await TopicComment.deleteMany({ parentId: new Types.ObjectId(commentId) })
    
    await TopicComment.findByIdAndDelete(commentId)

    // Invalidar cache usando patrones - SOLUCIONADO
    await Promise.all([
      cacheService.deletePattern(`topic_comments_${comment.topicId}_*`),
      cacheService.delete(`topic:${comment.topicId}`),
      cacheService.deletePattern(`group:*:topics:*`)
    ])
    
    if (comment.parentId) {
      await cacheService.deletePattern(`topic_comment_replies_${comment.parentId}_*`)
      // Decrementar contador de respuestas del padre
      await TopicComment.findByIdAndUpdate(
        comment.parentId,
        { $inc: { repliesCount: -1 } }
      )
    }

    return true
  } catch (error) {
    logger.error('Error deleting topic comment:', error)
    throw error
  }
}

// Buscar comentario por ID
export const findCommentByIdRepository = async (commentId: string): Promise<ITopicComment | null> => {
  try {
    if (!Types.ObjectId.isValid(commentId)) {
      return null
    }
    
    return await TopicComment.findById(commentId)
      .populate('authorId', 'username profilePicture')
      .lean()
  } catch (error) {
    logger.error('Error finding comment by ID:', error)
    throw error
  }
}

export const incrementTopicCommentLikeCountRepository = async (commentId: string): Promise<void> => {
  try {
    await TopicComment.findByIdAndUpdate(
      commentId,
      { $inc: { likesCount: 1 } }
    )
    
    // Invalidar cache relacionado - SOLUCIONADO
    const comment = await TopicComment.findById(commentId)
    if (comment?.topicId) {
      await cacheService.deletePattern(`topic_comments_${comment.topicId}_*`)
    }
  } catch (error) {
    logger.error('Error incrementing topic comment like count:', error)
    throw error
  }
}

export const decrementTopicCommentLikeCountRepository = async (commentId: string): Promise<void> => {
  try {
    await TopicComment.findByIdAndUpdate(
      commentId,
      { $inc: { likesCount: -1 } }
    )
    
    const comment = await TopicComment.findById(commentId)
    if (comment?.topicId) {
      await cacheService.deletePattern(`topic_comments_${comment.topicId}_*`)
    }
  } catch (error) {
    logger.error('Error decrementing topic comment like count:', error)
    throw error
  }
}
