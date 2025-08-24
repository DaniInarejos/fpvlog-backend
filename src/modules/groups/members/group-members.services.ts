import { z } from 'zod'
import {
  addMemberRepository,
  findMemberRepository,
  findGroupMembersRepository,
  countMembersRepository,
  updateMemberRoleRepository,
  removeMemberRepository,
  findUserGroupsRepository
} from './group-members.repository'
import { GroupRole } from './group-members.models'
import { logger } from '../../../utils/logger'

// Esquemas de validación
const addMemberSchema = z.object({
  groupId: z.string().min(1, 'ID de grupo requerido'),
  userId: z.string().min(1, 'ID de usuario requerido'),
  role: z.enum(['OWNER', 'ADMIN', 'MOD', 'MEMBER', 'PENDING', 'BANNED']).optional().default('MEMBER')
})

const updateMemberRoleSchema = z.object({
  groupId: z.string().min(1, 'ID de grupo requerido'),
  userId: z.string().min(1, 'ID de usuario requerido'),
  newRole: z.enum(['OWNER', 'ADMIN', 'MOD', 'MEMBER', 'PENDING', 'BANNED'])
})

const getMembersSchema = z.object({
  groupId: z.string().min(1, 'ID de grupo requerido'),
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(50).optional().default(20),
  roles: z.array(z.enum(['OWNER', 'ADMIN', 'MOD', 'MEMBER', 'PENDING', 'BANNED'])).optional()
})

// Servicio para agregar miembro
export const addMemberService = async (data: z.infer<typeof addMemberSchema>) => {
  try {
    const validatedData = addMemberSchema.parse(data)
    
    // Verificar si el usuario ya es miembro
    const existingMember = await findMemberRepository(validatedData.groupId, validatedData.userId)
    if (existingMember) {
      throw new Error('El usuario ya es miembro del grupo')
    }
    
    return await addMemberRepository(
      validatedData.groupId,
      validatedData.userId,
      validatedData.role as GroupRole
    )
  } catch (error) {
    logger.error('Error in addMemberService:', error)
    throw error
  }
}

// Servicio para obtener un miembro específico
export const getMemberService = async (groupId: string, userId: string) => {
  try {

    if (!groupId || !userId) {
      throw new Error('ID de grupo y usuario son requeridos')
    }
    
    return await findMemberRepository(groupId, userId)
  } catch (error) {
    logger.error('Error in getMemberService:', error)
    throw error
  }
}

// Servicio para verificar membresía y rol
export const checkMembershipService = async (groupId: string, userId: string): Promise<{
  isMember: boolean
  role?: GroupRole
  isActive: boolean
}> => {
  try {
    const member = await findMemberRepository(groupId, userId)
    
    if (!member) {
      return { isMember: false, isActive: false }
    }
    
    const isActive = !['BANNED', 'PENDING'].includes(member.role)
    
    return {
      isMember: true,
      role: member.role,
      isActive
    }
  } catch (error) {
    logger.error('Error in checkMembershipService:', error)
    throw error
  }
}

// Servicio para verificar permisos
export const checkPermissionsService = async (
  groupId: string,
  userId: string,
  requiredRoles: GroupRole[]
): Promise<boolean> => {
  try {
    const member = await findMemberRepository(groupId, userId)
    
    if (!member || ['BANNED', 'PENDING'].includes(member.role)) {
      return false
    }
    
    return requiredRoles.includes(member.role)
  } catch (error) {
    logger.error('Error in checkPermissionsService:', error)
    return false
  }
}

// Servicio para obtener miembros del grupo
export const getGroupMembersService = async (data: z.infer<typeof getMembersSchema>) => {
  try {
    const validatedData = getMembersSchema.parse(data)
    
    return await findGroupMembersRepository(
      validatedData.groupId,
      validatedData.page,
      validatedData.limit,
      validatedData.roles
    )
  } catch (error) {
    logger.error('Error in getGroupMembersService:', error)
    throw error
  }
}

// Servicio para contar miembros
export const countMembersService = async (groupId: string, roles?: GroupRole[]) => {
  try {
    if (!groupId) {
      throw new Error('ID de grupo requerido')
    }
    
    return await countMembersRepository(groupId, roles)
  } catch (error) {
    logger.error('Error in countMembersService:', error)
    throw error
  }
}

