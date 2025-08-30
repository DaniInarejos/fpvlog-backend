import { z } from 'zod'
import {
  createTopicCommentRepository,
  findTopicCommentsRepository,
  findTopicCommentRepliesRepository,
  updateTopicCommentRepository,
  deleteTopicCommentRepository,
  incrementTopicCommentLikeCountRepository,
  decrementTopicCommentLikeCountRepository,
  findCommentByIdRepository
} from './topic-comments.repository'
import { findTopicByIdRepository } from '../group-topics.repository'
import { toggleLikeService } from '../../../likes/likes.services'
import { getGroupService } from '../../groups.services'
import TopicComment from './topic-comments.models'
import {logger} from '../../../../utils/logger'
import { checkMembershipService,getMemberService } from '../../members/group-members.services'

// Esquemas de validación
const createTopicCommentSchema = z.object({
  content: z.string().min(1, 'El contenido es requerido').max(100000, 'Máximo 100000 caracteres'),
  parentId: z.string().optional()
})

const updateTopicCommentSchema = z.object({
  content: z.string().min(1, 'El contenido es requerido').max(100000, 'Máximo 100000 caracteres')
})


// Crear comentario en topic
export const createTopicCommentService = async (
  topicId: string,
  userId: string,
  data: z.infer<typeof createTopicCommentSchema>
) => {
  try {
    // Validar datos
    const validatedData = createTopicCommentSchema.parse(data)

    // Verificar que el topic existe
    const topic = await findTopicByIdRepository(topicId)
    if (!topic) {
      throw new Error('Topic no encontrado')
    }

    // Obtener información del grupo para verificar el creador
    const group = await getGroupService(topic.groupId._id.toString(), userId)

    // Verificar si el usuario es el creador del grupo
    const isGroupCreator = group.createdBy._id.toString() === userId
    
    // Si no es el creador, verificar membresía del grupo
    if (!isGroupCreator) {
      const isMember = await checkGroupMembershipService(topic.groupId._id.toString(), userId)

      if (!isMember) {
        throw new Error('No eres miembro de este grupo ni su creador')
      }
    }

    // Si es una respuesta, verificar que el comentario padre existe
    if (validatedData.parentId) {
      const parentComment = await findCommentByIdRepository(validatedData.parentId)
      if (!parentComment || parentComment.topicId?.toString() !== topicId) {
        throw new Error('Comentario padre no encontrado o no pertenece a este topic')
      }
    }

    // Crear comentario
    const comment = await createTopicCommentRepository({
      topicId,
      authorId: userId,
      content: validatedData.content,
      parentId: validatedData.parentId
    })

    // Si es una respuesta, incrementar contador del padre
    if (validatedData.parentId) {
      await TopicComment.findByIdAndUpdate(
        validatedData.parentId,
        { $inc: { repliesCount: 1 } }
      )
    }

    return comment
  } catch (error) {
    logger.error('Error in createTopicCommentService:', error)
    throw error
  }
}

// Obtener comentarios de un topic
export const getTopicCommentsService = async (
  topicId: string,
  userId?: string,
  page: number = 1,
  limit: number = 10
) => {
  try {
    // Verificar que el topic existe
    const topic = await findTopicByIdRepository(topicId)
    if (!topic) {
      throw new Error('Topic no encontrado')
    }

    // Obtener información del grupo
    const group = await getGroupService(topic.groupId._id.toString(), userId)
    
    // Si el grupo es privado y hay un usuario, verificar membresía
    if (group.isPrivate && userId) {
      const isMember = await checkGroupMembershipService(topic.groupId.toString(), userId)
      if (!isMember) {
        throw new Error('No tienes permisos para ver los comentarios de este grupo privado')
      }
    } else if (group.isPrivate && !userId) {
      throw new Error('Debes estar autenticado para ver comentarios de grupos privados')
    }

    return await findTopicCommentsRepository(topicId, page, limit)
  } catch (error) {
    logger.error('Error in getTopicCommentsService:', error)
    throw error
  }
}

