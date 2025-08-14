import { Context } from 'hono'
import * as groupService from './groups.services'
import { getErrorMessage } from '../../utils/error'
import * as memberRepository from './members/group-members.repository'

export const createGroupController = async (context: Context): Promise<Response> => {
  try {
    const user = context.get('user')
    const data = await context.req.json()
    
    const group = await groupService.createGroupService(user._id.toString(), data)
    return context.json(group, 201)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export const getGroupController = async (context: Context): Promise<Response> => {
  try {
    const groupId = context.req.param('id')
    const user = context.get('user')
    
    const group = await groupService.getGroupService(groupId, user?._id.toString())
    return context.json(group)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 404)
  }
}

export const getGroupsController = async (context: Context): Promise<Response> => {
  try {
    const page = parseInt(context.req.query('page') || '1')
    const limit = parseInt(context.req.query('limit') || '10')
    const search = context.req.query('search')
    const createdBy = context.req.query('createdBy')
    const user = context.get('user')
    
    let result
    if (search) {
      result = await groupService.searchGroupsService(search, page, limit)
    } else {
      const filters: any = {}
      
      if (createdBy) {
        filters.createdBy = createdBy
      }
      
      result = await groupService.getGroupsService(filters, page, limit, user?._id.toString())
    }
    
    return context.json(result)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 500)
  }
}

export const updateGroupController = async (context: Context): Promise<Response> => {
  try {
    const groupId = context.req.param('id')
    const user = context.get('user')
    const data = await context.req.json()
    
    const group = await groupService.updateGroupService(groupId, user._id.toString(), data)
    return context.json(group)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export const deleteGroupController = async (context: Context): Promise<Response> => {
  try {
    const groupId = context.req.param('id')
    const user = context.get('user')
    
    await groupService.deleteGroupService(groupId, user._id.toString())
    return context.json({ message: 'Grupo eliminado exitosamente' })
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export const joinGroupController = async (context: Context): Promise<Response> => {
  try {
    const groupId = context.req.param('id')
    const user = context.get('user')
    
    await groupService.joinGroupService(groupId, user._id.toString())
    return context.json({ message: 'Te has unido al grupo exitosamente' })
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export const leaveGroupController = async (context: Context): Promise<Response> => {
  try {
    const groupId = context.req.param('id')
    const user = context.get('user')
    
    await groupService.leaveGroupService(groupId, user._id.toString())
    return context.json({ message: 'Has abandonado el grupo exitosamente' })
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export const getGroupMembersController = async (context: Context): Promise<Response> => {
  try {
    const groupId = context.req.param('id')
    const page = parseInt(context.req.query('page') || '1')
    const limit = parseInt(context.req.query('limit') || '20')
    
    const result = await memberRepository.findGroupMembersRepository(groupId, page, limit)
    return context.json(result)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export const manageMemberController = async (context: Context): Promise<Response> => {
  try {
    const groupId = context.req.param('id')
    const targetUserId = context.req.param('userId')
    const user = context.get('user')
    const { action, newRole } = await context.req.json()
    
    await groupService.manageMemberService(groupId, targetUserId, action, user._id.toString(), newRole)
    return context.json({ message: 'Acción realizada exitosamente' })
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export const getPendingMembersController = async (context: Context): Promise<Response> => {
  try {
    const groupId = context.req.param('id')
    const user = context.get('user')
    const page = parseInt(context.req.query('page') || '1')
    const limit = parseInt(context.req.query('limit') || '20')
    
    const result = await groupService.getPendingMembersService(groupId, user._id.toString(), page, limit)
    return context.json(result)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export const transferOwnershipController = async (context: Context): Promise<Response> => {
  try {
    const groupId = context.req.param('id')
    const user = context.get('user')
    const { newOwnerId } = await context.req.json()
    
    await groupService.transferOwnershipService(groupId, user._id.toString(), newOwnerId)
    return context.json({ message: 'Propiedad transferida exitosamente' })
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export const getGroupMembersPublicController = async (context: Context): Promise<Response> => {
  try {
    const groupId = context.req.param('id')
    const page = parseInt(context.req.query('page') || '1')
    const limit = parseInt(context.req.query('limit') || '20')
    const user = context.get('user')
    
    // Verificar si el grupo existe y obtener su información
    const group = await groupService.getGroupService(groupId)
    
    if (!group) {
      return context.json({ error: 'Grupo no encontrado' }, 404)
    }
    
    // Si el grupo es privado, verificar membresía
    if (group.isPrivate) {
      if (!user) {
        return context.json({ error: 'Autenticación requerida para grupos privados' }, 401)
      }
      
      // Verificar si el usuario es miembro del grupo
      const membership = await memberRepository.findMemberRepository(groupId, user._id.toString())
      
      if (!membership || membership.role === 'BANNED') {
        return context.json({ error: 'No tienes acceso a este grupo privado' }, 403)
      }
      
      if (membership.role === 'PENDING') {
        return context.json({ error: 'Tu membresía está pendiente de aprobación' }, 403)
      }
    }
    
    // Obtener miembros (excluyendo BANNED y PENDING para grupos públicos)
    const result = await memberRepository.findGroupMembersRepository(groupId, page, limit)
    return context.json(result)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}