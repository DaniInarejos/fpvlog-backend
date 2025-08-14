import { Hono } from 'hono'
import { authMiddleware } from '../../../../middlewares/auth.middleware'
import {
  createTopicCommentController,
  getTopicCommentsController,
  getTopicCommentRepliesController,
  updateTopicCommentController,
  deleteTopicCommentController,
  toggleTopicCommentLikeController
} from './topic-comments.controllers'

const topicCommentsRouter = new Hono()

// Rutas públicas (para grupos públicos)
topicCommentsRouter.get('/:groupId/topics/:topicId/comments', getTopicCommentsController)
topicCommentsRouter.get('/:groupId/topics/:topicId/comments/:commentId/replies', getTopicCommentRepliesController)

// Rutas protegidas
topicCommentsRouter.use('/*', authMiddleware)
topicCommentsRouter.post('/:groupId/topics/:topicId/comments', createTopicCommentController)
topicCommentsRouter.patch('/:groupId/topics/comments/:commentId', updateTopicCommentController)
topicCommentsRouter.delete('/:groupId/topics/comments/:commentId', deleteTopicCommentController)
topicCommentsRouter.post('/:groupId/topics/comments/:commentId/like', toggleTopicCommentLikeController)

export default topicCommentsRouter