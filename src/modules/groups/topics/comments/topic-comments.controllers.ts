import { Context } from 'hono'
import {
  createTopicCommentService,
  getTopicCommentsService,
  getTopicCommentRepliesService,
  updateTopicCommentService,
  deleteTopicCommentService,
  toggleTopicCommentLikeService
} from './topic-comments.services'
import {logger} from '../../../../utils/logger'

// Crear comentario en topic
export const createTopicCommentController = async (c: Context) => {
  try {
    const topicId = c.req.param('topicId')
    const user = c.get('user')
    const body = await c.req.json()

    const comment = await createTopicCommentService(topicId, user._id, body)

    return c.json({
      success: true,
      data: comment
    }, 201)
  } catch (error: any) {
    logger.error('Error in createTopicCommentController:', error)
    return c.json({
      success: false,
      message: error.message || 'Error al crear comentario'
    }, error.message?.includes('permisos') || error.message?.includes('autenticado') ? 403 : 400)
  }
}

// Obtener comentarios de un topic
export const getTopicCommentsController = async (c: Context) => {
  try {
    const topicId = c.req.param('topicId')
    const user = c.get('user') // Puede ser undefined para usuarios no autenticados
    const page = parseInt(c.req.query('page') || '1')
    const limit = Math.min(parseInt(c.req.query('limit') || '10'), 50)

    const result = await getTopicCommentsService(topicId, user._id, page, limit)

    return c.json({
      success: true,
      data: result
    })
  } catch (error: any) {
    logger.error('Error in getTopicCommentsController:', error)
    return c.json({
      success: false,
      message: error.message || 'Error al obtener comentarios'
    }, error.message?.includes('permisos') || error.message?.includes('autenticado') ? 403 : 400)
  }
}

// Obtener respuestas de un comentario
export const getTopicCommentRepliesController = async (c: Context) => {
  try {
    const commentId = c.req.param('commentId')
    const userId = c.get('userId') // Puede ser undefined para usuarios no autenticados
    const page = parseInt(c.req.query('page') || '1')
    const limit = Math.min(parseInt(c.req.query('limit') || '10'), 50)

    const result = await getTopicCommentRepliesService(commentId, userId, page, limit)

    return c.json({
      success: true,
      data: result
    })
  } catch (error: any) {
    logger.error('Error in getTopicCommentRepliesController:', error)
    return c.json({
      success: false,
      message: error.message || 'Error al obtener respuestas'
    }, 400)
  }
}

// Actualizar comentario
export const updateTopicCommentController = async (c: Context) => {
  try {
    const commentId = c.req.param('commentId')
    const userId = c.get('user')._id
    const body = await c.req.json()

    const comment = await updateTopicCommentService(commentId, userId, body)

    return c.json({
      success: true,
      data: comment
    })
  } catch (error: any) {
    logger.error('Error in updateTopicCommentController:', error)
    return c.json({
      success: false,
      message: error.message || 'Error al actualizar comentario'
    }, 400)
  }
}

// Eliminar comentario
export const deleteTopicCommentController = async (c: Context) => {
  try {
    const commentId = c.req.param('commentId')
    const userId = c.get('user')._id


    await deleteTopicCommentService(commentId, userId)

    return c.json({
      success: true,
      message: 'Comentario eliminado exitosamente'
    })
  } catch (error: any) {
    logger.error('Error in deleteTopicCommentController:', error)
    return c.json({
      success: false,
      message: error.message || 'Error al eliminar comentario'
    }, 400)
  }
}

// Toggle like en comentario
export const toggleTopicCommentLikeController = async (c: Context) => {
  try {
    const commentId = c.req.param('commentId')
    const userId = c.get('userId')

    const result = await toggleTopicCommentLikeService(commentId, userId)

    return c.json({
      success: true,
      data: result
    })
  } catch (error: any) {
    logger.error('Error in toggleTopicCommentLikeController:', error)
    return c.json({
      success: false,
      message: error.message || 'Error al procesar like'
    }, 400)
  }
}