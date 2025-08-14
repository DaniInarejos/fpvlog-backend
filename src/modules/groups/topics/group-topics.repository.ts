import { Types } from 'mongoose'
import GroupTopic, { IGroupTopic } from './group-topics.models'
import { cacheService } from '../../../configs/cache'

export const createTopicRepository = async (topicData: Partial<IGroupTopic>): Promise<IGroupTopic> => {
  const topic = await GroupTopic.create(topicData)
  await cacheService.deleteMany([`group:${topicData.groupId}:topics:*`])
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
  
  const topic = await GroupTopic.findByIdAndUpdate(
    id,
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).populate('createdBy', 'username name lastName profilePicture')
  
  if (topic) {
    await cacheService.deleteMany([
      `topic:${id}`,
      `group:${topic.groupId}:topics:*`
    ])
  }
  
  return topic
}

export const deleteTopicRepository = async (id: string): Promise<boolean> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('ID de tema inválido')
  }
  
  const topic = await GroupTopic.findById(id)
  if (!topic) {
    return false
  }
  
  await GroupTopic.findByIdAndDelete(id)
  await cacheService.deleteMany([
    `topic:${id}`,
    `group:${topic.groupId}:topics:*`
  ])
  
  return true
}

export const incrementPostCountRepository = async (topicId: string): Promise<void> => {
  if (!Types.ObjectId.isValid(topicId)) {
    throw new Error('ID de tema inválido')
  }
  
  await GroupTopic.findByIdAndUpdate(
    topicId,
    { 
      $inc: { postsCount: 1 },
      lastActivity: new Date()
    }
  )
  
  await cacheService.deleteMany([
    `topic:${topicId}`,
    `group:*:topics:*`
  ])
}

export const decrementPostCountRepository = async (topicId: string): Promise<void> => {
  if (!Types.ObjectId.isValid(topicId)) {
    throw new Error('ID de tema inválido')
  }
  
  await GroupTopic.findByIdAndUpdate(
    topicId,
    { $inc: { postsCount: -1 } }
  )
  
  await cacheService.deleteMany([
    `topic:${topicId}`,
    `group:*:topics:*`
  ])
}