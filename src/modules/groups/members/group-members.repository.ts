import { Types } from 'mongoose'
import GroupMember, { IGroupMember, GroupRole } from './group-members.models'
import Group from '../groups.models'
import { cacheService } from '../../../configs/cache'

export const addMemberRepository = async (groupId: string, userId: string, role: GroupRole = 'MEMBER'): Promise<IGroupMember> => {
  if (!Types.ObjectId.isValid(groupId) || !Types.ObjectId.isValid(userId)) {
    throw new Error('IDs inválidos')
  }
  
  const member = await GroupMember.create({
    groupId,
    userId,
    role
  })
  
  // Incrementar contador de miembros si no es PENDING o BANNED
  if (role !== 'PENDING' && role !== 'BANNED') {
    await Group.findByIdAndUpdate(groupId, { $inc: { membersCount: 1 } })
  }
  
  await cacheService.deleteMany([`group:${groupId}:members`, `user:${userId}:groups`, `group:${groupId}`])
  
  return member
}

export const findMemberRepository = async (groupId: string, userId: string): Promise<IGroupMember | null> => {

  return await GroupMember.findOne({ groupId, userId })
    .populate('userId', 'username name lastName profilePicture')
}

export const findGroupMembersRepository = async (groupId: string, page = 1, limit = 20, roles?: string[]) => {
  if (!Types.ObjectId.isValid(groupId)) {
    throw new Error('ID de grupo inválido3')
  }
  
  const skip = (page - 1) * limit
  
  const filter: any = { groupId }
  if (roles && roles.length > 0) {
    filter.role = { $in: roles }
  } else {
    filter.role = { $nin: ['BANNED', 'PENDING'] }
  }
  
  const [members, total] = await Promise.all([
    GroupMember.find(filter)
      .populate('userId', 'username name lastName profilePicture')
      .sort({ role: 1, joinedAt: 1 })
      .skip(skip)
      .limit(limit),
    GroupMember.countDocuments(filter)
  ])
  
  return {
    members,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  }
}

export const countMembersRepository = async (groupId: string, roles?: string[]): Promise<number> => {
  if (!Types.ObjectId.isValid(groupId)) {
    throw new Error('ID de grupo inválido2')
  }
  
  const filter: any = { groupId }
  if (roles && roles.length > 0) {
    filter.role = { $in: roles }
  }
  
  return await GroupMember.countDocuments(filter)
}

export const updateMemberRoleRepository = async (groupId: string, userId: string, newRole: GroupRole): Promise<IGroupMember | null> => {
  if (!Types.ObjectId.isValid(groupId) || !Types.ObjectId.isValid(userId)) {
    throw new Error('IDs inválidos')
  }
  
  const member = await GroupMember.findOneAndUpdate(
    { groupId, userId },
    { $set: { role: newRole } },
    { new: true }
  ).populate('userId', 'username name lastName profilePicture')
  
  if (member) {
    await cacheService.deleteMany([`group:${groupId}:members`, `user:${userId}:groups`, `group:${groupId}`])
  }
  
  return member
}

export const removeMemberRepository = async (groupId: string, userId: string): Promise<boolean> => {
  if (!Types.ObjectId.isValid(groupId) || !Types.ObjectId.isValid(userId)) {
    throw new Error('IDs inválidos')
  }
  
  const result = await GroupMember.findOneAndDelete({ groupId, userId })
  
  if (result && result.role !== 'PENDING' && result.role !== 'BANNED') {
    await Group.findByIdAndUpdate(groupId, { $inc: { membersCount: -1 } })
  }
  
  if (result) {
    await cacheService.deleteMany([`group:${groupId}:members`, `user:${userId}:groups`, `group:${groupId}`])
  }
  
  return result !== null
}

export const findUserGroupsRepository = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('ID de usuario inválido')
  }
  
  const cacheKey = `user:${userId}:groups`
  return await cacheService.loadData(
    cacheKey,
    async () => {
      const memberships = await GroupMember.find({ 
        userId, 
        role: { $nin: ['BANNED', 'PENDING'] } 
      })
      .populate({
        path: 'groupId',
        populate: {
          path: 'createdBy',
          select: 'username'
        }
      })
      .sort({ joinedAt: -1 })
      
      return memberships.map(membership => ({
        group: membership.groupId,
        role: membership.role,
        joinedAt: membership.joinedAt
      }))
    }
  )
}