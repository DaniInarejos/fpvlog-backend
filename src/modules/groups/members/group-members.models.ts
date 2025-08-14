import { Schema, model, Document, Types } from 'mongoose'

export type GroupRole = 'OWNER' | 'ADMIN' | 'MOD' | 'MEMBER' | 'PENDING' | 'BANNED'

export interface IGroupMember extends Document {
  groupId: Types.ObjectId
  userId: Types.ObjectId
  role: GroupRole
  joinedAt: Date
}

const groupMemberSchema = new Schema<IGroupMember>({
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: [true, 'El ID del grupo es requerido']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID del usuario es requerido']
  },
  role: {
    type: String,
    enum: ['OWNER', 'ADMIN', 'MOD', 'MEMBER', 'PENDING', 'BANNED'],
    default: 'MEMBER'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
})

// Índice compuesto único para evitar duplicados
groupMemberSchema.index({ groupId: 1, userId: 1 }, { unique: true })
groupMemberSchema.index({ userId: 1 })
groupMemberSchema.index({ role: 1 })

export default model<IGroupMember>('GroupMember', groupMemberSchema)