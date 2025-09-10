import { Schema, model, Document, Types } from 'mongoose'

export interface IGroup extends Document {
  name: string
  description?: string
  createdAt: Date
  createdBy: Types.ObjectId
  isPrivate: boolean
  avatarUrl?: string
  bannerUrl?: string
  membersCount: number
  postsCount: number
  tags?: string[]
}

const groupSchema = new Schema<IGroup>({
  name: {
    type: String,
    required: [true, 'El nombre del grupo es requerido'],
    trim: true,
    maxlength: [500, 'El nombre no puede exceder 500 caracteres']
  },
  description: {
    type: String,
    maxlength: [5000, 'La descripción no puede exceder 5000 caracteres']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El creador del grupo es requerido']
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  avatarUrl: {
    type: String,
    default: null
  },
  bannerUrl: {
    type: String,
    default: null
  },
  membersCount: {
    type: Number,
    default: 0
  },
  postsCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }]
})

// Índices
groupSchema.index({ name: 'text', description: 'text' })
groupSchema.index({ createdBy: 1 })
groupSchema.index({ isPrivate: 1 })
groupSchema.index({ tags: 1 })

export default model<IGroup>('Group', groupSchema)