// Obtener respuestas de un comentario
export const getTopicCommentRepliesService = async (
  commentId: string,
  userId?: string,
  page: number = 1,
  limit: number = 10
) => {
  try {
    // Verificar que el comentario existe
    const comment = await findCommentByIdRepository(commentId)
    if (!comment || !comment.topicId) {
      throw new Error('Comentario no encontrado o no pertenece a un topic')
    }

    // Obtener el topic para acceder al groupId
    const topic = await findTopicByIdRepository(comment.topicId.toString())
    if (!topic) {
      throw new Error('Topic no encontrado')
    }

    // Obtener información del grupo
    const group = await getGroupService(topic.groupId.toString(), userId)
    
    // Si el grupo es privado y hay un usuario, verificar membresía
    if (group.isPrivate && userId) {
      const isMember = await checkGroupMembershipService(topic.groupId.toString(), userId)
      if (!isMember) {
        throw new Error('No tienes permisos para ver las respuestas de este grupo privado')
      }
    } else if (group.isPrivate && !userId) {
      throw new Error('Debes estar autenticado para ver respuestas de grupos privados')
    }

    return await findTopicCommentRepliesRepository(commentId, page, limit)
  } catch (error) {
    logger.error('Error in getTopicCommentRepliesService:', error)
    throw error
  }
}

// Actualizar comentario
export const updateTopicCommentService = async (
  commentId: string,
  userId: string,
  data: z.infer<typeof updateTopicCommentSchema>
) => {
  try {
    // Validar datos
    const validatedData = updateTopicCommentSchema.parse(data)

    // Verificar que el comentario existe y pertenece al usuario
    const comment = await findCommentByIdRepository(commentId)
    if (!comment || !comment.topicId) {
      throw new Error('Comentario no encontrado')
    }
    if (comment.authorId._id.toString() !== userId) {
      throw new Error('Solo puedes editar tus propios comentarios')
    }

    return await updateTopicCommentRepository(commentId, validatedData.content)
  } catch (error) {
    logger.error('Error in updateTopicCommentService:', error)
    throw error
  }
}

// Eliminar comentario
export const deleteTopicCommentService = async (
  commentId: string,
  userId: string
) => {
  try {
    const comment = await findCommentByIdRepository(commentId)
    if (!comment || !comment.topicId) {
      throw new Error('Comentario no encontrado')
    }

    const topic = await findTopicByIdRepository(comment.topicId.toString())
    if (!topic) {
      throw new Error('Topic no encontrado')
    }

    const isAuthor = comment.authorId.toString() === userId
    const membership = await getMemberService(topic.groupId._id.toString(), userId)
    const isAdmin = membership && ['ADMIN', 'OWNER'].includes(membership.role)

    if (!isAuthor && !isAdmin) {
      throw new Error('Sin permisos para eliminar este comentario')
    }

    return await deleteTopicCommentRepository(commentId)
  } catch (error) {
    logger.error('Error in deleteTopicCommentService:', error)
    throw error
  }
}

// Toggle like en comentario
export const toggleTopicCommentLikeService = async (
  commentId: string,
  userId: string
) => {
  try {
    // Verificar que el comentario existe
    const comment = await findCommentByIdRepository(commentId)
    if (!comment || !comment.topicId) {
      throw new Error('Comentario no encontrado')
    }

    // Verificar membresía del grupo
    const topic = await findTopicByIdRepository(comment.topicId.toString())
    if (!topic) {
      throw new Error('Topic no encontrado')
    }

    const isMember = await checkGroupMembershipService(topic.groupId.toString(), userId)
    if (!isMember) {
      throw new Error('No eres miembro de este grupo')
    }

    // Toggle like usando el servicio existente
    const likeResult = await toggleLikeService({
      targetType: 'group_comment',
      targetId: commentId,
      userId
    })

    // Actualizar contador en el comentario
    if (likeResult.liked) {
      await incrementTopicCommentLikeCountRepository(commentId)
    } else {
      await decrementTopicCommentLikeCountRepository(commentId)
    }

    return {
      liked: likeResult.liked,
      likesCount: likeResult.count
    }
  } catch (error) {
    logger.error('Error in toggleTopicCommentLikeService:', error)
    throw error
  }
}

const checkGroupMembershipService = async (groupId: string, userId: string): Promise<boolean> => {
  try {
    const membership = await checkMembershipService(groupId, userId)
    return membership.isActive
  } catch (error) {
    logger.error('Error checking group membership:', error)
    return false
  }
}