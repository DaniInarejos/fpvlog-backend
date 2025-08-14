import { Hono } from 'hono'
import { authMiddleware } from '../../../middlewares/auth.middleware'
import { groupMemberMiddleware, groupAdminMiddleware } from '../../../middlewares/group-role.middleware'
import {
  createTopicController,
  getTopicController,
  getGroupTopicsController,
  updateTopicController,
  deleteTopicController
} from './group-topics.controllers'

const topicsRouter = new Hono()

// Rutas públicas (para grupos públicos)
topicsRouter.get('/:id/topics', getGroupTopicsController)
topicsRouter.get('/:id/topics/:topicId', getTopicController)

// Rutas protegidas
topicsRouter.use('/*', authMiddleware)
topicsRouter.post('/:id/topics', createTopicController)
topicsRouter.patch('/:id/topics/:topicId', updateTopicController)
topicsRouter.delete('/:id/topics/:topicId', deleteTopicController)

export default topicsRouter