// Servicio para actualizar rol de miembro
export const updateMemberRoleService = async (
  data: z.infer<typeof updateMemberRoleSchema>,
  requesterId: string
) => {
  try {
    const validatedData = updateMemberRoleSchema.parse(data)
    
    // Verificar que el solicitante tenga permisos
    const requesterMember = await findMemberRepository(validatedData.groupId, requesterId)
    if (!requesterMember || !['OWNER', 'ADMIN'].includes(requesterMember.role)) {
      throw new Error('No tienes permisos para cambiar roles')
    }
    
    // Verificar que el miembro objetivo existe
    const targetMember = await findMemberRepository(validatedData.groupId, validatedData.userId)
    if (!targetMember) {
      throw new Error('Miembro no encontrado')
    }
    
    // Solo OWNER puede cambiar roles de ADMIN
    if (targetMember.role === 'ADMIN' && requesterMember.role !== 'OWNER') {
      throw new Error('Solo el propietario puede cambiar el rol de un administrador')
    }
    
    // Solo OWNER puede asignar rol de OWNER
    if (validatedData.newRole === 'OWNER' && requesterMember.role !== 'OWNER') {
      throw new Error('Solo el propietario puede asignar el rol de propietario')
    }
    
    // No se puede cambiar el rol del propietario
    if (targetMember.role === 'OWNER') {
      throw new Error('No se puede cambiar el rol del propietario')
    }
    
    return await updateMemberRoleRepository(
      validatedData.groupId,
      validatedData.userId,
      validatedData.newRole
    )
  } catch (error) {
    logger.error('Error in updateMemberRoleService:', error)
    throw error
  }
}

// Servicio para remover miembro
export const removeMemberService = async (
  groupId: string,
  userId: string,
  requesterId: string
) => {
  try {
    if (!groupId || !userId || !requesterId) {
      throw new Error('Todos los parámetros son requeridos')
    }
    
    // Verificar permisos del solicitante
    const requesterMember = await findMemberRepository(groupId, requesterId)
    if (!requesterMember || !['OWNER', 'ADMIN', 'MOD'].includes(requesterMember.role)) {
      throw new Error('No tienes permisos para remover miembros')
    }
    
    // Verificar que el miembro objetivo existe
    const targetMember = await findMemberRepository(groupId, userId)
    if (!targetMember) {
      throw new Error('Miembro no encontrado')
    }
    
    // No se puede remover al propietario
    if (targetMember.role === 'OWNER') {
      throw new Error('No se puede remover al propietario del grupo')
    }
    
    // Solo OWNER y ADMIN pueden remover ADMIN
    if (targetMember.role === 'ADMIN' && !['OWNER', 'ADMIN'].includes(requesterMember.role)) {
      throw new Error('Solo propietarios y administradores pueden remover administradores')
    }
    
    // MOD no puede remover ADMIN
    if (targetMember.role === 'ADMIN' && requesterMember.role === 'MOD') {
      throw new Error('Los moderadores no pueden remover administradores')
    }
    
    return await removeMemberRepository(groupId, userId)
  } catch (error) {
    logger.error('Error in removeMemberService:', error)
    throw error
  }
}

// Servicio para obtener grupos del usuario
export const getUserGroupsService = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error('ID de usuario requerido')
    }
    
    return await findUserGroupsRepository(userId)
  } catch (error) {
    logger.error('Error in getUserGroupsService:', error)
    throw error
  }
}

// Servicio para solicitar unirse a un grupo
export const requestJoinGroupService = async (groupId: string, userId: string) => {
  try {
    return await addMemberService({
      groupId,
      userId,
      role: 'PENDING'
    })
  } catch (error) {
    logger.error('Error in requestJoinGroupService:', error)
    throw error
  }
}

// Servicio para aprobar solicitud de membresía
export const approveMembershipService = async (
  groupId: string,
  userId: string,
  requesterId: string
) => {
  try {
    // Verificar permisos
    const hasPermission = await checkPermissionsService(groupId, requesterId, ['OWNER', 'ADMIN', 'MOD'])
    if (!hasPermission) {
      throw new Error('No tienes permisos para aprobar membresías')
    }
    
    return await updateMemberRoleService(
      { groupId, userId, newRole: 'MEMBER' },
      requesterId
    )
  } catch (error) {
    logger.error('Error in approveMembershipService:', error)
    throw error
  }
}

// Servicio para banear miembro
export const banMemberService = async (
  groupId: string,
  userId: string,
  requesterId: string
) => {
  try {
    return await updateMemberRoleService(
      { groupId, userId, newRole: 'BANNED' },
      requesterId
    )
  } catch (error) {
    logger.error('Error in banMemberService:', error)
    throw error
  }
}