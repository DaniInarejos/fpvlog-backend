import { Types } from 'mongoose'
import GroupTopic, { IGroupTopic } from './group-topics.models'
import Group from '../groups.models'
import { cacheService } from '../../../configs/cache'

export const createTopicRepository = async (topicData: Partial<IGroupTopic>): Promise<IGroupTopic> => {
  const topic = await GroupTopic.create(topicData)
  
  // Incrementar contador de posts en el grupo
  if (topicData.groupId) {
    await incrementGroupPostCountRepository(topicData.groupId.toString())
  }
    console.log(`group:${topicData.groupId}`)
   await cacheService.deletePattern(`group:${topicData.groupId}:topics:*`)
    await cacheService.deletePattern(`group:${topicData.groupId}`)
  return topic
}

export const findTopicByIdRepository = async (id: string): Promise<IGroupTopic | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('ID de tema inválido')
  }
  
  const cacheKey = `topic:${id}`
  return await cacheService.loadData<IGroupTopic | null>(
    cacheKey,
    async () => await GroupTopic.findById(id)
      .populate('createdBy', 'username name lastName profilePicture')
      .populate('groupId', 'name')
  )
}

export const findGroupTopicsRepository = async (groupId: string, page = 1, limit = 20) => {
  if (!Types.ObjectId.isValid(groupId)) {
    throw new Error('ID de grupo inválido1')
  }
  
  const skip = (page - 1) * limit
  const cacheKey = `group:${groupId}:topics:${page}:${limit}`
  
  return await cacheService.loadData(
    cacheKey,
    async () => {
      const [topics, total] = await Promise.all([
        GroupTopic.find({ groupId })
          .populate('createdBy', 'username name lastName profilePicture')
          .sort({ isPinned: -1, lastActivity: -1 })
          .skip(skip)
          .limit(limit),
        GroupTopic.countDocuments({ groupId })
      ])
      
      return {
        topics,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    }
  )
}

export const updateTopicRepository = async (id: string, updateData: Partial<IGroupTopic>): Promise<IGroupTopic | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('ID de tema inválido')
  }
  
  // Primero obtenemos el topic original para tener el groupId
  const originalTopic = await GroupTopic.findById(id)
  if (!originalTopic) {
    return null
  }
  
  const topic = await GroupTopic.findByIdAndUpdate(
    id,
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).populate('createdBy', 'username name lastName profilePicture')
  
  if (topic) {
    // Eliminar cache específico del topic
    await cacheService.delete(`topic:${id}`)
    
    // Eliminar todas las cache keys que coincidan con el patrón del grupo
    await cacheService.deletePattern(`group:${originalTopic.groupId}:topics:*`)
  }
  
  return topic
}

export const deleteTopicRepository = async (id: string): Promise<boolean> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('ID de tema inválido')
  }

  // Obtener el topic antes de eliminarlo para acceder al groupId
  const topic = await GroupTopic.findById(id)
  if (!topic) {
    return false
  }

  // Decrementar contador de posts del grupo antes de eliminar
  await decrementGroupPostCountRepository(topic.groupId.toString())

  const result = await GroupTopic.findByIdAndDelete(id)
  
  if (result) {
    await cacheService.deletePattern(`group:${result.groupId}:topics:*`)
    await cacheService.deletePattern(`group:${result.groupId}`)
    return true
  }
  
  return false
}

export const incrementChatCountRepository = async (topicId: string): Promise<void> => {
  if (!Types.ObjectId.isValid(topicId)) {
    throw new Error('ID de tema inválido')
  }
  
  await GroupTopic.findByIdAndUpdate(
    topicId,
    { 
      $inc: { chatCount: 1 },
      lastActivity: new Date()
    }
  )
  
  await cacheService.deleteMany([
    `topic:${topicId}`,
    `group:*:topics:*`
  ])
}

export const decrementChatCountRepository = async (topicId: string): Promise<void> => {
  if (!Types.ObjectId.isValid(topicId)) {
    throw new Error('ID de tema inválido')
  }
  
  await GroupTopic.findByIdAndUpdate(
    topicId,
    { $inc: { chatCount: -1 } }
  )
  
  await cacheService.deleteMany([
    `topic:${topicId}`,
    `group:*:topics:*`
  ])
}

export const incrementGroupPostCountRepository = async (groupId: string): Promise<void> => {
  if (!Types.ObjectId.isValid(groupId)) {
    throw new Error('ID de grupo inválido')
  }
  
  await Group.findByIdAndUpdate(
    groupId,
    { $inc: { postsCount: 1 } }
  )
  
  await cacheService.deletePattern(`group:${groupId}:*`)
}

export const decrementGroupPostCountRepository = async (groupId: string): Promise<void> => {
  if (!Types.ObjectId.isValid(groupId)) {
    throw new Error('ID de grupo inválido')
  }
  
  await Group.findByIdAndUpdate(
    groupId,
    { $inc: { postsCount: -1 } }
  )
  
  await cacheService.deletePattern(`group:${groupId}:*`)
}