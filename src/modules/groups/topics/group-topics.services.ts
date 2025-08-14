import { IGroupTopic } from './group-topics.models'
import * as topicRepository from './group-topics.repository'
import * as memberRepository from '../members/group-members.repository'
import * as groupService from '../groups.services'
import { z } from 'zod'

const createTopicSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(500, 'El título es muy largo'),
  description: z.string().max(5000, 'La descripción es muy larga').optional()
})

const updateTopicSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(5000).optional(),
  isPinned: z.boolean().optional()
})
export const createTopicService = async (groupId: string, userId: string, topicData: unknown): Promise<IGroupTopic> => {
  const validatedData = createTopicSchema.parse(topicData)
  
  // Verificar que el usuario sea miembro del grupo
  const membership = await memberRepository.findMemberRepository(groupId, userId)
  if (!membership || ['BANNED', 'PENDING'].includes(membership.role)) {
    throw new Error('No tienes permisos para crear temas en este grupo')
  }
  
  const topic = await topicRepository.createTopicRepository({
    ...validatedData,
    groupId,
    createdBy: userId
  })
  
  return topic
}

export const getTopicService = async (topicId: string, userId?: string): Promise<IGroupTopic> => {
  const topic = await topicRepository.findTopicByIdRepository(topicId)
  
  if (!topic) {
    throw new Error('Tema no encontrado')
  }
  // Obtener información del grupo para verificar si es público o privado
  const group = await groupService.getGroupService(topic.groupId._id.toString())
  
  if (!group) {
    throw new Error('Grupo no encontrado')
  }
  
  // Si el grupo es privado, verificar membresía
  if (group.isPrivate) {
    if (!userId) {
      throw new Error('Autenticación requerida para grupos privados')
    }
    
    const membership = await memberRepository.findMemberRepository(topic.groupId._id.toString(), userId)
    if (!membership || ['BANNED', 'PENDING'].includes(membership.role)) {
      throw new Error('No tienes acceso a este tema de grupo privado')
    }
  }
  
  return topic
}

export const getGroupTopicsService = async (groupId: string, userId?: string, page = 1, limit = 20) => {
  // Obtener información del grupo para verificar si es público o privado
  const group = await groupService.getGroupService(groupId)
  
  if (!group) {
    throw new Error('Grupo no encontrado')
  }
  
  // Si el grupo es privado, verificar membresía
  if (group.isPrivate) {
    if (!userId) {
      throw new Error('Autenticación requerida para grupos privados')
    }
    
    const membership = await memberRepository.findMemberRepository(groupId, userId)
    if (!membership || ['BANNED', 'PENDING'].includes(membership.role)) {
      throw new Error('No tienes acceso a los temas de este grupo privado')
    }
  }
  
  return await topicRepository.findGroupTopicsRepository(groupId, page, limit)
}

export const updateTopicService = async (topicId: string, userId: string, updateData: unknown): Promise<IGroupTopic> => {
  const validatedData = updateTopicSchema.parse(updateData)
  
  const topic = await topicRepository.findTopicByIdRepository(topicId)
  if (!topic) {
    throw new Error('Tema no encontrado')
  }
  
  // Verificar permisos
  const membership = await memberRepository.findMemberRepository(topic.groupId._id.toString(), userId)
  if (!membership) {
    throw new Error('No eres miembro de este grupo')
  }
  
  // Solo el creador, admins u owners pueden editar
  const canEdit = topic.createdBy._id.toString() === userId || 

                 ['OWNER', 'ADMIN'].includes(membership.role)
  
  if (!canEdit) {
    throw new Error('No tienes permisos para editar este tema')
  }

  
  const updatedTopic = await topicRepository.updateTopicRepository(topicId, validatedData)
  
  if (!updatedTopic) {
    throw new Error('Error al actualizar el tema')
  }
  
  return updatedTopic
}

export const deleteTopicService = async (topicId: string, userId: string): Promise<void> => {
  const topic = await topicRepository.findTopicByIdRepository(topicId)
  if (!topic) {
    throw new Error('Tema no encontrado')
  }
  
  // Verificar permisos
  const membership = await memberRepository.findMemberRepository(topic.groupId.toString(), userId)
  if (!membership) {
    throw new Error('No eres miembro de este grupo')
  }
  
  // Solo el creador, admins u owners pueden eliminar
  const canDelete = topic.createdBy.toString() === userId || 
                   ['OWNER', 'ADMIN'].includes(membership.role)
  
  if (!canDelete) {
    throw new Error('No tienes permisos para eliminar este tema')
  }
  
  const deleted = await topicRepository.deleteTopicRepository(topicId)
  
  if (!deleted) {
    throw new Error('Error al eliminar el tema')
  }
}
