import { IGroup } from './groups.models'
import { GroupRole } from './members/group-members.models'
import * as groupRepository from './groups.repository'
import * as memberRepository from './members/group-members.repository'
import { z } from 'zod'

const createGroupSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre es muy largo'),
  description: z.string().max(500, 'La descripción es muy larga').optional(),
  isPrivate: z.boolean().default(false),
  tags: z.array(z.string()).max(10, 'Máximo 10 tags').optional()
})

const updateGroupSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  isPrivate: z.boolean().optional(),
  tags: z.array(z.string()).max(10).optional(),
  avatarUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional()
})

export const createGroupService = async (userId: string, groupData: unknown): Promise<IGroup> => {
  const validatedData = createGroupSchema.parse(groupData)
  
  const group = await groupRepository.createGroupRepository({
    ...validatedData,
    createdBy: userId as any
  })
  
  // Agregar al creador como OWNER
  await memberRepository.addMemberRepository(group._id.toString(), userId, 'OWNER')
  
  return group
}

export const getGroupService = async (groupId: string, userId?: string) => {
  const group = await groupRepository.findGroupByIdRepository(groupId)
  
  if (!group) {
    throw new Error('Grupo no encontrado')
  }
  
  // Si es privado, verificar que el usuario sea miembro
  if (group.isPrivate && userId) {
    const membership = await memberRepository.findMemberRepository(groupId, userId)
    if (!membership || membership.role === 'BANNED' || membership.role === 'PENDING') {
      throw new Error('No tienes acceso a este grupo')
    }
  }
  
  return group
}

export const getGroupsService = async (filters: any = {}, page = 1, limit = 10, userId?: string) => {
  // Si hay filtro createdBy, no aplicar restricciones de privacidad adicionales
  if (filters.createdBy) {
    // Solo aplicar el filtro createdBy directamente
    return await groupRepository.findGroupsRepository(filters, page, limit)
  }
  
  // Si no es admin, solo mostrar grupos públicos o donde el usuario es miembro
  if (userId) {
    const userGroups = await memberRepository.findUserGroupsRepository(userId)
    const userGroupIds = userGroups.map(ug => ug.group._id)
    
    filters = {
      ...filters,
      $or: [
        { _id: { $in: userGroupIds } }
      ]
    }
  } 
  
  return await groupRepository.findGroupsRepository(filters, page, limit)
}

export const updateGroupService = async (groupId: string, userId: string, updateData: unknown): Promise<IGroup> => {
  const validatedData = updateGroupSchema.parse(updateData)
  
  // Verificar permisos
  const membership = await memberRepository.findMemberRepository(groupId, userId)
  if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
    throw new Error('No tienes permisos para editar este grupo')
  }
  
  const updatedGroup = await groupRepository.updateGroupRepository(groupId, validatedData)
  
  if (!updatedGroup) {
    throw new Error('Grupo no encontrado')
  }
  
  return updatedGroup
}

export const deleteGroupService = async (groupId: string, userId: string): Promise<void> => {
  // Solo el OWNER puede eliminar el grupo
  const membership = await memberRepository.findMemberRepository(groupId, userId)
  if (!membership || membership.role !== 'OWNER') {
    throw new Error('Solo el propietario puede eliminar el grupo')
  }
  
  const deleted = await groupRepository.deleteGroupRepository(groupId)
  
  if (!deleted) {
    throw new Error('Grupo no encontrado')
  }
}

export const searchGroupsService = async (searchTerm: string, page = 1, limit = 10) => {
  if (!searchTerm || searchTerm.trim().length < 2) {
    throw new Error('El término de búsqueda debe tener al menos 2 caracteres')
  }
  
  return await groupRepository.searchGroupsRepository(searchTerm.trim(), page, limit)
}

export const joinGroupService = async (groupId: string, userId: string): Promise<void> => {
  const group = await groupRepository.findGroupByIdRepository(groupId)
  
  if (!group) {
    throw new Error('Grupo no encontrado')
  }
  
  // Verificar si ya es miembro
  const existingMembership = await memberRepository.findMemberRepository(groupId, userId)
  if (existingMembership) {
    if (existingMembership.role === 'BANNED') {
      throw new Error('Has sido baneado de este grupo')
    }
    if (existingMembership.role === 'PENDING') {
      throw new Error('Tu solicitud está pendiente de aprobación')
    }
    throw new Error('Ya eres miembro de este grupo')
  }
  
  // Si es privado, crear solicitud pendiente
  const role = group.isPrivate ? 'PENDING' : 'MEMBER'
  await memberRepository.addMemberRepository(groupId, userId, role)
}

