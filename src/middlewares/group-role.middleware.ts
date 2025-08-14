import { Context, Next } from 'hono'
import { GroupRole } from '../modules/groups/members/group-members.models'
import {getMemberService } from '../modules/groups/members/group-members.services'

const roleHierarchy: Record<GroupRole, number> = {
  'OWNER': 5,
  'ADMIN': 4,
  'MOD': 3,
  'MEMBER': 2,
  'PENDING': 1,
  'BANNED': 0
}

export const groupRoleMiddleware = (requiredRole: GroupRole) => {
  return async (context: Context, next: Next) => {
    try {
      const user = context.get('user')
      if (!user) {
        return context.json({ error: 'No autorizado' }, 401)
      }
      
      // Mejorar la obtención del groupId
      const groupId = context.req.param('id') || context.req.param('groupId') || context.req.param('group_id')
      if (!groupId) {
        return context.json({ error: 'ID de grupo requerido' }, 400)
      }
      const membership = await getMemberService(groupId, user._id.toString())
      
      if (!membership) {
        return context.json({ error: 'No eres miembro de este grupo' }, 403)
      }
      
      if (membership.role === 'BANNED') {
        return context.json({ error: 'Has sido baneado de este grupo' }, 403)
      }
      
      // Verificar si el usuario tiene permisos pendientes
      if (membership.role === 'PENDING' && requiredRole !== 'PENDING') {
        return context.json({ error: 'Tu membresía está pendiente de aprobación' }, 403)
      }
      
      if (roleHierarchy[membership.role] < roleHierarchy[requiredRole]) {
        return context.json({ error: 'No tienes permisos suficientes' }, 403)
      }
      
      context.set('groupMembership', membership)
      await next()
    } catch (error) {
      console.error('Error en groupRoleMiddleware:', error)
      return context.json({ error: 'Error de autorización' }, 500)
    }
  }
}

export const groupMemberMiddleware = () => groupRoleMiddleware('MEMBER')
export const groupModMiddleware = () => groupRoleMiddleware('MOD')
export const groupAdminMiddleware = () => groupRoleMiddleware('ADMIN')
export const groupOwnerMiddleware = () => groupRoleMiddleware('OWNER')
// Cambiar la línea 2:
