import { Types } from 'mongoose'
import Group, { IGroup } from './groups.models'
import GroupMember from './members/group-members.models'
import { cacheService } from '../../configs/cache'

export const createGroupRepository = async (groupData: Partial<IGroup>): Promise<IGroup> => {
  const group = await Group.create(groupData)
  await cacheService.deleteMany(['groups:*'])
  return group
}

export const findGroupByIdRepository = async (id: string): Promise<IGroup | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(`ID de grupo inválido6`)
  }
  
  const cacheKey = `group:${id}`
  return await cacheService.loadData<IGroup | null>(
    cacheKey,
    async () => await Group.findById(id).populate('createdBy', 'username name lastName profilePicture')
  )
}

export const findGroupsRepository = async (filters: any = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit
  
  const query = Group.find(filters)
    .populate('createdBy', 'username name lastName profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
  
  const [groups, total] = await Promise.all([
    query.exec(),
    Group.countDocuments(filters)
  ])
  
  return {
    groups,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  }
}

export const updateGroupRepository = async (id: string, updateData: Partial<IGroup>): Promise<IGroup | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('ID de grupo inválido5')
  }
  
  const group = await Group.findByIdAndUpdate(
    id,
    { $set: { ...updateData, updatedAt: new Date() } },
    { new: true }
  ).populate('createdBy', 'username name lastName profilePicture')
  
  if (group) {
    await cacheService.deleteMany([`group:${id}`, 'groups:*'])
  }
  
  return group
}

export const deleteGroupRepository = async (id: string): Promise<boolean> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('ID de grupo inválido4')
  }
  
  const result = await Group.findByIdAndDelete(id)
  
  if (result) {
    await cacheService.deleteMany([`group:${id}`, 'groups:*'])
    // También eliminar todos los miembros, posts y comentarios relacionados
    await GroupMember.deleteMany({ groupId: id })
  }
  
  return result !== null
}

export const searchGroupsRepository = async (searchTerm: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit
  
  const query = {
    $and: [
      { isPrivate: false },
      {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { tags: { $in: [new RegExp(searchTerm, 'i')] } }
        ]
      }
    ]
  }
  
  const [groups, total] = await Promise.all([
    Group.find(query)
      .populate('createdBy', 'username name lastName profilePicture')
      .sort({ membersCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Group.countDocuments(query)
  ])
  
  return {
    groups,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  }
}