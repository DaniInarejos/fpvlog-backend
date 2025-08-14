import { Hono } from 'hono'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { groupAdminMiddleware, groupOwnerMiddleware, groupMemberMiddleware } from '../../middlewares/group-role.middleware'
import {
  createGroupController,
  getGroupController,
  getGroupsController,
  updateGroupController,
  deleteGroupController,
  joinGroupController,
  leaveGroupController,
  getGroupMembersController,
  getGroupMembersPublicController,
  manageMemberController,
  getPendingMembersController,
  transferOwnershipController
} from './groups.controllers'
import topicsRouter from './topics/group-topics.routes'
import topicCommentsRouter from './topics/comments/topic-comments.routes' // Nueva importación

const groupsRouter = new Hono()

// Rutas públicas
groupsRouter.get('/', getGroupsController)
groupsRouter.get('/:id', getGroupController)

// Rutas protegidas
groupsRouter.use('/*', authMiddleware)
groupsRouter.post('/', createGroupController)
groupsRouter.post('/:id/join', joinGroupController)
groupsRouter.delete('/:id/leave', leaveGroupController)

// Endpoint público para grupos públicos
groupsRouter.get('/:id/members', getGroupMembersPublicController)

// Endpoint protegido para miembros (con información adicional)
groupsRouter.get('/:id/members/detailed', groupMemberMiddleware(), getGroupMembersController)
groupsRouter.get('/:id/members/pending', groupAdminMiddleware(), getPendingMembersController)
groupsRouter.patch('/:id/members/:userId', groupAdminMiddleware(), manageMemberController)

// Rutas con permisos específicos
groupsRouter.patch('/:id', groupAdminMiddleware(), updateGroupController)
groupsRouter.delete('/:id', groupOwnerMiddleware(), deleteGroupController)
groupsRouter.post('/:id/transfer-ownership', groupOwnerMiddleware(), transferOwnershipController)

// Rutas de topics, comentarios de posts y comentarios de topics
groupsRouter.route('/', topicsRouter)
groupsRouter.route('/', topicCommentsRouter) // Nueva ruta

export default groupsRouter