// Agregar nuevo servicio para gestión de miembros
export const manageMemberService = async (
  groupId: string, 
  targetUserId: string, 
  action: 'approve' | 'reject' | 'ban' | 'unban' | 'promote' | 'demote', 
  adminUserId: string, 
  newRole?: GroupRole
): Promise<void> => {
  // Verificar permisos del admin
  const adminMembership = await memberRepository.findMemberRepository(groupId, adminUserId)
  if (!adminMembership || !['OWNER', 'ADMIN'].includes(adminMembership.role)) {
    throw new Error('No tienes permisos para gestionar miembros')
  }
  
  const targetMembership = await memberRepository.findMemberRepository(groupId, targetUserId)
  if (!targetMembership) {
    throw new Error('El usuario no es miembro del grupo')
  }
  
  // Verificar que no se pueda gestionar a un usuario con rol superior
  const roleHierarchy = { 'OWNER': 5, 'ADMIN': 4, 'MOD': 3, 'MEMBER': 2, 'PENDING': 1, 'BANNED': 0 }
  if (roleHierarchy[targetMembership.role] >= roleHierarchy[adminMembership.role] && adminMembership.role !== 'OWNER') {
    throw new Error('No puedes gestionar a un usuario con rol igual o superior al tuyo')
  }
  
  switch (action) {
    case 'approve':
      if (targetMembership.role !== 'PENDING') {
        throw new Error('El usuario no tiene solicitud pendiente')
      }
      await memberRepository.updateMemberRoleRepository(groupId, targetUserId, 'MEMBER')
      break
      
    case 'reject':
      if (targetMembership.role !== 'PENDING') {
        throw new Error('El usuario no tiene solicitud pendiente')
      }
      await memberRepository.removeMemberRepository(groupId, targetUserId)
      break
      
    case 'ban':
      if (targetMembership.role === 'OWNER') {
        throw new Error('No puedes banear al propietario')
      }
      await memberRepository.updateMemberRoleRepository(groupId, targetUserId, 'BANNED')
      break
      
    case 'unban':
      if (targetMembership.role !== 'BANNED') {
        throw new Error('El usuario no está baneado')
      }
      await memberRepository.updateMemberRoleRepository(groupId, targetUserId, 'MEMBER')
      break
      
    case 'promote':
    case 'demote':
      if (!newRole) {
        throw new Error('Rol requerido para promoción/degradación')
      }
      if (targetMembership.role === 'OWNER' && adminMembership.role !== 'OWNER') {
        throw new Error('Solo el propietario puede cambiar roles de otros propietarios')
      }
      if (newRole === 'OWNER' && adminMembership.role !== 'OWNER') {
        throw new Error('Solo el propietario puede asignar el rol de propietario')
      }
      await memberRepository.updateMemberRoleRepository(groupId, targetUserId, newRole)
      break
  }
}

export const getPendingMembersService = async (groupId: string, adminUserId: string, page = 1, limit = 20) => {
  // Verificar permisos
  const adminMembership = await memberRepository.findMemberRepository(groupId, adminUserId)
  if (!adminMembership || !['OWNER', 'ADMIN'].includes(adminMembership.role)) {
    throw new Error('No tienes permisos para ver solicitudes pendientes')
  }
  
  const skip = (page - 1) * limit
  
  const [members, total] = await Promise.all([
    memberRepository.findGroupMembersRepository(groupId, page, limit, ['PENDING']),
    memberRepository.countMembersRepository(groupId, ['PENDING'])
  ])
  
  return {
    members: members.members,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  }
}

export const transferOwnershipService = async (groupId: string, currentOwnerId: string, newOwnerId: string): Promise<void> => {
  // Verificar que el usuario actual es el propietario
  const currentOwnerMembership = await memberRepository.findMemberRepository(groupId, currentOwnerId)
  if (!currentOwnerMembership || currentOwnerMembership.role !== 'OWNER') {
    throw new Error('Solo el propietario puede transferir la propiedad')
  }
  
  // Verificar que el nuevo propietario es miembro
  const newOwnerMembership = await memberRepository.findMemberRepository(groupId, newOwnerId)
  if (!newOwnerMembership || ['BANNED', 'PENDING'].includes(newOwnerMembership.role)) {
    throw new Error('El usuario debe ser un miembro activo del grupo')
  }
  
  // Transferir propiedad
  await Promise.all([
    memberRepository.updateMemberRoleRepository(groupId, currentOwnerId, 'ADMIN'),
    memberRepository.updateMemberRoleRepository(groupId, newOwnerId, 'OWNER')
  ])
}

export const leaveGroupService = async (groupId: string, userId: string): Promise<void> => {
  const membership = await memberRepository.findMemberRepository(groupId, userId)
  
  if (!membership) {
    throw new Error('No eres miembro de este grupo')
  }
  
  if (membership.role === 'OWNER') {
    throw new Error('El propietario no puede abandonar el grupo. Transfiere la propiedad primero.')
  }
  
  await memberRepository.removeMemberRepository(groupId, userId)
}