import { Schema, model, Document, Types } from 'mongoose'

export interface IGroupTopic extends Document {
  groupId: Types.ObjectId
  title: string
  description?: string
  createdBy: Types.ObjectId
  isPinned: boolean
  postsCount: number
  lastActivity: Date
  createdAt: Date
  updatedAt?: Date
}

const groupTopicSchema = new Schema<IGroupTopic>({
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: [true, 'El ID del grupo es requerido']
  },
  title: {
    type: String,
    required: [true, 'El título del tema es requerido'],
    trim: true,
    maxlength: [500, 'El título no puede exceder 500 caracteres']
  },
  description: {
    type: String,
    maxlength: [100000, 'La descripción no puede exceder 100000 caracteres']
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El creador del tema es requerido']
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  postsCount: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
})

// Índices
groupTopicSchema.index({ groupId: 1, isPinned: -1, lastActivity: -1 })
groupTopicSchema.index({ createdBy: 1 })
groupTopicSchema.index({ title: 'text', description: 'text' })

export default model<IGroupTopic>('GroupTopic', groupTopicSchema)