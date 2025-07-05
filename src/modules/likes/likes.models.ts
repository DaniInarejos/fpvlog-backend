import { Schema, model, Document, Types } from 'mongoose'

export type TargetType = 'user' | 'drone' | 'flight'

export interface ILike extends Document {
  userId: Types.ObjectId
  targetId: Types.ObjectId
  targetType: TargetType
  createdAt: Date
}

const likeSchema = new Schema<ILike>({
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, 'El ID del usuario es requerido'],
    ref: 'User'
  },
  targetId: {
    type: Schema.Types.ObjectId,
    required: [true, 'El ID del objetivo es requerido']
  },
  targetType: {
    type: String,
    enum: ['user', 'drone', 'flight','spot'],
    required: [true, 'El tipo de objetivo es requerido']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Índice para contar likes rápidamente
likeSchema.index({ targetId: 1, targetType: 1 })

// Índice único para evitar likes duplicados
likeSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true })

export default model<ILike>('Like', likeSchema)